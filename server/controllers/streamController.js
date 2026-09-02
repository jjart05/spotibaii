import fs from 'node:fs';
import { db } from '../database/db.js';
import { resolveUpload } from '../utils/files.js';

export function streamSong(req, res) {
  const row = db.prepare('SELECT * FROM songs WHERE id = ?').get(req.params.songId);
  if (!row) return res.status(404).json({ error: 'Song not found.' });

  const filePath = resolveUpload('song', row.audio_path);
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Unable to play this song.' });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const ext = (row.audio_path.split('.').pop() || '').toLowerCase();
  const types = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    oga: 'audio/ogg',
    m4a: 'audio/mp4',
  };
  const contentType = types[ext] || 'application/octet-stream';

  const range = req.headers.range;
  if (!range) {
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': fileSize,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const match = /bytes=(\d*)-(\d*)/.exec(range);
  if (!match) {
    return res.status(416).set('Content-Range', `bytes */${fileSize}`).end();
  }

  let start = match[1] ? Number.parseInt(match[1], 10) : 0;
  let end = match[2] ? Number.parseInt(match[2], 10) : fileSize - 1;
  if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= fileSize) {
    return res.status(416).set('Content-Range', `bytes */${fileSize}`).end();
  }
  end = Math.min(end, fileSize - 1);
  const chunkSize = end - start + 1;

  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': contentType,
    'Cache-Control': 'no-cache',
  });
  fs.createReadStream(filePath, { start, end }).pipe(res);
}
