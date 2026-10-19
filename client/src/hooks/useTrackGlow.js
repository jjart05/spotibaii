import { useEffect } from 'react';
import { applyTrackGlow } from '../utils/coverPalette.js';

/**
 * Drive ambient --track-glow from the currently playing cover art.
 * @param {{ coverUrl?: string | null } | null | undefined} track
 */
export function useTrackGlow(track) {
  const coverUrl = track?.coverUrl || null;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await applyTrackGlow(coverUrl);
    })();
    return () => {
      cancelled = true;
    };
  }, [coverUrl]);
}
