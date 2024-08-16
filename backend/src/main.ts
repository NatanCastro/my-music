import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MUSIC_FILE_PATH } from './constants';
import * as fs from 'node:fs';

async function bootstrap() {
  if (!fs.existsSync(MUSIC_FILE_PATH)) {
    fs.mkdirSync(MUSIC_FILE_PATH, { recursive: true });
  }
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
}
bootstrap();
