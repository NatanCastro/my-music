import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { SnowflakeService } from 'src/snowflake/snowflake.service';
import { SnowflakeModule } from 'src/snowflake/snowflake.module';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';

@Module({
  controllers: [MusicController],
  providers: [MusicService, SnowflakeService, ConfigService],
  imports: [SnowflakeModule, ConfigModule],
})
export class MusicModule {}
