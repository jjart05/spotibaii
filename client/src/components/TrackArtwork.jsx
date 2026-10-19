import { Cover } from './Cover.jsx';

/**
 * Album art that crossfades + soft-scales on track change.
 * Remounts on track id so rapid skips always show the latest cover.
 */
export function TrackArtwork({
  track,
  className = '',
  rounded = 'rounded-md',
  sizeClass = '',
}) {
  const key = track?.id || 'idle';
  return (
    <div className={`track-art relative overflow-hidden ${sizeClass} ${rounded}`}>
      <div key={key} className="track-art-swap h-full w-full">
        <Cover
          src={track?.coverUrl}
          alt={track?.title || ''}
          className={`h-full w-full ${className}`}
          rounded={rounded}
        />
      </div>
    </div>
  );
}
