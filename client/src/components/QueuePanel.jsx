import { X } from 'lucide-react';
import { Cover } from './Cover.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';

export function QueuePanel() {
  const { queueOpen, setQueueOpen, queue, index, current, playSong, removeFromQueue, clearQueue, reorderQueue } = usePlayer();
  if (!queueOpen) return null;

  return (
    <aside className="absolute bottom-0 right-0 top-0 z-40 flex w-full max-w-md flex-col border-l border-line bg-panel/95 backdrop-blur-xl md:w-[360px]">
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="font-bold">Queue</h2>
        <div className="flex gap-2">
          <button type="button" className="text-sm text-muted hover:text-white" onClick={clearQueue}>
            Clear
          </button>
          <button type="button" onClick={() => setQueueOpen(false)} aria-label="Close queue">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto px-2 pb-4">
        {current && (
          <div className="mb-4">
            <div className="px-2 text-xs font-bold uppercase tracking-wide text-muted">Now playing</div>
            <QueueItem song={current} active />
          </div>
        )}
        <div className="px-2 text-xs font-bold uppercase tracking-wide text-muted">Next up</div>
        {queue.filter((_, i) => i !== index).length === 0 && (
          <p className="px-2 py-6 text-sm text-muted">No upcoming songs.</p>
        )}
        {queue.map((song, i) =>
          i === index ? null : (
            <QueueItem
              key={`${song.id}-${i}`}
              song={song}
              onPlay={() => playSong(song, queue)}
              onRemove={() => removeFromQueue(i)}
              onDragStart={(e) => e.dataTransfer.setData('text/plain', String(i))}
              onDrop={(e) => {
                e.preventDefault();
                reorderQueue(Number(e.dataTransfer.getData('text/plain')), i);
              }}
            />
          ),
        )}
      </div>
    </aside>
  );
}

function QueueItem({ song, active, onPlay, onRemove, onDragStart, onDrop }) {
  return (
    <div
      draggable={!active}
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-hover"
    >
      <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={onPlay}>
        <Cover src={song.coverUrl} alt="" className="h-10 w-10" />
        <div className="min-w-0">
          <div className={`truncate text-sm ${active ? 'text-accent' : ''}`}>{song.title}</div>
          <div className="truncate text-xs text-muted">{song.artist}</div>
        </div>
      </button>
      {onRemove && (
        <button type="button" className="text-muted hover:text-white" onClick={onRemove} aria-label="Remove from queue">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
