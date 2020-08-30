import mongoose, { ClientSession } from 'mongoose';
import logger from './logger';

const MAX_PARALLEL_COMMANDS = 25;

interface wordStoreInterface extends mongoose.Document {
  word: string;
  count: number;
}

let wordStoreSchema = new mongoose.Schema({
  word: { type: String, required: true, index: { unique: true } },
  count: { type: Number, required: true }
});

wordStoreSchema.statics.bulkUpdate = async function (words: Map<string, number>, withTransaction: boolean): Promise<boolean> {
  let promises: Promise<any>[] = [];
  let session: ClientSession = await mongoose.startSession();

  const updateConfig: any = {
    upsert: true
  }

  if (withTransaction) {
    session.startTransaction();
    updateConfig['session'] = session;
  }

  try {
    logger.info('Upserting docs:' + words.size)
    for (let [key, value] of words) {
      promises.push(this.findOneAndUpdate({ word: key }, { $inc: { 'count': value } }, updateConfig));
    }

    const operationsLen = promises.length;
    let indexStart = 0;
    let indexEnd = indexStart + MAX_PARALLEL_COMMANDS;
    while (indexStart < operationsLen) {
      if (indexEnd > operationsLen) indexEnd = operationsLen;
      await Promise.all(promises.slice(indexStart, indexEnd));
      logger.info('Upserted docs:' + (indexEnd-indexStart+1).toString());
      indexStart = indexEnd;
      indexEnd = indexStart + MAX_PARALLEL_COMMANDS;
    }

    if (withTransaction) {
      await session.commitTransaction();
      session.endSession();
    }

  } catch (error) {
    if (withTransaction) {
      await session.abortTransaction();
    }
    return false;
  }
  logger.info('Upserted docs in batch:' + words.size);
  return true;
};

const wordStore = mongoose.model<wordStoreInterface>('word', wordStoreSchema);

export default wordStore;
