import * as path from 'path';
import { Root, Type } from './types';
import { cwd } from 'process';

export const folderTree: Root = {
  path: path.join(cwd(), 'data/'),
  children: [
    {
      type: Type.File,
      name: 'db.sqlite3',
      directUsed: true,
    },
    {
      type: Type.Folder,
      name: 'uploads',
      children: [],
      directUsed: true,
    },
  ],
};
