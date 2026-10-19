import {
  Heart,
  ListMusic,
  Maximize2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ProgressBar } from './ProgressBar.jsx';
import { TrackArtwork } from './TrackArtwork.jsx';
import { TrackMeta } from './TrackMeta.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';

export function PlayerBar() {
  const {
    current,
    playing,
    togglePlay,
    next,
    previous,
    shuffle,
    toggleShuffle,
    repeat,
    cycleRepeat,
    volume,
    setVolume,
    muted,
    setMuted,
    queueOpen,
    setQueueOpen,
    setExpanded,
  } = usePlayer();
  const { toggleLike } = useLibrary();

  return (
    <div className="player-ambient neo-surface rounded-none border-t border-line/40 bg-shell px-2.5 py-1.5 md:px-4 md:py-0">
      <div className="mb-0.5 md:hidden">
        <ProgressBar />
      </div>
      <div className="grid h-[64px] grid-cols-[1fr_auto] items-center gap-2 md:h-[78px] md:grid-cols-[minmax(180px,1fr)_minmax(320px,2fr)_minmax(180px,1fr)] md:gap-3">
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-2.5 text-left md:gap-3"
            onClick={() => current && setExpanded(true)}
            aria-label="Open now playing"
          >
            <TrackArtwork
              track={current}
              sizeClass={`h-11 w-11 shrink-0 md:h-14 md:w-14 ${current ? 'track-glow-ring' : ''}`}
              rounded="rounded-md"
            />
            <TrackMeta
              track={current}
              titleClass="truncate text-[13px] font-semibold md:text-sm"
              artistClass="truncate text-[11px] text-muted md:text-xs"
            />
          </button>
          {current && (
            <button
              type="button"
              onClick={() => toggleLike(current)}
              className={`neo-icon hidden sm:inline-flex ${current.liked ? 'text-accent' : 'text-muted hover:text-white'}`}
              aria-label="Like"
            >
              <Heart className={`h-4 w-4 transition-transform ${current.liked ? 'fill-current scale-110' : ''}`} />
            </button>
          )}
        </div>

        <div className="hidden flex-col items-center md:flex">
          <div className="flex items-center gap-3">
            <IconBtn label="Shuffle" active={shuffle} onClick={toggleShuffle}>
              <Shuffle className="h-4 w-4" />
            </IconBtn>
            <IconBtn label="Previous" onClick={previous}>
              <SkipBack className="h-5 w-5 fill-current" />
            </IconBtn>
            <button
              type="button"
              onClick={togglePlay}
              disabled={!current}
              className="neo-play flex h-9 w-9 items-center justify-center rounded-full bg-white text-shell disabled:opacity-40"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current" />
              )}
            </button>
            <IconBtn label="Next" onClick={next}>
              <SkipForward className="h-5 w-5 fill-current" />
            </IconBtn>
            <IconBtn label="Repeat" active={repeat !== 'off'} onClick={cycleRepeat}>
              {repeat === 'one' ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
            </IconBtn>
          </div>
          <div className="mt-1 w-full max-w-[560px]">
            <ProgressBar />
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5 sm:gap-3">
          <button
            type="button"
            className="neo-play flex h-11 w-11 items-center justify-center rounded-full bg-white text-shell md:hidden"
            onClick={togglePlay}
            disabled={!current}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current" />
            )}
          </button>
          <IconBtn label="Expand player" onClick={() => setExpanded(true)} className="md:hidden">
            <Maximize2 className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            label="Queue"
            active={queueOpen}
            onClick={() => setQueueOpen(!queueOpen)}
            className="hidden sm:inline-flex"
          >
            <ListMusic className="h-4 w-4" />
          </IconBtn>
          <div className="hidden items-center gap-2 md:flex">
            <IconBtn label={muted ? 'Unmute' : 'Mute'} onClick={() => setMuted(!muted)}>
              {muted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </IconBtn>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={muted ? 0 : volume}
              aria-label="Volume"
              onChange={(e) => {
                setMuted(false);
                setVolume(Number(e.target.value));
              }}
              className="h-1 w-24 cursor-pointer accent-[rgb(var(--accent))] transition-opacity"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children, label, onClick, active, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`neo-btn neo-icon inline-flex h-8 w-8 items-center justify-center text-muted hover:text-white ${
        active ? 'neo-btn-active text-accent' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
}
