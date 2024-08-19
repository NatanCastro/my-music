import { Module } from '@nestjs/common';
import { MusicModule } from './music/music.module';
import { SnowflakeModule } from './snowflake/snowflake.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [MusicModule, SnowflakeModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
