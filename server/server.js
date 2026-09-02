import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import './database/db.js';
import api from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { COVERS_DIR } from './utils/files.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use('/uploads/covers', express.static(COVERS_DIR));
app.use('/api', api);

const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use('/api', notFound);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Spotibai server listening on http://0.0.0.0:${PORT}`);
});
