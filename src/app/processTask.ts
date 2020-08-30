
import { ReadStream } from 'fs';
import { AxiosResponse } from 'axios';
import { Transform } from 'stream';

import { task } from '../core/models/task';
import logger from '../infra/logger';
import wordStore from '../infra/mongoWordStore';
import utils from '../core/utils';
import voca from 'voca';
import configuration from '../configuration';

type wordsDictionary = Map<string, number>;

export class processTask {
    public static async execute(
        taskToProcess: task,
    ): Promise<[boolean, Error?]> {
        try {
            const { input, type } = taskToProcess;
            if (configuration.useTransaction) {
                await processTask.processInputWithTransaction(input, type);             
            } else {
                await processTask.processInputWithoutTransaction(input, type);
            }
            return [true];
        } catch (error) {
            return [false, error];
        }
    }

    private static async processTextInput(input: string, withTransaction: boolean) {
        const words: wordsDictionary = new Map();
        voca.words(input).forEach(($item: string) => {
            const item: string = $item.toLowerCase();
            if (words.has(item)) {
                words.set(item, words.get(item) as number + 1);
            } else {
                words.set(item, 1);
            }
        });
        await (wordStore as any).bulkUpdate(words, withTransaction);
    }

    private static async processInputWithoutTransaction(input: string, type: task.inputType) {
        try {
            let readStream: any;
            if (type === task.inputType.remoteFileUrl) readStream = await utils.getRemoteFileStream(input);
            else if (type === task.inputType.localFilePath) readStream = await utils.getLocalFileStream(configuration.baseLocalFolder + input);
            else return processTask.processTextInput(input, false);
            const transform = processTask.processAndBulkWriteTransform(readStream);
            const stream = (type === task.inputType.remoteFileUrl) ? readStream.data : readStream;
            stream.pipe(transform);
            logger.info('Processing Complete');
            return true;
        } catch (error) {
            logger.error({ error }, 'Processing Error');
            return false;
        }
    }

    private static processAndBulkWriteTransform(
        stream: ReadStream | AxiosResponse,
    ): Transform {
        let myTransform = new Transform({
            async transform(chunk, encoding, cb) {
                const words: wordsDictionary = new Map();
                const stringChunk = utils.arrayBufferToString(chunk);
                voca.words(stringChunk).forEach(($item: string) => {
                    const item: string = $item.toLowerCase();
                    logger.trace({ item }, 'Processing String Chunk');
                    if (words.has(item)) {
                        words.set(item, words.get(item) as number + 1);
                    } else {
                        words.set(item, 1);
                    }
                });
                await (wordStore as any).bulkUpdate(words, false);
                cb();
           },
           async flush(cb) {
               cb();
           }
         });
        return myTransform;
    };

    private static async processInputWithTransaction(input: string, type: task.inputType) {
        let readStream: any;
        if (type === task.inputType.remoteFileUrl) readStream = await utils.getRemoteFileStream(input);
        else if (type === task.inputType.localFilePath) readStream = await utils.getLocalFileStream(configuration.baseLocalFolder + input);
        else return processTask.processTextInput(input, true);

        return new Promise(async (resolve, reject) => {
            const words: wordsDictionary = new Map();
            const stream = (type === task.inputType.remoteFileUrl) ? readStream.data : readStream;
            stream.on('data', async (chunk: ArrayBuffer) => {
                const stringChunk = utils.arrayBufferToString(chunk);
                voca.words(stringChunk).forEach(($item: string) => {
                    const item: string = $item.toLowerCase();
                    logger.trace({ item }, 'Processing String Chunk');
                    if (words.has(item)) {
                        words.set(item, words.get(item) as number + 1);
                    } else {
                        words.set(item, 1);
                    }
                });
            });
            stream.on('end', async () => {
                logger.info('Processing Complete');
                await (wordStore as any).bulkUpdate(words, true);
                resolve();
            });
            stream.on('error', () => {
                logger.error('Processing Error');
                reject();
            });
        })
    }

}