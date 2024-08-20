import { Injectable } from '@nestjs/common';
import { parentPort, Worker } from 'worker_threads';
import * as path from 'path';
import { SnowflakeService } from 'src/snowflake/snowflake.service';
import * as fs from 'fs';
import { ConfigService } from 'src/config/config.service';

// TODO: Handle saving relevant data to a database

@Injectable()
export class MusicService {
  constructor(
    private snowflakeService: SnowflakeService,
    private configService: ConfigService,
  ) {}
  async upload(files: Express.Multer.File[]) {
    files.forEach((file) => this.handleFile(file));

    return {
      message: 'music files saved successfully',
    };
  }

  private async handleFile(file: Express.Multer.File) {
    const fileId = this.snowflakeService.generateId();
    const fileExt = file.originalname.split('.').pop();

    await this.saveFileInWorkerThread(`${fileId}.${fileExt}`, file.buffer);
    const metadata = await this.extractMetadata(file.buffer, file.mimetype);
    console.log(metadata);
  }

  private async saveFileInWorkerThread(
    fileName: string,
    fileBuffer: Buffer,
  ): Promise<void> {
    const workerData = {
      filename: fileName,
      uploadDir: this.configService.getListItem('upload'),
    };

    return new Promise((resolve, reject) => {
      const worker = new Worker(path.join(__dirname, 'save-music.worker.js'), {
        workerData,
      });

      worker.postMessage({ fileBuffer });

      worker.on('message', (message: string) => {
        console.log(message);
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
    const { parseBuffer } = await import('music-metadata');
    const metadata = await parseBuffer(fileBuffer, fileMimeType);
    return {
      title: metadata.common.title || 'Unknown Title',
      artist: metadata.common.artist || 'Unknown Artist',
      album: metadata.common.album || 'Unknown Album',
      year: metadata.common.year?.toString() || 'Unknown Year',
      duration: metadata.format.duration || 0,
    };
  }

  saveToDisk(data: { uploadDir: string; filename: string }) {
    parentPort.once('message', ({ fileBuffer }: { fileBuffer: Buffer }) => {
      try {
        if (!fs.existsSync(data.uploadDir)) {
          fs.mkdirSync(data.uploadDir, { recursive: true });
        }

        const filePath = path.join(data.uploadDir, data.filename);
        fs.createWriteStream(filePath).end(fileBuffer);

        parentPort.postMessage(`music ${data.filename}\n saved successfully`);
      } catch (error) {
        parentPort.postMessage('Error saving file: ' + error.message);
      }
    });
  }
}
