import {
  ChevronDown,
  Heart,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { ProgressBar } from './ProgressBar.jsx';
import { TrackArtwork } from './TrackArtwork.jsx';
import { TrackMeta } from './TrackMeta.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';

export function NowPlaying() {
  const {
    expanded,
    setExpanded,
    current,
    playing,
    togglePlay,
    next,
    previous,
    shuffle,
    toggleShuffle,
    repeat,
    cycleRepeat,
    setQueueOpen,
  } = usePlayer();
  const { toggleLike } = useLibrary();
  if (!expanded) return null;

  return (
    <div className="now-playing-stage fixed inset-0 z-[60] flex flex-col px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:p-6">
      <div className="ambient-grain absolute inset-0 opacity-[0.04]" aria-hidden />
      <button
        type="button"
        className="neo-icon relative z-[1] self-start text-muted hover:text-white"
        onClick={() => setExpanded(false)}
        aria-label="Close player"
      >
        <ChevronDown className="h-7 w-7" />
      </button>
      <div className="relative z-[1] mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center">
        <TrackArtwork
          track={current}
          sizeClass="aspect-square w-full max-w-[min(100%,20rem)] track-glow-ring shadow-card sm:max-w-sm"
          rounded="rounded-2xl"
          className="aspect-square"
        />
        <div className="mt-6 flex w-full items-center justify-between gap-4 sm:mt-8">
          <TrackMeta
            track={current}
            titleClass="truncate font-display text-xl font-bold tracking-tight sm:text-2xl"
            artistClass="truncate text-sm text-muted sm:text-base"
            fallbackArtist=""
          />
          {current && (
            <button
              type="button"
              onClick={() => toggleLike(current)}
              className={`neo-icon shrink-0 ${current.liked ? 'text-accent' : 'text-muted'}`}
              aria-label="Like"
            >
              <Heart className={`h-6 w-6 transition-transform ${current.liked ? 'fill-current scale-110' : ''}`} />
            </button>
          )}
        </div>
        <div
          key={current?.id || 'lyrics-idle'}
          className="lyrics-swap mt-4 w-full text-center text-sm text-muted/80"
        >
          {current
            ? 'Synced lyrics will land here — vibe with the track for now.'
            : 'Pick a track to open the full player.'}
        </div>
        <div className="mt-6 w-full">
          <ProgressBar />
        </div>
        <div className="mt-5 flex items-center gap-4 sm:mt-6 sm:gap-8">
          <button
            type="button"
            onClick={toggleShuffle}
            className={`neo-btn neo-icon flex h-10 w-10 items-center justify-center ${
              shuffle ? 'neo-btn-active text-accent' : 'text-muted'
            }`}
            aria-label="Shuffle"
          >
            <Shuffle className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={previous}
            className="neo-btn neo-icon flex h-11 w-11 items-center justify-center text-ink"
            aria-label="Previous"
          >
            <SkipBack className="h-6 w-6 fill-current sm:h-7 sm:w-7" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="neo-play flex h-14 w-14 items-center justify-center rounded-full bg-white text-shell shadow-glow sm:h-16 sm:w-16"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? (
              <Pause className="h-6 w-6 fill-current sm:h-7 sm:w-7" />
            ) : (
              <Play className="h-6 w-6 fill-current sm:h-7 sm:w-7" />
            )}
          </button>
          <button
            type="button"
            onClick={next}
            className="neo-btn neo-icon flex h-11 w-11 items-center justify-center text-ink"
            aria-label="Next"
          >
            <SkipForward className="h-6 w-6 fill-current sm:h-7 sm:w-7" />
          </button>
          <button
            type="button"
            onClick={cycleRepeat}
            className={`neo-btn neo-icon flex h-10 w-10 items-center justify-center ${
              repeat !== 'off' ? 'neo-btn-active text-accent' : 'text-muted'
            }`}
            aria-label="Repeat"
          >
            {repeat === 'one' ? <Repeat1 className="h-5 w-5" /> : <Repeat className="h-5 w-5" />}
          </button>
        </div>
        <button
          type="button"
          className="neo-icon mt-8 flex items-center gap-2 text-sm text-muted hover:text-white"
          onClick={() => {
            setQueueOpen(true);
            setExpanded(false);
          }}
        >
          <ListMusic className="h-4 w-4" /> Queue
        </button>
      </div>
    </div>
  );
}
