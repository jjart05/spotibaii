import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import { COVERS_DIR, SONGS_DIR } from '../utils/files.js';

const AUDIO_EXT = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.oga']);
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const AUDIO_MIME = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/ogg',
  'audio/mp4',
  'audio/x-m4a',
  'audio/aac',
  'application/octet-stream',
]);
const IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

function uniqueName(original) {
  const ext = path.extname(original || '').toLowerCase();
  return `${crypto.randomUUID()}${ext}`;
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === 'cover') cb(null, COVERS_DIR);
    else cb(null, SONGS_DIR);
  },
  filename(req, file, cb) {
    cb(null, uniqueName(file.originalname));
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (file.fieldname === 'audio') {
    if (!AUDIO_EXT.has(ext) || !AUDIO_MIME.has(file.mimetype)) {
      return cb(Object.assign(new Error('Unsupported audio format.'), { status: 400 }));
    }
  } else if (file.fieldname === 'cover') {
    if (!IMAGE_EXT.has(ext) || !IMAGE_MIME.has(file.mimetype)) {
      return cb(Object.assign(new Error('Unsupported image format.'), { status: 400 }));
    }
  }
  cb(null, true);
}

export const uploadSong = multer({
  storage,
  fileFilter,
  limits: { fileSize: 80 * 1024 * 1024 },
}).fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
]);

export const uploadCover = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
}).single('cover');
