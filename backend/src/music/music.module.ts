import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { SnowflakeService } from 'src/snowflake/snowflake.service';

@Module({
  controllers: [MusicController],
  providers: [MusicService],
  imports: [SnowflakeService],
})
export class MusicModule {}
