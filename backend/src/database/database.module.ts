import { Module } from '@nestjs/common';
import { DrizzleService } from './drizzle/drizzle.service';
import { MusicService } from './music/music.service';

@Module({
  providers: [DrizzleService, MusicService]
})
export class DatabaseModule {}
