import logger from './logger';
import mongoose from 'mongoose';

export default class mongoClient {
  private static uri: string = "mongodb://mongo:27017/wordstats";
  public static async start() {
    mongoose.set('debug', true);
    await mongoose.connect(mongoClient.uri, { useNewUrlParser: true });
    logger.info('Connected to Mongo');
  }
}
