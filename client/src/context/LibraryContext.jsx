import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { api } from '../services/api.js';
import { useToast } from './ToastContext.jsx';
import { applyThemeClass, transitionTheme } from '../utils/themeTransition.js';

const LibraryContext = createContext(null);

const ACCENTS = {
  green: '30 215 96',
  mango: '30 215 96', // legacy default → Spotify green
  coral: '255 90 60',
  teal: '20 184 166',
  gold: '234 179 8',
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
      const stored = JSON.parse(localStorage.getItem('spotibai-settings') || '{}');
      const legacy = { mango: 'green', violet: 'coral', amber: 'gold' };
      if (legacy[stored.accent]) stored.accent = legacy[stored.accent];
      return {
        theme: 'dark',
        accent: 'green',
        autoplay: true,
        defaultVolume: 0.8,
        crossfade: false,
        ...stored,
      };
    } catch {
      return { theme: 'dark', accent: 'green', autoplay: true, defaultVolume: 0.8, crossfade: false };
    }
  });

  useEffect(() => {
    applyThemeClass(settings.theme);
  }, []);

  useEffect(() => {
    localStorage.setItem('spotibai-settings', JSON.stringify(settings));
    const accent = ACCENTS[settings.accent] || ACCENTS.green;
    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.style.setProperty('--surface-glow', accent);
    applyThemeClass(settings.theme);
  }, [settings]);

  const setTheme = useCallback((theme, opts = {}) => {
    if (theme !== 'light' && theme !== 'dark') return;
    if (theme === settings.theme) return;
    transitionTheme(theme, opts, () => {
      flushSync(() => {
        setSettings((s) => ({ ...s, theme }));
      });
    });
  }, [settings.theme]);

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
      setTheme,
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
      setTheme,
    ],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  return useContext(LibraryContext);
}
