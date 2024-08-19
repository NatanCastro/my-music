import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const musicSchema = sqliteTable('music', {
  id: text('id'),
  title: text('title'),
  artist: text('artist'),
  album: text('album'),
  year: integer('year'),
  duration: integer('duration'),
  updatedAt: text('updated_at'),
});

// path: string;
// title: string;
// artist: string;
// album: string;
// year: string;
// duration: number;
