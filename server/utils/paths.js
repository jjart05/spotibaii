import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(__dirname, '..');

const dataRoot = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(ROOT, 'data');

export const DATA_DIR = dataRoot;
export const DB_PATH = path.join(DATA_DIR, 'spotibai.db');
export const SONGS_DIR = process.env.DATA_DIR
  ? path.join(DATA_DIR, 'uploads', 'songs')
  : path.join(ROOT, 'uploads', 'songs');
export const COVERS_DIR = process.env.DATA_DIR
  ? path.join(DATA_DIR, 'uploads', 'covers')
  : path.join(ROOT, 'uploads', 'covers');
