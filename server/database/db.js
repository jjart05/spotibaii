import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR, DB_PATH } from '../utils/paths.js';

fs.mkdirSync(DATA_DIR, { recursive: true });

export const db = new DatabaseSync(DB_PATH);

db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT NOT NULL DEFAULT 'Unknown Album',
    genre TEXT NOT NULL DEFAULT 'Unknown',
    audio_path TEXT NOT NULL,
    cover_path TEXT,
    duration REAL NOT NULL DEFAULT 0,
    play_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    cover_path TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS playlist_songs (
    playlist_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (playlist_id, song_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_id INTEGER NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS recently_played (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_id INTEGER NOT NULL,
    played_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);
  CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs(artist);
  CREATE INDEX IF NOT EXISTS idx_songs_album ON songs(album);
  CREATE INDEX IF NOT EXISTS idx_songs_genre ON songs(genre);
  CREATE INDEX IF NOT EXISTS idx_songs_play_count ON songs(play_count);
  CREATE INDEX IF NOT EXISTS idx_songs_created ON songs(created_at);
  CREATE INDEX IF NOT EXISTS idx_recent_played_at ON recently_played(played_at);
  CREATE INDEX IF NOT EXISTS idx_playlist_songs_pos ON playlist_songs(playlist_id, position);
`);

export function songRow(row) {
  if (!row) return null;
  return {
    ...row,
    liked: Boolean(row.liked),
    coverUrl: row.cover_path ? `/uploads/covers/${path.basename(row.cover_path)}` : null,
    streamUrl: `/api/stream/${row.id}`,
  };
}

export const songSelect = `
  SELECT s.*,
    CASE WHEN f.song_id IS NULL THEN 0 ELSE 1 END AS liked
  FROM songs s
  LEFT JOIN favorites f ON f.song_id = s.id
`;
