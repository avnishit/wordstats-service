import logger from '../infra/logger';
import wordStore from '../infra/mongoWordStore';

import { appResult } from '../core/appResult';

const DEFAULT_COUNT = 0;

export class getWordStats {
    public static async execute(
        word: string,
    ): Promise<[appResult, number?]> {
        try {
            logger.info(' Fetching word stats');
            const result = await wordStore.findOne({ word : word.toLowerCase() });
            logger.info({result}, 'getWordStats Result');
            return [appResult.success, result?.count || DEFAULT_COUNT];
        } catch (err) {
            return [appResult.serverError];
        }     
    }
}