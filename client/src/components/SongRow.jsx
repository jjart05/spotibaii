import { Heart, MoreHorizontal, Pause, Play } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cover } from './Cover.jsx';
import { ContextMenu } from './ContextMenu.jsx';
import { formatDate, formatTime } from '../utils/format.js';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';

export function SongRow({ song, list, index, showAlbum = true, showDate = false, onRemove }) {
  const { playSong, current, playing, togglePlay } = usePlayer();
  const { toggleLike } = useLibrary();
  const [menu, setMenu] = useState(null);
  const active = current?.id === song.id;

  return (
    <div
      className="group grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-white/5 md:grid-cols-[28px_minmax(0,4fr)_minmax(0,2fr)_minmax(0,2fr)_auto]"
      onDoubleClick={() => playSong(song, list)}
      onContextMenu={(e) => {
        e.preventDefault();
        setMenu({ x: e.clientX, y: e.clientY });
      }}
    >
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-white/10 hover:text-white"
        aria-label={active && playing ? 'Pause' : 'Play'}
        onClick={() => (active ? togglePlay() : playSong(song, list))}
      >
        <span className="hidden tabular-nums md:inline md:group-hover:hidden">{index}</span>
        <span className="inline md:hidden md:group-hover:inline">
          {active && playing ? (
            <Pause className="h-3.5 w-3.5 fill-current" />
          ) : (
            <Play className="h-3.5 w-3.5 fill-current" />
          )}
        </span>
      </button>
      <div className="flex min-w-0 items-center gap-3">
        <Cover src={song.coverUrl} alt="" className="h-10 w-10 shrink-0" rounded="rounded-md" />
        <div className="min-w-0">
          <Link
            to={`/song/${song.id}`}
            className={`block truncate font-medium hover:underline ${active ? 'text-accent' : ''}`}
          >
            {song.title}
          </Link>
          <Link
            to={`/artist/${encodeURIComponent(song.artist)}`}
            className="truncate text-muted hover:underline"
          >
            {song.artist}
          </Link>
        </div>
      </div>
      {showAlbum && (
        <Link
          to={`/album/${encodeURIComponent(song.album)}?artist=${encodeURIComponent(song.artist)}`}
          className="hidden truncate text-muted hover:underline md:block"
        >
          {song.album}
        </Link>
      )}
      {showDate && <div className="hidden text-muted md:block">{formatDate(song.created_at)}</div>}
      <div className="flex items-center justify-end gap-2 sm:gap-3">
        <button
          type="button"
          aria-label={song.liked ? 'Unlike' : 'Like'}
          onClick={() => toggleLike(song)}
          className={
            song.liked
              ? 'text-accent'
              : 'text-muted opacity-100 hover:text-white md:opacity-0 md:group-hover:opacity-100'
          }
        >
          <Heart className={`h-4 w-4 ${song.liked ? 'fill-current' : ''}`} />
        </button>
        <span className="hidden w-10 text-right text-muted sm:inline">{formatTime(song.duration)}</span>
        {onRemove && (
          <button type="button" className="text-muted hover:text-white" onClick={onRemove} aria-label="Remove">
            ✕
          </button>
        )}
        <button
          type="button"
          className="text-muted opacity-100 hover:text-white md:opacity-0 md:group-hover:opacity-100"
          aria-label="More options"
          onClick={(e) => {
            e.stopPropagation();
            setMenu({ x: e.clientX, y: e.clientY });
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      {menu && (
        <ContextMenu song={song} list={list} x={menu.x} y={menu.y} onClose={() => setMenu(null)} />
      )}
    </div>
  );
}
