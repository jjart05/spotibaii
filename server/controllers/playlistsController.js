import { db, songRow, songSelect } from '../database/db.js';
import { cleanText } from '../utils/sanitize.js';
import { removeFile, resolveUpload } from '../utils/files.js';

function withSongs(playlist) {
  if (!playlist) return null;
  const songs = db
    .prepare(
      `${songSelect}
       INNER JOIN playlist_songs ps ON ps.song_id = s.id
       WHERE ps.playlist_id = ?
       ORDER BY ps.position ASC, s.title`,
    )
    .all(playlist.id)
    .map(songRow);
  return {
    ...playlist,
    coverUrl: playlist.cover_path ? `/uploads/covers/${playlist.cover_path.split(/[/\\]/).pop()}` : songs[0]?.coverUrl || null,
    songs,
    trackCount: songs.length,
  };
}

export function listPlaylists(req, res) {
  const rows = db.prepare('SELECT * FROM playlists ORDER BY created_at DESC').all();
  res.json(rows.map((p) => withSongs(p)));
}

export function getPlaylist(req, res) {
  const row = db.prepare('SELECT * FROM playlists WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Playlist not found.' });
  res.json(withSongs(row));
}

export function createPlaylist(req, res) {
  const name = cleanText(req.body.name, '');
  if (!name) return res.status(400).json({ error: 'Playlist could not be created.' });
  const description = cleanText(req.body.description, '', 500);
  const cover = req.file ? req.file.filename : null;
  const result = db
    .prepare('INSERT INTO playlists (name, description, cover_path) VALUES (?, ?, ?)')
    .run(name, description, cover);
  const row = db.prepare('SELECT * FROM playlists WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(withSongs(row));
}

export function updatePlaylist(req, res) {
  const row = db.prepare('SELECT * FROM playlists WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Playlist not found.' });
  const name = cleanText(req.body.name, row.name);
  const description = cleanText(req.body.description, row.description || '', 500);
  let cover = row.cover_path;
  if (req.file) {
    removeFile(resolveUpload('cover', row.cover_path));
    cover = req.file.filename;
  }
  db.prepare('UPDATE playlists SET name = ?, description = ?, cover_path = ? WHERE id = ?').run(
    name,
    description,
    cover,
    row.id,
  );
  res.json(withSongs(db.prepare('SELECT * FROM playlists WHERE id = ?').get(row.id)));
}

export function deletePlaylist(req, res) {
  const row = db.prepare('SELECT * FROM playlists WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Playlist not found.' });
  removeFile(resolveUpload('cover', row.cover_path));
  db.prepare('DELETE FROM playlists WHERE id = ?').run(row.id);
  res.json({ ok: true });
}

export function addPlaylistSong(req, res) {
  const playlist = db.prepare('SELECT * FROM playlists WHERE id = ?').get(req.params.id);
  if (!playlist) return res.status(404).json({ error: 'Playlist not found.' });
  const songId = req.body.songId;
  const song = db.prepare('SELECT id FROM songs WHERE id = ?').get(songId);
  if (!song) return res.status(404).json({ error: 'Song not found.' });
  const max = db
    .prepare('SELECT COALESCE(MAX(position), -1) AS m FROM playlist_songs WHERE playlist_id = ?')
    .get(playlist.id).m;
  db.prepare(
    'INSERT OR IGNORE INTO playlist_songs (playlist_id, song_id, position) VALUES (?, ?, ?)',
  ).run(playlist.id, song.id, max + 1);
  res.json(withSongs(playlist));
}

export function removePlaylistSong(req, res) {
  db.prepare('DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?').run(
    req.params.id,
    req.params.songId,
  );
  const playlist = db.prepare('SELECT * FROM playlists WHERE id = ?').get(req.params.id);
  if (!playlist) return res.status(404).json({ error: 'Playlist not found.' });
  res.json(withSongs(playlist));
}

export function reorderPlaylist(req, res) {
  const ids = Array.isArray(req.body.songIds) ? req.body.songIds : [];
  const tx = db.transaction(() => {
    ids.forEach((songId, index) => {
      db.prepare(
        'UPDATE playlist_songs SET position = ? WHERE playlist_id = ? AND song_id = ?',
      ).run(index, req.params.id, songId);
    });
  });
  tx();
  const playlist = db.prepare('SELECT * FROM playlists WHERE id = ?').get(req.params.id);
  res.json(withSongs(playlist));
}
