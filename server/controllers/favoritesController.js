import { db, songRow, songSelect } from '../database/db.js';

export function listFavorites(req, res) {
  const rows = db
    .prepare(`${songSelect} INNER JOIN favorites f2 ON f2.song_id = s.id ORDER BY f2.created_at DESC`)
    .all()
    .map(songRow);
  res.json(rows);
}

export function addFavorite(req, res) {
  const song = db.prepare('SELECT id FROM songs WHERE id = ?').get(req.params.songId);
  if (!song) return res.status(404).json({ error: 'Song not found.' });
  db.prepare('INSERT OR IGNORE INTO favorites (song_id) VALUES (?)').run(song.id);
  res.json({ ok: true, liked: true });
}

export function removeFavorite(req, res) {
  db.prepare('DELETE FROM favorites WHERE song_id = ?').run(req.params.songId);
  res.json({ ok: true, liked: false });
}
