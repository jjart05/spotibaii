import { db, songRow, songSelect } from '../database/db.js';
import { cleanText } from '../utils/sanitize.js';
import { COVERS_DIR, folderSize, removeFile, resolveUpload, SONGS_DIR } from '../utils/files.js';

export function listSongs(req, res) {
  const sort = req.query.sort || 'recent';
  const order =
    sort === 'alpha'
      ? 's.title COLLATE NOCASE ASC'
      : sort === 'artist'
        ? 's.artist COLLATE NOCASE ASC, s.title COLLATE NOCASE ASC'
        : sort === 'played'
          ? 's.play_count DESC, s.title COLLATE NOCASE ASC'
          : 's.created_at DESC';
  const rows = db.prepare(`${songSelect} ORDER BY ${order}`).all();
  res.json(rows.map(songRow));
}

export function getSong(req, res) {
  const row = db.prepare(`${songSelect} WHERE s.id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Song not found.' });
  res.json(songRow(row));
}

export function searchSongs(req, res) {
  const q = cleanText(req.query.q, '', 120);
  if (!q) return res.json({ songs: [], artists: [], albums: [], playlists: [] });
  const like = `%${q}%`;
  const songs = db
    .prepare(
      `${songSelect}
       WHERE s.title LIKE ? COLLATE NOCASE
          OR s.artist LIKE ? COLLATE NOCASE
          OR s.album LIKE ? COLLATE NOCASE
          OR s.genre LIKE ? COLLATE NOCASE
       ORDER BY s.play_count DESC, s.title COLLATE NOCASE ASC
       LIMIT 40`,
    )
    .all(like, like, like, like)
    .map(songRow);

  const artists = db
    .prepare(
      `SELECT artist AS name, COUNT(*) AS trackCount, MAX(cover_path) AS cover_path
       FROM songs WHERE artist LIKE ? COLLATE NOCASE
       GROUP BY artist COLLATE NOCASE
       ORDER BY trackCount DESC LIMIT 12`,
    )
    .all(like)
    .map((a) => ({
      ...a,
      coverUrl: a.cover_path ? `/uploads/covers/${a.cover_path.split(/[/\\]/).pop()}` : null,
    }));

  const albums = db
    .prepare(
      `SELECT album AS name, artist, COUNT(*) AS trackCount, MAX(cover_path) AS cover_path
       FROM songs
       WHERE album LIKE ? COLLATE NOCASE OR artist LIKE ? COLLATE NOCASE
       GROUP BY album COLLATE NOCASE, artist COLLATE NOCASE
       ORDER BY trackCount DESC LIMIT 12`,
    )
    .all(like, like)
    .map((a) => ({
      ...a,
      coverUrl: a.cover_path ? `/uploads/covers/${a.cover_path.split(/[/\\]/).pop()}` : null,
    }));

  const playlists = db
    .prepare(
      `SELECT * FROM playlists
       WHERE name LIKE ? COLLATE NOCASE OR description LIKE ? COLLATE NOCASE
       ORDER BY created_at DESC LIMIT 12`,
    )
    .all(like, like);

  res.json({ songs, artists, albums, playlists });
}

export function deleteSong(req, res) {
  const row = db.prepare('SELECT * FROM songs WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Song not found.' });
  removeFile(resolveUpload('song', row.audio_path));
  removeFile(resolveUpload('cover', row.cover_path));
  db.prepare('DELETE FROM songs WHERE id = ?').run(row.id);
  res.json({ ok: true });
}

export function listArtists(req, res) {
  const artists = db
    .prepare(
      `SELECT artist AS name, COUNT(*) AS trackCount, MAX(cover_path) AS cover_path
       FROM songs GROUP BY artist COLLATE NOCASE ORDER BY artist COLLATE NOCASE`,
    )
    .all()
    .map((a) => ({
      ...a,
      coverUrl: a.cover_path ? `/uploads/covers/${a.cover_path.split(/[/\\]/).pop()}` : null,
    }));
  res.json(artists);
}

export function getArtist(req, res) {
  const name = decodeURIComponent(req.params.name);
  const songs = db
    .prepare(`${songSelect} WHERE s.artist = ? COLLATE NOCASE ORDER BY s.play_count DESC, s.title`)
    .all(name)
    .map(songRow);
  if (!songs.length) return res.status(404).json({ error: 'Artist not found.' });
  const albums = db
    .prepare(
      `SELECT album AS name, artist, COUNT(*) AS trackCount, MAX(cover_path) AS cover_path
       FROM songs WHERE artist = ? COLLATE NOCASE
       GROUP BY album COLLATE NOCASE ORDER BY name`,
    )
    .all(name)
    .map((a) => ({
      ...a,
      coverUrl: a.cover_path ? `/uploads/covers/${a.cover_path.split(/[/\\]/).pop()}` : null,
    }));
  res.json({
    name: songs[0].artist,
    coverUrl: songs[0].coverUrl,
    songs,
    albums,
  });
}

export function listAlbums(req, res) {
  const albums = db
    .prepare(
      `SELECT album AS name, artist, COUNT(*) AS trackCount, MAX(cover_path) AS cover_path
       FROM songs GROUP BY album COLLATE NOCASE, artist COLLATE NOCASE
       ORDER BY album COLLATE NOCASE`,
    )
    .all()
    .map((a) => ({
      ...a,
      coverUrl: a.cover_path ? `/uploads/covers/${a.cover_path.split(/[/\\]/).pop()}` : null,
    }));
  res.json(albums);
}

export function getAlbum(req, res) {
  const name = decodeURIComponent(req.params.name);
  const artist = req.query.artist ? decodeURIComponent(req.query.artist) : null;
  const songs = artist
    ? db
        .prepare(
          `${songSelect} WHERE s.album = ? COLLATE NOCASE AND s.artist = ? COLLATE NOCASE ORDER BY s.title`,
        )
        .all(name, artist)
        .map(songRow)
    : db
        .prepare(`${songSelect} WHERE s.album = ? COLLATE NOCASE ORDER BY s.title`)
        .all(name)
        .map(songRow);
  if (!songs.length) return res.status(404).json({ error: 'Album not found.' });
  res.json({
    name: songs[0].album,
    artist: songs[0].artist,
    genre: songs[0].genre,
    coverUrl: songs[0].coverUrl,
    trackCount: songs.length,
    songs,
  });
}

export function homeFeed(req, res) {
  const recent = db.prepare(`${songSelect} ORDER BY s.created_at DESC LIMIT 12`).all().map(songRow);
  const popular = db
    .prepare(`${songSelect} ORDER BY s.play_count DESC, s.created_at DESC LIMIT 12`)
    .all()
    .map(songRow);
  const recentlyPlayed = db
    .prepare(
      `${songSelect}
       INNER JOIN (
         SELECT song_id, MAX(played_at) AS last_played
         FROM recently_played GROUP BY song_id
       ) rp ON rp.song_id = s.id
       ORDER BY rp.last_played DESC LIMIT 12`,
    )
    .all()
    .map(songRow);

  const seeds = recentlyPlayed.slice(0, 5);
  const seedArtists = new Set(seeds.map((s) => s.artist.toLowerCase()));
  const seedGenres = new Set(seeds.map((s) => s.genre.toLowerCase()));
  const seedIds = new Set(seeds.map((s) => s.id));
  const all = db.prepare(`${songSelect}`).all().map(songRow);
  const madeForYou = all
    .filter((s) => !seedIds.has(s.id))
    .sort((a, b) => {
      const score = (song) =>
        (seedArtists.has(song.artist.toLowerCase()) ? 3 : 0) +
        (seedGenres.has(song.genre.toLowerCase()) ? 2 : 0) +
        song.play_count;
      return score(b) - score(a);
    })
    .slice(0, 12);

  const playlists = db.prepare('SELECT * FROM playlists ORDER BY created_at DESC LIMIT 8').all();
  const likedCount = db.prepare('SELECT COUNT(*) AS c FROM favorites').get().c;

  res.json({
    recent,
    popular,
    recentlyPlayed,
    madeForYou: madeForYou.length ? madeForYou : popular,
    playlists,
    likedCount,
    totalSongs: all.length,
  });
}

export function stats(req, res) {
  const songs = db.prepare('SELECT COUNT(*) AS c FROM songs').get().c;
  const playlists = db.prepare('SELECT COUNT(*) AS c FROM playlists').get().c;
  const favorites = db.prepare('SELECT COUNT(*) AS c FROM favorites').get().c;
  res.json({
    songs,
    playlists,
    favorites,
    storageBytes: folderSize(SONGS_DIR) + folderSize(COVERS_DIR),
  });
}
