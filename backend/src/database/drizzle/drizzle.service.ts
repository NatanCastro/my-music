import { Injectable, OnModuleInit } from '@nestjs/common';
import Sqlite from 'better-sqlite3';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class DrizzleService implements OnModuleInit {
  constructor(private configService: ConfigService) {}
  private db: BetterSQLite3Database<Record<string, never>>;

  onModuleInit() {
    const sqlite = new Sqlite(this.configService.getListItem('db.sqlite3'));
    this.db = drizzle(sqlite);
  }

  getDb() {
    return this.db;
  }
}
