import { db, songRow, songSelect } from '../database/db.js';
import { safeInt } from '../utils/sanitize.js';

export function listRecent(req, res) {
  const rows = db
    .prepare(
      `${songSelect}
       INNER JOIN (
         SELECT song_id, MAX(played_at) AS last_played
         FROM recently_played GROUP BY song_id
       ) rp ON rp.song_id = s.id
       ORDER BY rp.last_played DESC
       LIMIT 40`,
    )
    .all()
    .map(songRow);
  res.json(rows);
}

export function recordPlay(req, res) {
  const songId = safeInt(req.body.songId, 0);
  const song = db.prepare('SELECT id FROM songs WHERE id = ?').get(songId);
  if (!song) return res.status(404).json({ error: 'Song not found.' });

  const recentSame = db
    .prepare(
      `SELECT id FROM recently_played
       WHERE song_id = ? AND played_at > datetime('now', '-30 seconds')
       LIMIT 1`,
    )
    .get(songId);

  if (!recentSame) {
    db.prepare('INSERT INTO recently_played (song_id) VALUES (?)').run(songId);
    db.prepare('UPDATE songs SET play_count = play_count + 1 WHERE id = ?').run(songId);
  }

  const row = db.prepare(`${songSelect} WHERE s.id = ?`).get(songId);
  res.json(songRow(row));
}
