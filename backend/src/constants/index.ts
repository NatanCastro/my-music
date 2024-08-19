import * as path from 'path';
import { cwd } from 'node:process';

const BASE_DIR: string = path.join(cwd(), 'data/');
export const MUSIC_FILE_PATH: string = path.join(BASE_DIR, 'uploads');
export const DEV_DB: string = path.join(BASE_DIR, './db.sqlite3');
