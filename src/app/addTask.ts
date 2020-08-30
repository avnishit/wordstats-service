import wordStore from '../infra/wordStore';
import { task } from '../core/task';
import taskQueue from '../infra/taskQueue';
export class addTask {
    public static async execute(
        input: string,
        type: task.inputType
    ): Promise<Boolean> {
        try {
            const inputTask = task.create({ input, type });
            taskQueue.add(inputTask);
            return true;
        } catch (error) {
            return false;
        }
    }
}