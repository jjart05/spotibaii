import { useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext.jsx';

function isTypingTarget(el) {
  if (!el || !(el instanceof Element)) return false;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (el.isContentEditable) return true;
  return Boolean(el.closest('[role="dialog"], [role="menu"], [role="listbox"]'));
}

export function useKeyboardShortcuts() {
  const { togglePlay, next, previous, seek, progress, muted, setMuted } = usePlayer();

  useEffect(() => {
    const onKey = (e) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      if (e.code === 'Space') {
        // Don't steal Space from focused buttons/links — they already activate on Space.
        const tag = e.target?.tagName;
        if (tag === 'BUTTON' || tag === 'A' || e.target?.getAttribute?.('role') === 'button') return;
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
