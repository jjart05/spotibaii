import { loadCatalog, presentCatalogSong } from './catalog.js';

const DB_NAME = 'spotibai';
const DB_VERSION = 1;

const urlCache = new Map();

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('songs')) {
        db.createObjectStore('songs', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('playlists')) {
        db.createObjectStore('playlists', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('playlistSongs')) {
        db.createObjectStore('playlistSongs', { keyPath: ['playlistId', 'songId'] });
      }
      if (!db.objectStoreNames.contains('favorites')) {
        db.createObjectStore('favorites', { keyPath: 'songId' });
      }
      if (!db.objectStoreNames.contains('recent')) {
        db.createObjectStore('recent', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Unable to open library storage.'));
  });
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Storage cancelled.'));
  });
}

function request(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function all(storeName) {
  const db = await openDb();
  return request(db.transaction(storeName).objectStore(storeName).getAll());
}

function blobUrl(id, kind, blob) {
  if (!blob) return null;
  let entry = urlCache.get(id);
  if (!entry) {
    entry = {};
    urlCache.set(id, entry);
  }
  if (!entry[kind]) entry[kind] = URL.createObjectURL(blob);
  return entry[kind];
}

function revokeSongUrls(id) {
  const entry = urlCache.get(id);
  if (!entry) return;
  if (entry.stream) URL.revokeObjectURL(entry.stream);
  if (entry.cover) URL.revokeObjectURL(entry.cover);
  urlCache.delete(id);
}

function presentSong(song, likedSet) {
  if (!song) return null;
  return {
    id: song.id,
    title: song.title,
    artist: song.artist,
    album: song.album,
    genre: song.genre,
    duration: song.duration || 0,
    play_count: song.play_count || 0,
    created_at: song.created_at,
    liked: likedSet ? likedSet.has(song.id) : Boolean(song.liked),
    coverUrl: blobUrl(song.id, 'cover', song.coverBlob),
    streamUrl: blobUrl(song.id, 'stream', song.audioBlob),
  };
}

async function likedIds() {
  const catalog = await loadCatalog();
  const favs = await all('favorites');
  return new Set([...catalog.favorites, ...favs.map((f) => f.songId)]);
}

async function mergedSongList(sort) {
  const catalog = await loadCatalog();
  const liked = await likedIds();
  const bundled = catalog.songs.map((s) => presentCatalogSong(s, liked));
  const local = await presentSongs(await all('songs'));
  const bundledIds = new Set(bundled.map((s) => s.id));
  const extra = local.filter((s) => !bundledIds.has(s.id));
  return sortSongs([...bundled, ...extra], sort);
}

async function nextId(kind) {
  const catalog = await loadCatalog();
  const rows = await all(kind);
  const catalogIds = kind === 'songs' ? catalog.songs.map((s) => s.id) : catalog.playlists.map((p) => p.id);
  return Math.max(0, ...catalogIds, ...rows.map((r) => r.id || 0)) + 1;
}

async function presentSongs(songs) {
  const liked = await likedIds();
  return songs.map((s) => presentSong(s, liked));
}

function sortSongs(songs, sort) {
  const copy = [...songs];
  if (sort === 'alpha') copy.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'artist') copy.sort((a, b) => a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title));
  else if (sort === 'played') copy.sort((a, b) => (b.play_count || 0) - (a.play_count || 0));
  else copy.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  return copy;
}

function readDuration(file) {
  return new Promise((resolve) => {
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    const src = URL.createObjectURL(file);
    const done = (value) => {
      URL.revokeObjectURL(src);
      resolve(Number.isFinite(value) ? value : 0);
    };
    audio.onloadedmetadata = () => done(audio.duration);
    audio.onerror = () => done(0);
    audio.src = src;
  });
}

function coverUrlFromPlaylist(playlist, songs) {
  if (playlist.coverBlob) return blobUrl(`playlist-${playlist.id}`, 'cover', playlist.coverBlob);
  return songs[0]?.coverUrl || null;
}

async function playlistWithSongs(playlist) {
  const links = (await all('playlistSongs'))
    .filter((l) => l.playlistId === playlist.id)
    .sort((a, b) => a.position - b.position);
  const merged = await mergedSongList();
  const byId = new Map(merged.map((s) => [s.id, s]));
  const songs = links.map((l) => byId.get(l.songId)).filter(Boolean);
  return {
    ...playlist,
    coverBlob: undefined,
    coverUrl: coverUrlFromPlaylist(playlist, songs),
    songs,
    trackCount: songs.length,
  };
}

const lastPlay = new Map();

