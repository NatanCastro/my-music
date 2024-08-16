import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import * as path from 'path';
import { parseBuffer } from 'music-metadata';
import { SnowflakeService } from 'src/snowflake/snowflake.service';

// TODO: Handle saving relevant data to a database

@Injectable()
export class MusicService {
  constructor(private readonly snowflakeService: SnowflakeService) { }
  async upload(files: Express.Multer.File[]) {
    files.forEach(this.handleFile);
  }

  private async handleFile(file: Express.Multer.File) {
    const fileId = this.snowflakeService.generate();
    await this.saveFileInWorkerThread(fileId, file.buffer);
    const metadata = await this.extractMetadata(file.buffer, file.mimetype);
    console.log(metadata);
  }

  private async saveFileInWorkerThread(
    fileName: string,
    fileBuffer: Buffer,
  ): Promise<void> {
    const workerData = {
      fileBuffer: fileBuffer,
      filename: fileName,
      // TODO: move the path to the folder to a separate location
      uploadDir: path.join(__dirname, '..', '..', 'uploads'),
    };

    return new Promise((resolve, reject) => {
      const worker = new Worker(path.join(__dirname, 'file-save.worker.js'), {
        workerData,
      });

      worker.on('message', () => {
        resolve();
      });

      worker.on('error', (err) => {
        reject(err);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  private async extractMetadata(fileBuffer: Buffer, fileMimeType: string) {
    const metadata = await parseBuffer(fileBuffer, fileMimeType);
    return {
      title: metadata.common.title || 'Unknown Title',
      artist: metadata.common.artist || 'Unknown Artist',
      album: metadata.common.album || 'Unknown Album',
      year: metadata.common.year.toString() || 'Unknown Year',
      duration: metadata.format.duration || 0,
    };
  }
}
