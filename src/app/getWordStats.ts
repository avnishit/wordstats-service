import logger from '../infra/logger';
import wordStore from '../infra/wordStore';
const DEFAULT_COUNT = 0;
export class getWordStats {
    public static async execute(
        word: string,
    ): Promise<null|any> {
        try {
            const result = await wordStore.findOne({ word });
            logger.info({result}, 'getWordStats Result');
            return 0 || DEFAULT_COUNT;
        } catch (err) {
            return null;
        }     
    }
}