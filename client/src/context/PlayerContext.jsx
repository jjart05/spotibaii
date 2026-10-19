import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../services/api.js';
import { shuffleArray } from '../utils/format.js';
import { useLibrary } from './LibraryContext.jsx';
import { useToast } from './ToastContext.jsx';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const { settings, refresh } = useLibrary();
  const { push } = useToast();
  const audioRef = useRef(null);
  const [current, setCurrent] = useState(null);
  const [queue, setQueue] = useState([]);
  const [originalQueue, setOriginalQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    const raw = localStorage.getItem('spotibai-volume');
    const stored = raw == null || raw === '' ? NaN : Number(raw);
    return Number.isFinite(stored) ? stored : 0.8;
  });
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off');
  const [queueOpen, setQueueOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const recordedRef = useRef(null);
  const loadGenRef = useRef(0);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const onTime = () => setProgress(audio.currentTime || 0);
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => {
      setPlaying(false);
      push('Unable to play this song.', 'error');
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('durationchange', onMeta);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('durationchange', onMeta);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
    };
  }, [push]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = muted ? 0 : volume;
    localStorage.setItem('spotibai-volume', String(volume));
  }, [volume, muted]);

  const loadSong = useCallback(
    async (song, autoplay = true) => {
      const audio = audioRef.current;
      if (!audio || !song) return;
      // Bump generation so rapid next/prev always wins without delaying audio.
      const gen = ++loadGenRef.current;
      setCurrent(song);
      setProgress(0);
      setDuration(song.duration || 0);
      audio.src = song.streamUrl;
      audio.load();
      if (autoplay && settings.autoplay !== false) {
        try {
          await audio.play();
          if (gen !== loadGenRef.current) return;
        } catch {
          if (gen === loadGenRef.current) setPlaying(false);
        }
      }
      if (gen !== loadGenRef.current) return;
      if (recordedRef.current !== song.id) {
        recordedRef.current = song.id;
        api.recordPlay(song.id).then(refresh).catch(() => {});
      }
    },
    [refresh, settings.autoplay],
  );

  const playFromList = useCallback(
    (list, startIndex = 0) => {
      if (!list?.length) return;
      const nextQueue = [...list];
      setOriginalQueue(nextQueue);
      const startSong = nextQueue[startIndex];
      const ready = shuffle ? shuffleArray(nextQueue, startSong.id) : nextQueue;
      setQueue(ready);
      const i = ready.findIndex((s) => s.id === startSong.id);
      setIndex(i);
      recordedRef.current = null;
      loadSong(ready[i]);
    },
    [loadSong, shuffle],
  );

  const playSong = useCallback(
    (song, list) => {
      if (list?.length) {
        const i = Math.max(0, list.findIndex((s) => s.id === song.id));
        playFromList(list, i);
      } else if (current && queue.length) {
        const exists = queue.findIndex((s) => s.id === song.id);
        if (exists >= 0) {
          setIndex(exists);
          recordedRef.current = null;
          loadSong(queue[exists]);
        } else {
          playFromList([song, ...queue.filter((s) => s.id !== song.id)], 0);
        }
      } else {
        playFromList([song], 0);
      }
    },
    [current, queue, loadSong, playFromList],
  );

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!current) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        push('Unable to play this song.', 'error');
      }
    } else {
      audio.pause();
    }
  }, [current, push]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(time)) return;
    audio.currentTime = Math.min(Math.max(time, 0), audio.duration || time);
    setProgress(audio.currentTime);
  }, []);

  const goToIndex = useCallback(
    (nextIndex) => {
      if (!queue.length) return;
      let i = nextIndex;
      if (repeat === 'all') i = (nextIndex + queue.length) % queue.length;
      if (i < 0 || i >= queue.length) {
        audioRef.current?.pause();
        return;
      }
      setIndex(i);
      recordedRef.current = null;
      loadSong(queue[i]);
    },
    [queue, repeat, loadSong],
  );

  const next = useCallback(() => {
    if (repeat === 'one' && current) {
      seek(0);
      audioRef.current?.play();
      return;
    }
    goToIndex(index + 1);
  }, [repeat, current, seek, goToIndex, index]);

  const previous = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      seek(0);
      return;
    }
    goToIndex(index - 1);
  }, [goToIndex, index, seek]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const onEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
        return;
      }
      if (index + 1 < queue.length) goToIndex(index + 1);
      else if (repeat === 'all' && queue.length) goToIndex(0);
      else setPlaying(false);
    };
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [repeat, index, queue, goToIndex]);

  const toggleShuffle = useCallback(() => {
    setShuffle((on) => {
      const nextOn = !on;
      if (!queue.length) return nextOn;
      if (nextOn) {
        const shuffled = shuffleArray(originalQueue.length ? originalQueue : queue, current?.id);
        setQueue(shuffled);
        setIndex(shuffled.findIndex((s) => s.id === current?.id));
      } else {
        const base = originalQueue.length ? originalQueue : queue;
        setQueue(base);
        setIndex(base.findIndex((s) => s.id === current?.id));
      }
      return nextOn;
    });
  }, [queue, originalQueue, current]);

  const cycleRepeat = useCallback(() => {
    setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'));
  }, []);

  const addToQueue = useCallback((song) => {
    setQueue((q) => [...q, song]);
    setOriginalQueue((q) => [...q, song]);
    push('Added to queue.');
  }, [push]);

  const playNext = useCallback((song) => {
    setQueue((q) => {
      const nextQ = [...q];
      const i = Math.max(0, index);
      nextQ.splice(i + 1, 0, song);
      return nextQ;
    });
    setOriginalQueue((q) => {
      const nextQ = [...q];
      const i = Math.max(0, index);
      nextQ.splice(i + 1, 0, song);
      return nextQ;
    });
    push('Queued to play next.');
  }, [index, push]);

  const removeFromQueue = useCallback((i) => {
    setQueue((q) => q.filter((_, idx) => idx !== i));
    setOriginalQueue((q) => q.filter((_, idx) => idx !== i));
    setIndex((cur) => (i < cur ? cur - 1 : cur));
  }, []);

  const clearQueue = useCallback(() => {
    if (!current) {
      setQueue([]);
      setOriginalQueue([]);
      setIndex(-1);
      return;
    }
    setQueue([current]);
    setOriginalQueue([current]);
    setIndex(0);
  }, [current]);

  const reorderQueue = useCallback((from, to) => {
    setQueue((q) => {
      const nextQ = [...q];
      const [item] = nextQ.splice(from, 1);
      nextQ.splice(to, 0, item);
      setIndex(nextQ.findIndex((s) => s.id === current?.id));
      return nextQ;
    });
  }, [current]);

  const value = useMemo(
    () => ({
      audioRef,
      current,
      queue,
      index,
      playing,
      progress,
      duration,
      volume,
      setVolume,
      muted,
      setMuted,
      shuffle,
      repeat,
      queueOpen,
      setQueueOpen,
      expanded,
      setExpanded,
      playSong,
      playFromList,
      togglePlay,
      next,
      previous,
      seek,
      toggleShuffle,
      cycleRepeat,
      addToQueue,
      playNext,
      removeFromQueue,
      clearQueue,
      reorderQueue,
    }),
    [
      current,
      queue,
      index,
      playing,
      progress,
      duration,
      volume,
      muted,
      shuffle,
      repeat,
      queueOpen,
      expanded,
      playSong,
      playFromList,
      togglePlay,
      next,
      previous,
      seek,
      toggleShuffle,
      cycleRepeat,
      addToQueue,
      playNext,
      removeFromQueue,
      clearQueue,
      reorderQueue,
    ],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  return useContext(PlayerContext);
}
