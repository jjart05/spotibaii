import { useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext.jsx';

export function useKeyboardShortcuts() {
  const { togglePlay, next, previous, seek, progress, muted, setMuted } = usePlayer();

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seek(progress + 5);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seek(progress - 5);
      } else if (e.key === 'm' || e.key === 'M') {
        setMuted(!muted);
      } else if (e.key === 'n' || e.key === 'N') {
        next();
      } else if (e.key === 'p' || e.key === 'P') {
        previous();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, next, previous, seek, progress, muted, setMuted]);
}
