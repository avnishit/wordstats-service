import logger from './logger';
import mongoose from 'mongoose';

export default class mongoClient {
  private static uri: string = "mongodb://mongo:27017/local";
  public static async start() {
    await mongoose.connect(mongoClient.uri, { useNewUrlParser: true });
    logger.info('Connected to Mongo');
  }
}
