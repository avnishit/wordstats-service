import logger from './infra/logger';
import mongoClient from './infra/mongoClient';
import taskQueue from './infra/taskQueue';
import presentationLayer from './presentation';


const start = async () => {
  await mongoClient.start();
  await taskQueue.start();
  await presentationLayer.start();
}

start()
.catch((error: Error) => {
    logger.error({ error }, 'Error while starting application:');
    process.exit(1);
})
