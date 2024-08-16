import { workerData } from 'worker_threads';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { MusicService } from './music.service';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const musicService = app.get(MusicService);

  const data = workerData;

  musicService.saveMusic(data);
}

run();
