/**
 * Title / artist that slide-fade on track change without delaying playback.
 */
export function TrackMeta({
  track,
  titleClass = 'truncate text-sm font-semibold',
  artistClass = 'truncate text-xs text-muted',
  fallbackTitle = 'Not playing',
  fallbackArtist = 'Choose a song to start',
}) {
  const key = track?.id || 'idle';
  return (
    <div key={key} className="track-meta-swap min-w-0">
      <div className={titleClass}>{track?.title || fallbackTitle}</div>
      <div className={artistClass}>{track?.artist || fallbackArtist}</div>
    </div>
  );
}
