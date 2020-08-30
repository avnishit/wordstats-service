import pino from 'pino';
import configuration from '../configuration';

const logger: pino.Logger = pino({level: configuration.logLevel});

export default logger;
