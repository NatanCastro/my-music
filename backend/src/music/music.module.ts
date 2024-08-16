import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { SnowflakeService } from 'src/snowflake/snowflake.service';
import { SnowflakeModule } from 'src/snowflake/snowflake.module';

@Module({
  controllers: [MusicController],
  providers: [MusicService, SnowflakeService],
  imports: [SnowflakeModule],
})
export class MusicModule {}
