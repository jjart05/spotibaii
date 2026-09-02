import { Router } from 'express';
import * as songs from '../controllers/songsController.js';
import * as stream from '../controllers/streamController.js';
import * as upload from '../controllers/uploadController.js';
import * as favorites from '../controllers/favoritesController.js';
import * as playlists from '../controllers/playlistsController.js';
import * as recent from '../controllers/recentController.js';
import { uploadCover, uploadSong } from '../middleware/upload.js';

const router = Router();

router.get('/home', songs.homeFeed);
router.get('/stats', songs.stats);
router.get('/songs/search', songs.searchSongs);
router.get('/songs', songs.listSongs);
router.get('/songs/:id', songs.getSong);
router.delete('/songs/:id', songs.deleteSong);

router.get('/artists', songs.listArtists);
router.get('/artists/:name', songs.getArtist);
router.get('/albums', songs.listAlbums);
router.get('/albums/:name', songs.getAlbum);

router.get('/stream/:songId', stream.streamSong);

router.post('/upload', uploadSong, upload.uploadMusic);
router.post('/songs', uploadSong, upload.uploadMusic);

router.get('/favorites', favorites.listFavorites);
router.post('/favorites/:songId', favorites.addFavorite);
router.delete('/favorites/:songId', favorites.removeFavorite);

router.get('/playlists', playlists.listPlaylists);
router.post('/playlists', uploadCover, playlists.createPlaylist);
router.get('/playlists/:id', playlists.getPlaylist);
router.put('/playlists/:id', uploadCover, playlists.updatePlaylist);
router.delete('/playlists/:id', playlists.deletePlaylist);
router.post('/playlists/:id/songs', playlists.addPlaylistSong);
router.delete('/playlists/:id/songs/:songId', playlists.removePlaylistSong);
router.put('/playlists/:id/reorder', playlists.reorderPlaylist);

router.get('/recently-played', recent.listRecent);
router.post('/recently-played', recent.recordPlay);

export default router;
