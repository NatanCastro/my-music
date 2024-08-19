import { Injectable, OnModuleInit } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { CreateMusicDTO } from './dto/createMusic.DTO';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { musicSchema } from './schema/music.schema';

@Injectable()
export class MusicService implements OnModuleInit {
  connection: BetterSQLite3Database<Record<string, never>>;

  constructor(private readonly drizzleService: DrizzleService) { }

  onModuleInit() {
    this.connection = this.drizzleService.getDb();
  }

  createMusic(createDTO: CreateMusicDTO[]) {
    type insertMusic = typeof musicSchema.$inferInsert;
    this.connection.insert(musicSchema).values(
      createDTO.map<insertMusic>((dto) => {
        return {};
      }),
    );
  }
}
