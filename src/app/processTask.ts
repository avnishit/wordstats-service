import { task } from '../core/task';
import logger from '../infra/logger';
import wordStore from '../infra/wordStore';
import utils from '../core/utils';
import voca from 'voca';

type wordDict = Map<string, number>;

export class processTask {
    public static async execute(
        taskToProcess: task,
    ): Promise<[boolean, Error?]> {
        try {
            const { input, type } = taskToProcess;
            let words = await processTask.processFileStream(input, type);
            logger.info({ words: [...words] }, 'Received Input for DB Update');
            await (wordStore as any).bulkAddWithTransaction(words);
            return [true];
        } catch (error) {
            return [false, error];
        }
    }

    private static async processTextInput(input: string): Promise<wordDict> {
        const words: wordDict = new Map();
        voca.words(input).forEach(($item: string) => {
            const item: string = $item.toLowerCase();
            if (words.has(item)) {
                words.set(item, words.get(item) as number + 1);
            } else {
                words.set(item, 1);
            }
        });
        return words;
    }

    private static async processFileStream(url: string, type:task.inputType): Promise<wordDict> {
        let readStream: any;
        if(type === task.inputType.remoteFileUrl) readStream = await utils.getRemoteFileStream(url);
        else if (type === task.inputType.localFileUrl) readStream = await utils.getLocalFileStream(url);
        else return processTask.processTextInput(url);
        
        return new Promise(async (resolve) => {
            const words: wordDict = new Map();
            const stream = (type === task.inputType.remoteFileUrl) ? readStream.data : readStream;
            stream.on('data', (chunk: ArrayBuffer) => {
                const stringChunk = utils.arrayBufferToString(chunk);
                voca.words(stringChunk).forEach(($item: string) => {
                    const item: string = $item.toLowerCase();
                    logger.info({ item }, 'Processing String Chunk');
                    if (words.has(item)) {
                        words.set(item, words.get(item) as number + 1);
                    } else {
                        words.set(item, 1);
                    }
                });
            });
            stream.on('end', () => {
                logger.info('Processing Complete');
                resolve(words);
            });
            stream.on('error', () => {
                logger.error('Processing Error');
                resolve();
            });
        })
    }
}