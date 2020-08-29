import mongoose from 'mongoose';

export interface wordStoreInterface extends mongoose.Document {
  word: string;
  count: number;
}

export const wordStoreSchema = new mongoose.Schema({
  word: { type: String, required: true },
  count: { type: Number, required: true }
});

const wordStore = mongoose.model<wordStoreInterface>('word', wordStoreSchema);
export default wordStore;
