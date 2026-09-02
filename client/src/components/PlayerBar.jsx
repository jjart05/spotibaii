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
import { Cover } from './Cover.jsx';
import { ProgressBar } from './ProgressBar.jsx';
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
    <div className="grid h-[90px] grid-cols-[1fr_auto] items-center gap-3 border-t border-white/10 bg-shell px-3 md:grid-cols-[minmax(180px,1fr)_minmax(320px,2fr)_minmax(180px,1fr)] md:px-4">
      <button
        type="button"
        className="flex min-w-0 items-center gap-3 text-left"
        onClick={() => current && setExpanded(true)}
        aria-label="Open now playing"
      >
        <Cover src={current?.coverUrl} alt="" className="h-14 w-14 shrink-0" />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{current?.title || 'Not playing'}</div>
          <div className="truncate text-xs text-muted">{current?.artist || 'Choose a song to start'}</div>
        </div>
        {current && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(current);
            }}
            onKeyDown={(e) => e.key === 'Enter' && toggleLike(current)}
            className={current.liked ? 'text-accent' : 'text-muted hover:text-white'}
            aria-label="Like"
          >
            <Heart className={`h-4 w-4 ${current.liked ? 'fill-current' : ''}`} />
          </span>
        )}
      </button>

      <div className="hidden flex-col items-center md:flex">
        <div className="flex items-center gap-4">
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
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black disabled:opacity-40"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
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

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black md:hidden"
          onClick={togglePlay}
          disabled={!current}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
        </button>
        <IconBtn label="Expand player" onClick={() => setExpanded(true)} className="md:hidden">
          <Maximize2 className="h-4 w-4" />
        </IconBtn>
        <IconBtn label="Queue" active={queueOpen} onClick={() => setQueueOpen(!queueOpen)} className="hidden md:inline-flex">
          <ListMusic className="h-4 w-4" />
        </IconBtn>
        <div className="hidden items-center gap-2 md:flex">
          <IconBtn label={muted ? 'Unmute' : 'Mute'} onClick={() => setMuted(!muted)}>
            {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
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
            className="h-1 w-24 cursor-pointer accent-[rgb(var(--accent))]"
          />
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
      className={`inline-flex items-center justify-center text-muted hover:text-white ${active ? 'text-accent' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
