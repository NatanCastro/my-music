import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    this.musicService.upload(files);
  }
}
