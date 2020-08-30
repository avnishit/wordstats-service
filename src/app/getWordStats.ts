import logger from '../infra/logger';
import wordStore from '../infra/wordStore';
const DEFAULT_COUNT = 0;
export class getWordStats {
    public static async execute(
        word: string,
    ): Promise<number|null> {
        try {
            const result = await wordStore.findOne({ word });
            logger.info({result}, 'getWordStats Result');
            return result?.count || DEFAULT_COUNT;
        } catch (err) {
            return null;
        }     
    }
}