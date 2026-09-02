import { parseFile } from 'music-metadata';
import { db, songRow, songSelect } from '../database/db.js';
import { cleanText } from '../utils/sanitize.js';
import { removeFile, resolveUpload, SONGS_DIR, COVERS_DIR } from '../utils/files.js';
import path from 'node:path';

export async function uploadMusic(req, res, next) {
  const audio = req.files?.audio?.[0];
  const cover = req.files?.cover?.[0];
  if (!audio) {
    if (cover) removeFile(cover.path);
    return res.status(400).json({ error: 'An audio file is required.' });
  }

  if (audio.size > 80 * 1024 * 1024) {
    removeFile(audio.path);
    if (cover) removeFile(cover.path);
    return res.status(400).json({ error: 'File is too large.' });
  }

  try {
    let duration = 0;
    try {
      const meta = await parseFile(audio.path);
      duration = meta.format.duration || 0;
      if (!req.body.title && meta.common.title) req.body.title = meta.common.title;
      if (!req.body.artist && meta.common.artist) req.body.artist = meta.common.artist;
      if (!req.body.album && meta.common.album) req.body.album = meta.common.album;
      if (!req.body.genre && meta.common.genre?.[0]) req.body.genre = meta.common.genre[0];
    } catch {
      duration = 0;
    }

    const title = cleanText(req.body.title, path.parse(audio.originalname).name || 'Untitled');
    const artist = cleanText(req.body.artist, 'Unknown Artist');
    const album = cleanText(req.body.album, 'Unknown Album');
    const genre = cleanText(req.body.genre, 'Unknown');

    const result = db
      .prepare(
        `INSERT INTO songs (title, artist, album, genre, audio_path, cover_path, duration)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(title, artist, album, genre, audio.filename, cover ? cover.filename : null, duration);

    const row = db.prepare(`${songSelect} WHERE s.id = ?`).get(result.lastInsertRowid);
    res.status(201).json(songRow(row));
  } catch (err) {
    removeFile(audio.path);
    if (cover) removeFile(cover.path);
    next(Object.assign(err, { status: 400, message: 'Upload failed.' }));
  }
}

export { SONGS_DIR, COVERS_DIR, resolveUpload };
