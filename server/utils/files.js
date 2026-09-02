import fs from 'node:fs';
import path from 'node:path';
import { COVERS_DIR, SONGS_DIR } from './paths.js';

fs.mkdirSync(SONGS_DIR, { recursive: true });
fs.mkdirSync(COVERS_DIR, { recursive: true });

export { COVERS_DIR, SONGS_DIR };

export function resolveUpload(kind, storedPath) {
  if (!storedPath) return null;
  const base = path.basename(storedPath);
  const dir = kind === 'cover' ? COVERS_DIR : SONGS_DIR;
  const full = path.join(dir, base);
  const resolved = path.resolve(full);
  if (!resolved.startsWith(path.resolve(dir))) return null;
  return resolved;
}

export function removeFile(fullPath) {
  if (!fullPath) return;
  try {
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  } catch {
    /* ignore missing files */
  }
}

export function folderSize(dir) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).reduce((sum, name) => {
    const stats = fs.statSync(path.join(dir, name));
    return sum + (stats.isFile() ? stats.size : 0);
  }, 0);
}
