import { Module } from '@nestjs/common';
import { DrizzleService } from './drizzle/drizzle.service';
import { MusicService } from './music/music.service';
import { ConfigService } from 'src/config/config.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  providers: [DrizzleService, MusicService, ConfigService],
  imports: [ConfigModule],
})
export class DatabaseModule {}
