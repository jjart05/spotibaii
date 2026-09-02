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
import { Cover } from './Cover.jsx';
import { ProgressBar } from './ProgressBar.jsx';
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
    <div className="fixed inset-0 z-[60] flex flex-col bg-gradient-to-b from-[#2a2a2a] to-black p-6">
      <button type="button" className="self-start text-muted hover:text-white" onClick={() => setExpanded(false)} aria-label="Close player">
        <ChevronDown className="h-7 w-7" />
      </button>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center">
        <Cover src={current?.coverUrl} alt="" className="aspect-square w-full max-w-sm shadow-card" />
        <div className="mt-8 flex w-full items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="truncate text-2xl font-bold">{current?.title || 'Not playing'}</div>
            <div className="truncate text-muted">{current?.artist}</div>
          </div>
          {current && (
            <button type="button" onClick={() => toggleLike(current)} className={current.liked ? 'text-accent' : 'text-muted'} aria-label="Like">
              <Heart className={`h-6 w-6 ${current.liked ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
        <div className="mt-6 w-full">
          <ProgressBar />
        </div>
        <div className="mt-6 flex items-center gap-8">
          <button type="button" onClick={toggleShuffle} className={shuffle ? 'text-accent' : 'text-muted'} aria-label="Shuffle">
            <Shuffle />
          </button>
          <button type="button" onClick={previous} aria-label="Previous">
            <SkipBack className="h-8 w-8 fill-current" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 fill-current" />}
          </button>
          <button type="button" onClick={next} aria-label="Next">
            <SkipForward className="h-8 w-8 fill-current" />
          </button>
          <button type="button" onClick={cycleRepeat} className={repeat !== 'off' ? 'text-accent' : 'text-muted'} aria-label="Repeat">
            {repeat === 'one' ? <Repeat1 /> : <Repeat />}
          </button>
        </div>
        <button
          type="button"
          className="mt-8 flex items-center gap-2 text-sm text-muted hover:text-white"
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
