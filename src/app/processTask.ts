import { task } from '../core/task';
import logger from '../infra/logger';
import wordStore from '../infra/wordStore';

export class processTask {

    public static async execute(
        task: task,
    ): Promise<null> {
        try {
            const word = new wordStore({
                word: 'dummy',
                count: 1
            });
            const result = await word.save();
            return null;
        } catch (error) {
            return null ;
        }
    }
}