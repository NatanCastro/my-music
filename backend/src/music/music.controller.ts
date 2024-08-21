import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Response,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response as Res } from 'express';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) { }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files) {
      throw new BadRequestException('no music files provided');
    }
    return this.musicService.upload(files);
  }

  @Get(':musicId/thumbnail')
  getThumbnail(@Param('musicId') musicId: string, @Response() res: Res) {
    const fileStream = this.musicService.getMusicThumbnail(musicId);
    fileStream.getStream().pipe(res);
  }
}
