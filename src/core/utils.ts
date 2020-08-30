import axios, { AxiosResponse } from 'axios';
import { Stream, PassThrough } from 'stream';
import fs from 'fs';

export default class utils {
    public static getRemoteFileStream(fileUrl: string): Promise<AxiosResponse<Stream>> {
        return axios.get(fileUrl, {
          responseType: 'stream',
        });
    };

    public static async getLocalFileStream(filePath: string): Promise<Stream> {
        return fs.createReadStream(filePath);
    };

    public static arrayBufferToString(buf:ArrayBuffer):string {
        return String.fromCharCode.apply(null, new Uint16Array(buf) as any);
      }
}