import { appResult } from '../core/appResult';
import { task } from '../core/models/task';
import utils from '../core/utils';
import logger from '../infra/logger';
import taskQueue from '../infra/taskQueue';
import configuration from '../configuration';

export class addTask {
    public static async execute(
        input: string,
        type: task.inputType
    ): Promise<appResult> {
        try {
            logger.info({ input, type }, 'Validating task');
            const isValidInput = await addTask.isValid(input, type);
            if (!isValidInput) {
                logger.info({ input, type },'Task validatiion failed');
                return appResult.badInput;
            }
            const inputTask = task.create({ input, type });
            taskQueue.add(inputTask);
            logger.info({ task: inputTask }, 'Task added');
            return appResult.success;
        } catch (error) {
            logger.error({ error },'Error adding task for processing');
            return appResult.serverError;
        }
    }

    private static async isValid(input: string, type: task.inputType): Promise<boolean> {
        let isValid = false;
        switch (type) {
            case task.inputType.localFilePath:
                isValid = await utils.isReadableLocalFile(configuration.baseLocalFolder + input);
                break;
            case task.inputType.remoteFileUrl:
                isValid = await utils.isReadableRemoteFile(input);
                break;
            default:
                isValid = true;
        }
        return isValid;
    }
}