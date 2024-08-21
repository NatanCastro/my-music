import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { parentPort, Worker } from 'worker_threads';
import * as path from 'path';
import { SnowflakeService } from 'src/snowflake/snowflake.service';
import * as fs from 'fs';
import { ConfigService } from 'src/config/config.service';
import { AudioFiles, GroupedAudioFiles } from './types';

// TODO: Handle saving relevant data to a database

@Injectable()
export class MusicService {
  constructor(
    private snowflakeService: SnowflakeService,
    private configService: ConfigService,
  ) { }

  getMusicThumbnail(musicId: string): StreamableFile {
    const thumbnailFilePath = path.join(
      this.configService.getListItem('music-thumbnail'),
      `${musicId}-thumbnail.jpeg`,
    );

    if (fs.existsSync(thumbnailFilePath)) {
      throw new NotFoundException('Thumbnail not found');
    }

    const fileStream = fs.createReadStream(thumbnailFilePath[0]);
    return new StreamableFile(fileStream);
  }

  async upload(files: Express.Multer.File[]) {
    const groupedFiles: GroupedAudioFiles = new Map();
    let originalFile: Express.Multer.File | null = null;
    let compressedFile: Express.Multer.File | null = null;
    files.forEach((file) => {
      const [name, type, extension] = file.originalname.split('.');
      console.log(name, type, extension);

      if (!(type === 'original' || type === 'compressed')) {
        throw new BadRequestException();
      }

      switch (type) {
        case 'original':
          originalFile = file;
        case 'compressed':
          compressedFile = file;
      }

      if (originalFile && compressedFile) {
        groupedFiles.set(name, {
          original: originalFile,
          compressed: compressedFile,
          extension,
        });

        originalFile = null;
        compressedFile = null;
      }
    });
    console.log(groupedFiles);

    groupedFiles.forEach((group) => this.handleFile(group));

    return {
      message: 'music files saved successfully',
    };
  }

  private async handleFile(files: AudioFiles) {
    const fileId = this.snowflakeService.generateId();
    const compressedFileName = `${fileId}-compressed.${files.extension}`;
    const compressedFilePath = path.join(
      this.configService.getListItem('music'),
      'compressed',
    );
    const originalFileName = `${fileId}-original.${files.extension}`;
    const originalFilePath = path.join(
      this.configService.getListItem('music'),
      'original',
    );

    const metadata = await this.extractMetadata(
      files.original.buffer,
      files.original.mimetype,
    );
    const thumbnailFileName = `${fileId}-thumbnail.${metadata.cover.format.split('/')[1]}`;
    const thumbnailFilePath = this.configService.getListItem('music-thumbnail');

    console.log(thumbnailFileName, thumbnailFilePath);

    Promise.all([
      this.saveFileInWorkerThread(
        compressedFileName,
        compressedFilePath,
        files.compressed.buffer,
      ),
      this.saveFileInWorkerThread(
        originalFileName,
        originalFilePath,
        files.original.buffer,
      ),
      this.saveFileInWorkerThread(
        thumbnailFileName,
        thumbnailFilePath,
        Buffer.from(metadata.cover.data),
      ),
    ]);
  }

  private async saveFileInWorkerThread(
    fileName: string,
    savePath: string,
    fileBuffer: Buffer,
  ): Promise<void> {
    const workerData = {
      filename: fileName,
      uploadDir: savePath,
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

    let cover: { data: Uint8Array; format: string } | null = null;
    if (metadata.common.picture && metadata.common.picture.length > 0) {
      cover = {
        data: metadata.common.picture[0].data,
        format: metadata.common.picture[0].format,
      };
    }

    return {
      title: metadata.common.title || 'Unknown Title',
      artist: metadata.common.artist || 'Unknown Artist',
      album: metadata.common.album || 'Unknown Album',
      year: metadata.common.year?.toString() || 'Unknown Year',
      duration: metadata.format.duration || 0,
      cover,
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
