import * as path from 'path';
import { cwd } from 'node:process';

export const MUSIC_FILE_PATH: string = path.join(cwd(), 'uploads');
