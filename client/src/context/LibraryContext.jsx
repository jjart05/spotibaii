import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { useToast } from './ToastContext.jsx';

const LibraryContext = createContext(null);

const ACCENTS = {
  green: '31 224 122',
  teal: '20 210 180',
  violet: '168 130 255',
  amber: '255 186 73',
};

export function LibraryProvider({ children }) {
  const { push } = useToast();
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [recent, setRecent] = useState([]);
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [playlistModal, setPlaylistModal] = useState(null);
  const [addToPlaylistSong, setAddToPlaylistSong] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [settings, setSettings] = useState(() => {
    try {
      return {
        theme: 'dark',
        accent: 'green',
        autoplay: true,
        defaultVolume: 0.8,
        crossfade: false,
        ...JSON.parse(localStorage.getItem('spotibai-settings') || '{}'),
      };
    } catch {
      return { theme: 'dark', accent: 'green', autoplay: true, defaultVolume: 0.8, crossfade: false };
    }
  });

  useEffect(() => {
    localStorage.setItem('spotibai-settings', JSON.stringify(settings));
    document.documentElement.style.setProperty('--accent', ACCENTS[settings.accent] || ACCENTS.green);
    document.body.classList.toggle('theme-light', settings.theme === 'light');
  }, [settings]);

  const refresh = useCallback(async () => {
    const [s, p, r, h] = await Promise.all([api.songs(), api.playlists(), api.recent(), api.home()]);
    setSongs(s);
    setPlaylists(p);
    setRecent(r);
    setHome(h);
  }, []);

  useEffect(() => {
    refresh()
      .catch(() => push('Unable to load your library.', 'error'))
      .finally(() => setLoading(false));
  }, [refresh, push]);

  const patchSong = useCallback((id, patch) => {
    const apply = (list) => list.map((song) => (song.id === id ? { ...song, ...patch } : song));
    setSongs(apply);
    setRecent(apply);
    setPlaylists((ps) => ps.map((pl) => ({ ...pl, songs: apply(pl.songs || []) })));
    setHome((h) =>
      h
        ? {
            ...h,
            recent: apply(h.recent || []),
            popular: apply(h.popular || []),
            recentlyPlayed: apply(h.recentlyPlayed || []),
            madeForYou: apply(h.madeForYou || []),
          }
        : h,
    );
  }, []);

  const toggleLike = useCallback(
    async (song) => {
      const liked = !song.liked;
      patchSong(song.id, { liked });
      try {
        if (liked) await api.like(song.id);
        else await api.unlike(song.id);
        push(liked ? 'Added to Liked Songs.' : 'Removed from Liked Songs.');
        refresh();
      } catch {
        patchSong(song.id, { liked: !liked });
        push('Could not update liked songs.', 'error');
      }
    },
    [patchSong, push, refresh],
  );

  const value = useMemo(
    () => ({
      songs,
      playlists,
      recent,
      home,
      loading,
      refresh,
      toggleLike,
      patchSong,
      uploadOpen,
      setUploadOpen,
      playlistModal,
      setPlaylistModal,
      addToPlaylistSong,
      setAddToPlaylistSong,
      confirm,
      setConfirm,
      settings,
      setSettings,
    }),
    [
      songs,
      playlists,
      recent,
      home,
      loading,
      refresh,
      toggleLike,
      patchSong,
      uploadOpen,
      playlistModal,
      addToPlaylistSong,
      confirm,
      settings,
    ],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  return useContext(LibraryContext);
}
