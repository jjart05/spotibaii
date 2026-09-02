import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const dbPath = path.join(root, 'server', 'data', 'spotibai.db');
const songsSrc = path.join(root, 'server', 'uploads', 'songs');
const coversSrc = path.join(root, 'server', 'uploads', 'covers');
const outDir = path.join(root, 'client', 'public', 'library');
const outSongs = path.join(outDir, 'songs');
const outCovers = path.join(outDir, 'covers');

fs.mkdirSync(outSongs, { recursive: true });
fs.mkdirSync(outCovers, { recursive: true });

function copyNamed(srcDir, destDir, filename) {
  if (!filename) return null;
  const src = path.join(srcDir, path.basename(filename));
  if (!fs.existsSync(src)) return null;
  const dest = path.join(destDir, path.basename(filename));
  fs.copyFileSync(src, dest);
  return path.basename(filename);
}

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(
    path.join(outDir, 'catalog.json'),
    `${JSON.stringify({ songs: [], playlists: [], favorites: [], recentlyPlayed: [] }, null, 2)}\n`,
  );
  console.log('No local library yet. Upload songs with npm run dev, then run npm run export-library again.');
  process.exit(0);
}

const db = new DatabaseSync(dbPath);

const songs = db.prepare('SELECT * FROM songs ORDER BY id').all().map((row) => ({
  id: row.id,
  title: row.title,
  artist: row.artist,
  album: row.album,
  genre: row.genre,
  duration: row.duration,
  play_count: row.play_count,
  created_at: row.created_at,
  audioFile: copyNamed(songsSrc, outSongs, row.audio_path),
  coverFile: copyNamed(coversSrc, outCovers, row.cover_path),
}));

const missingAudio = songs.filter((s) => !s.audioFile);
if (missingAudio.length) {
  console.warn(`Skipped audio for ${missingAudio.length} song(s) because the file was missing.`);
}

const playlists = db.prepare('SELECT * FROM playlists ORDER BY id').all().map((row) => {
  const songIds = db
    .prepare('SELECT song_id FROM playlist_songs WHERE playlist_id = ? ORDER BY position, song_id')
    .all(row.id)
    .map((r) => r.song_id);
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    coverFile: copyNamed(coversSrc, outCovers, row.cover_path),
    songIds,
    created_at: row.created_at,
  };
});

const favorites = db.prepare('SELECT song_id FROM favorites ORDER BY created_at DESC').all().map((r) => r.song_id);

const recentlyPlayed = db
  .prepare(
    `SELECT song_id FROM recently_played
     GROUP BY song_id
     ORDER BY MAX(played_at) DESC
     LIMIT 40`,
  )
  .all()
  .map((r) => r.song_id);

const catalog = {
  exportedAt: new Date().toISOString(),
  songs: songs.filter((s) => s.audioFile),
  playlists,
  favorites,
  recentlyPlayed,
};

fs.writeFileSync(path.join(outDir, 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);
try {
  db.close();
} catch {
  /* some Node builds close automatically */
}

const bytes = catalog.songs.reduce((sum, song) => {
  const audio = path.join(outSongs, song.audioFile);
  const cover = song.coverFile ? path.join(outCovers, song.coverFile) : null;
  return sum + fs.statSync(audio).size + (cover && fs.existsSync(cover) ? fs.statSync(cover).size : 0);
}, 0);

console.log(`Exported ${catalog.songs.length} song(s) to client/public/library (${(bytes / (1024 * 1024)).toFixed(1)} MB).`);
console.log('Next: git add client/public/library && git commit && git push');
if (bytes > 80 * 1024 * 1024) {
  console.warn('Warning: GitHub/Vercel may reject very large files. Keep individual tracks under 100 MB.');
}
