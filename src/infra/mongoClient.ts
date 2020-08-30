import mongoose from 'mongoose';
import logger from './logger';
import configuration from '../configuration';

export default class mongoClient {
  private static uri: string = configuration.mongoUri;
  public static async start() {
    mongoose.set('debug', configuration.mongooseDebugMode);
    await mongoose.connect(mongoClient.uri, { useNewUrlParser: true, useFindAndModify: false });
    logger.info('Connected to Mongo');
  }
}