export const localApi = {
  async home() {
    const songs = await mergedSongList('recent');
    const popular = sortSongs(songs, 'played').slice(0, 12);
    const recent = songs.slice(0, 12);
    const recentlyPlayed = (await this.recent()).slice(0, 12);
    const playlists = await this.playlists();
    const seeds = recentlyPlayed.slice(0, 5);
    const seedArtists = new Set(seeds.map((s) => s.artist.toLowerCase()));
    const seedGenres = new Set(seeds.map((s) => s.genre.toLowerCase()));
    const seedIds = new Set(seeds.map((s) => s.id));
    const madeForYou = songs
      .filter((s) => !seedIds.has(s.id))
      .sort((a, b) => {
        const score = (song) =>
          (seedArtists.has(song.artist.toLowerCase()) ? 3 : 0) +
          (seedGenres.has(song.genre.toLowerCase()) ? 2 : 0) +
          (song.play_count || 0);
        return score(b) - score(a);
      })
      .slice(0, 12);
    const liked = await likedIds();
    return {
      recent,
      popular,
      recentlyPlayed,
      madeForYou: madeForYou.length ? madeForYou : popular,
      playlists: playlists.slice(0, 8),
      likedCount: liked.size,
      totalSongs: songs.length,
    };
  },

  async stats() {
    const songs = await mergedSongList();
    const playlists = await this.playlists();
    const favorites = await this.favorites();
    const localSongs = await all('songs');
    const storageBytes = localSongs.reduce(
      (sum, s) => sum + (s.audioBlob?.size || 0) + (s.coverBlob?.size || 0),
      0,
    );
    return { songs: songs.length, playlists: playlists.length, favorites: favorites.length, storageBytes };
  },

  async songs(sort) {
    return mergedSongList(sort);
  },

  async song(id) {
    const songs = await mergedSongList();
    const found = songs.find((s) => s.id === Number(id));
    if (!found) throw new Error('Song not found.');
    return found;
  },

  async search(q) {
    const query = String(q || '').trim().toLowerCase();
    if (!query) return { songs: [], artists: [], albums: [], playlists: [] };
    const songs = (await this.songs('played')).filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.artist.toLowerCase().includes(query) ||
        s.album.toLowerCase().includes(query) ||
        s.genre.toLowerCase().includes(query),
    );
    const artistMap = new Map();
    const albumMap = new Map();
    for (const s of songs) {
      artistMap.set(s.artist, (artistMap.get(s.artist) || 0) + 1);
      const key = `${s.album}:::${s.artist}`;
      albumMap.set(key, (albumMap.get(key) || 0) + 1);
    }
    const playlists = (await this.playlists()).filter(
      (p) =>
        p.name.toLowerCase().includes(query) || String(p.description || '').toLowerCase().includes(query),
    );
    return {
      songs: songs.slice(0, 40),
      artists: [...artistMap.entries()].map(([name, trackCount]) => ({
        name,
        trackCount,
        coverUrl: songs.find((s) => s.artist === name)?.coverUrl,
      })),
      albums: [...albumMap.entries()].map(([key, trackCount]) => {
        const [name, artist] = key.split(':::');
        return {
          name,
          artist,
          trackCount,
          coverUrl: songs.find((s) => s.album === name && s.artist === artist)?.coverUrl,
        };
      }),
      playlists,
    };
  },

  async deleteSong(id) {
    const songId = Number(id);
    const catalog = await loadCatalog();
    if (catalog.songs.some((s) => s.id === songId)) {
      throw new Error(
        'This song is in the published library. Delete it in npm run dev on your PC, then run npm run export-library and git push.',
      );
    }
    const db = await openDb();
    const tx = db.transaction(['songs', 'favorites', 'playlistSongs', 'recent'], 'readwrite');
    tx.objectStore('songs').delete(songId);
    tx.objectStore('favorites').delete(songId);
    const links = tx.objectStore('playlistSongs');
    const allLinks = await request(links.getAll());
    allLinks.filter((l) => l.songId === songId).forEach((l) => links.delete([l.playlistId, l.songId]));
    const recents = await request(tx.objectStore('recent').getAll());
    recents.filter((r) => r.songId === songId).forEach((r) => tx.objectStore('recent').delete(r.id));
    await txDone(tx);
    revokeSongUrls(songId);
    return { ok: true };
  },

  async artists() {
    const songs = await this.songs();
    const map = new Map();
    for (const s of songs) {
      const cur = map.get(s.artist) || { name: s.artist, trackCount: 0, coverUrl: s.coverUrl };
      cur.trackCount += 1;
      map.set(s.artist, cur);
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  },

  async artist(name) {
    const songs = (await this.songs('played')).filter((s) => s.artist.toLowerCase() === decodeURIComponent(name).toLowerCase());
    if (!songs.length) throw new Error('Artist not found.');
    const albums = [];
    const seen = new Set();
    for (const s of songs) {
      if (seen.has(s.album)) continue;
      seen.add(s.album);
      albums.push({ name: s.album, artist: s.artist, coverUrl: s.coverUrl, trackCount: songs.filter((x) => x.album === s.album).length });
    }
    return { name: songs[0].artist, coverUrl: songs[0].coverUrl, songs, albums };
  },

  async albums() {
    const songs = await this.songs();
    const map = new Map();
    for (const s of songs) {
      const key = `${s.album}:::${s.artist}`;
      const cur = map.get(key) || { name: s.album, artist: s.artist, trackCount: 0, coverUrl: s.coverUrl };
      cur.trackCount += 1;
      map.set(key, cur);
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  },

  async album(name, artist) {
    const albumName = decodeURIComponent(name);
    const artistName = artist ? decodeURIComponent(artist) : null;
    const songs = (await this.songs('alpha')).filter(
      (s) => s.album === albumName && (!artistName || s.artist === artistName),
    );
    if (!songs.length) throw new Error('Album not found.');
    return {
      name: songs[0].album,
      artist: songs[0].artist,
      genre: songs[0].genre,
      coverUrl: songs[0].coverUrl,
      trackCount: songs.length,
      songs,
    };
  },

  async favorites() {
    const liked = await likedIds();
    const songs = await mergedSongList();
    return songs.filter((s) => liked.has(s.id)).map((s) => ({ ...s, liked: true }));
  },

  async like(id) {
    const db = await openDb();
    const tx = db.transaction('favorites', 'readwrite');
    tx.objectStore('favorites').put({ songId: Number(id), created_at: new Date().toISOString() });
    await txDone(tx);
    return { ok: true, liked: true };
  },

  async unlike(id) {
    const db = await openDb();
    const tx = db.transaction('favorites', 'readwrite');
    tx.objectStore('favorites').delete(Number(id));
    await txDone(tx);
    return { ok: true, liked: false };
  },

  async playlists() {
    const catalog = await loadCatalog();
    const merged = await mergedSongList();
    const byId = new Map(merged.map((s) => [s.id, s]));
    const bundled = catalog.playlists.map((p) => {
      const songs = (p.songIds || []).map((sid) => byId.get(sid)).filter(Boolean);
      return {
        id: p.id,
        name: p.name,
        description: p.description || '',
        created_at: p.created_at,
        coverUrl: p.coverFile ? `/library/covers/${encodeURIComponent(p.coverFile)}` : songs[0]?.coverUrl || null,
        songs,
        trackCount: songs.length,
        bundled: true,
      };
    });
    const rows = await all('playlists');
    rows.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
    const local = await Promise.all(rows.map(playlistWithSongs));
    const bundledIds = new Set(bundled.map((p) => p.id));
    return [...bundled, ...local.filter((p) => !bundledIds.has(p.id))];
  },

  async playlist(id) {
    const allPl = await this.playlists();
    const found = allPl.find((p) => p.id === Number(id));
    if (!found) throw new Error('Playlist not found.');
    return found;
  },

  async createPlaylist(form) {
    const name = String(form.get('name') || '').trim();
    if (!name) throw new Error('Playlist could not be created.');
    const cover = form.get('cover');
    const record = {
      id: await nextId('playlists'),
      name,
      description: String(form.get('description') || '').trim(),
      coverBlob: cover instanceof File && cover.size ? cover : null,
      created_at: new Date().toISOString(),
    };
    const db = await openDb();
    const tx = db.transaction('playlists', 'readwrite');
    const id = await request(tx.objectStore('playlists').put(record));
    await txDone(tx);
    return this.playlist(id);
  },

  async updatePlaylist(id, form) {
    const db = await openDb();
    const current = await request(db.transaction('playlists').objectStore('playlists').get(Number(id)));
    if (!current) throw new Error('Playlist not found.');
    const cover = form.get('cover');
    current.name = String(form.get('name') || current.name).trim();
    current.description = String(form.get('description') || current.description || '').trim();
    if (cover instanceof File && cover.size) current.coverBlob = cover;
    const tx = db.transaction('playlists', 'readwrite');
    tx.objectStore('playlists').put(current);
    await txDone(tx);
    return this.playlist(id);
  },

  async deletePlaylist(id) {
    const playlistId = Number(id);
    const db = await openDb();
    const tx = db.transaction(['playlists', 'playlistSongs'], 'readwrite');
    tx.objectStore('playlists').delete(playlistId);
    const links = await request(tx.objectStore('playlistSongs').getAll());
    links.filter((l) => l.playlistId === playlistId).forEach((l) => tx.objectStore('playlistSongs').delete([l.playlistId, l.songId]));
    await txDone(tx);
    revokeSongUrls(`playlist-${playlistId}`);
    return { ok: true };
  },

  async addToPlaylist(id, songId) {
    const db = await openDb();
    const links = (await all('playlistSongs')).filter((l) => l.playlistId === Number(id));
    const max = links.reduce((m, l) => Math.max(m, l.position), -1);
    const tx = db.transaction('playlistSongs', 'readwrite');
    tx.objectStore('playlistSongs').put({
      playlistId: Number(id),
      songId: Number(songId),
      position: max + 1,
    });
    await txDone(tx);
    return this.playlist(id);
  },

  async removeFromPlaylist(id, songId) {
    const db = await openDb();
    const tx = db.transaction('playlistSongs', 'readwrite');
    tx.objectStore('playlistSongs').delete([Number(id), Number(songId)]);
    await txDone(tx);
    return this.playlist(id);
  },

  async reorderPlaylist(id, songIds) {
    const db = await openDb();
    const tx = db.transaction('playlistSongs', 'readwrite');
    songIds.forEach((songId, index) => {
      tx.objectStore('playlistSongs').put({
        playlistId: Number(id),
        songId: Number(songId),
        position: index,
      });
    });
    await txDone(tx);
    return this.playlist(id);
  },

  async recent() {
    const events = await all('recent');
    events.sort((a, b) => String(b.played_at).localeCompare(String(a.played_at)));
    const seen = new Set();
    const ids = [];
    for (const ev of events) {
      if (seen.has(ev.songId)) continue;
      seen.add(ev.songId);
      ids.push(ev.songId);
      if (ids.length >= 40) break;
    }
    const catalog = await loadCatalog();
    const songs = await mergedSongList();
    const byId = new Map(songs.map((s) => [s.id, s]));
    const fromCatalog = catalog.recentlyPlayed.map((rid) => byId.get(rid)).filter(Boolean);
    const fromEvents = ids.map((rid) => byId.get(rid)).filter(Boolean);
    const seenRecent = new Set();
    const mergedRecent = [];
    for (const song of [...fromEvents, ...fromCatalog]) {
      if (seenRecent.has(song.id)) continue;
      seenRecent.add(song.id);
      mergedRecent.push(song);
    }
    return mergedRecent;
  },

  async recordPlay(songId) {
    const id = Number(songId);
    const presented = await this.song(id);
    const now = Date.now();
    const prev = lastPlay.get(id) || 0;
    if (now - prev > 30_000) {
      lastPlay.set(id, now);
      const db = await openDb();
      const row = await request(db.transaction('songs').objectStore('songs').get(id));
      const tx = db.transaction(row ? ['songs', 'recent'] : ['recent'], 'readwrite');
      if (row) {
        row.play_count = (row.play_count || 0) + 1;
        tx.objectStore('songs').put(row);
      }
      tx.objectStore('recent').add({ songId: id, played_at: new Date().toISOString() });
      await txDone(tx);
    }
    return presented;
  },

  async upload(form, onProgress) {
    const audio = form.get('audio');
    if (!(audio instanceof File) || !audio.size) throw new Error('An audio file is required.');
    const ext = audio.name.split('.').pop()?.toLowerCase();
    const ok = ['mp3', 'wav', 'ogg', 'm4a', 'oga'].includes(ext) || audio.type.startsWith('audio/');
    if (!ok) throw new Error('Unsupported audio format.');
    if (audio.size > 80 * 1024 * 1024) throw new Error('File is too large.');
    onProgress?.(15);
    const cover = form.get('cover');
    const duration = await readDuration(audio);
    onProgress?.(55);
    const stem = audio.name.replace(/\.[^.]+$/, '');
    const record = {
      id: await nextId('songs'),
      title: String(form.get('title') || stem || 'Untitled').trim(),
      artist: String(form.get('artist') || 'Unknown Artist').trim(),
      album: String(form.get('album') || 'Unknown Album').trim(),
      genre: String(form.get('genre') || 'Unknown').trim(),
      duration,
      play_count: 0,
      created_at: new Date().toISOString(),
      audioBlob: audio,
      coverBlob: cover instanceof File && cover.size ? cover : null,
    };
    try {
      const db = await openDb();
      const tx = db.transaction('songs', 'readwrite');
      const id = await request(tx.objectStore('songs').put(record));
      await txDone(tx);
      onProgress?.(100);
      return this.song(id);
    } catch (err) {
      if (err?.name === 'QuotaExceededError') {
        throw new Error('This browser is out of space for more music. Delete songs or free disk space.');
      }
      throw new Error('Upload failed.');
    }
  },
};
