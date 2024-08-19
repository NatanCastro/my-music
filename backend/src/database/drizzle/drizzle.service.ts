import { Injectable, OnModuleInit } from '@nestjs/common';
import Sqlite from 'better-sqlite3';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { DEV_DB } from 'src/constants';

@Injectable()
export class DrizzleService implements OnModuleInit {
  private db: BetterSQLite3Database<Record<string, never>>;

  onModuleInit() {
    const sqlite = new Sqlite(DEV_DB);
    this.db = drizzle(sqlite);
  }

  getDb() {
    return this.db;
  }
}
