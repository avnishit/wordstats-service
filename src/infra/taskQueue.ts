import logger from '../infra/logger';
import queue from '../core/queue';
import { task } from '../core/task';
import { processTask } from '../app/processTask';

const QUEUE_DELAY = 5000;

class taskQueue {
    private static instance: taskQueue = new taskQueue();

    public static getInstance(): taskQueue {
        return taskQueue.instance;
    }

    private constructor() {
        if (taskQueue.instance) {
            throw new Error("Error - use taskQueue.getInstance()");
        }
        this.tasks = new queue<task>();
    }

    public add(task: task) {
        this.tasks.push(task);
    }

    public async run(): Promise<any> {
        setTimeout(async () => {
            const nextTask = this.tasks.peek();
            if (nextTask) {
                logger.info({ task: nextTask }, 'Processing Next Task');

                const [success, err] = await processTask.execute(nextTask as task);
                this.tasks.pop();
                if (!success) {
                    logger.error({err}, 'Task Queue Processing Error');
                }
            } else {
                logger.info('Task Queue Empty');
            }
            this.run();
        }, QUEUE_DELAY);
        return null;
    }

    public async start() {
        this.run();
    }

    tasks: queue<task>;
}

export default taskQueue.getInstance();
