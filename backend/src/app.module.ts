import { Module } from '@nestjs/common';
import { MusicModule } from './music/music.module';
import { SnowflakeModule } from './snowflake/snowflake.module';

@Module({
  imports: [MusicModule, SnowflakeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
