import { Module } from '@nestjs/common';
import { MusicModule } from './music/music.module';
import { SnowflakeModule } from './snowflake/snowflake.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [MusicModule, SnowflakeModule, DatabaseModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
