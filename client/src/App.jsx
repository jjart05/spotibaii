import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout.jsx';
import Home from './pages/Home.jsx';
import SearchPage from './pages/Search.jsx';
import Library from './pages/Library.jsx';
import Liked from './pages/Liked.jsx';
import PlaylistPage from './pages/Playlist.jsx';
import AlbumPage from './pages/Album.jsx';
import ArtistPage from './pages/Artist.jsx';
import SongPage from './pages/Song.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="library" element={<Library />} />
        <Route path="liked" element={<Liked />} />
        <Route path="playlist/:id" element={<PlaylistPage />} />
        <Route path="album/:name" element={<AlbumPage />} />
        <Route path="artist/:name" element={<ArtistPage />} />
        <Route path="song/:id" element={<SongPage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
