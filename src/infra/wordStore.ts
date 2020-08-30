import mongoose from 'mongoose';

interface wordStoreInterface extends mongoose.Document {
  word: string;
  count: number;
}

let wordStoreSchema = new mongoose.Schema({
  word: { type: String, required: true },
  count: { type: Number, required: true }
});

wordStoreSchema.statics.bulkAddWithTransaction = async function (words: Map<string, number>): Promise<Boolean> {
  let promises: Promise<any>[] = [];
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (let [key, value] of words) {
      promises.push(this.findOneAndUpdate({ word: key }, { $inc: { 'count': value } }, { upsert: true, session }));
    }
    await Promise.all(promises);
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    return false;
  }
  return true;
};

const wordStore = mongoose.model<wordStoreInterface>('word', wordStoreSchema);

export default wordStore;

