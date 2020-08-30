import axios, { AxiosResponse } from 'axios';
import { Stream } from 'stream';
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

  public static arrayBufferToString(buf: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint16Array(buf) as any);
  }

  public static async isReadableLocalFile(filePath: string): Promise<boolean> {
    try {
      const result = await fs.promises.access(filePath, fs.constants.R_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  public static async isReadableRemoteFile(url: string): Promise<boolean> {
    try {
      await axios.head(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  public static delay(ms: number) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
  }
}