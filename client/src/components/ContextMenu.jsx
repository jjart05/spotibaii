import { useEffect, useRef, useState } from 'react';
import { Heart, ListPlus, ListMusic, Play, Trash2, User, Disc3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';

export function ContextMenu({ song, list, x, y, onClose }) {
  const nav = useNavigate();
  const { playSong, addToQueue, playNext } = usePlayer();
  const { toggleLike, setAddToPlaylistSong, setConfirm } = useLibrary();
  const ref = useRef(null);
  const [pos, setPos] = useState({ x, y });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: Math.min(x, window.innerWidth - rect.width - 8),
      y: Math.min(y, window.innerHeight - rect.height - 8),
    });
  }, [x, y]);

  useEffect(() => {
    const close = () => onClose();
    window.addEventListener('click', close);
    window.addEventListener('scroll', close, true);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [onClose]);

  const item = (icon, label, fn, danger) => (
    <button
      type="button"
      className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-hover ${danger ? 'text-red-400' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        fn();
        onClose();
      }}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div
      ref={ref}
      className="fixed z-[90] min-w-[220px] overflow-hidden rounded-xl border border-line bg-panel py-1 shadow-card"
      style={{ left: pos.x, top: pos.y }}
      onClick={(e) => e.stopPropagation()}
    >
      {item(<Play className="h-4 w-4" />, 'Play', () => playSong(song, list))}
      {item(<ListMusic className="h-4 w-4" />, 'Add to queue', () => addToQueue(song))}
      {item(<ListPlus className="h-4 w-4" />, 'Play next', () => playNext(song))}
      {item(<Heart className="h-4 w-4" />, song.liked ? 'Unlike' : 'Like', () => toggleLike(song))}
      {item(<ListPlus className="h-4 w-4" />, 'Add to playlist', () => setAddToPlaylistSong(song))}
      {item(<Disc3 className="h-4 w-4" />, 'View album', () => nav(`/album/${encodeURIComponent(song.album)}?artist=${encodeURIComponent(song.artist)}`))}
      {item(<User className="h-4 w-4" />, 'View artist', () => nav(`/artist/${encodeURIComponent(song.artist)}`))}
      {item(<Trash2 className="h-4 w-4" />, 'Delete', () =>
        setConfirm({
          title: 'Delete song?',
          body: `“${song.title}” will be removed from your library and files will be deleted.`,
          songId: song.id,
        }), true)}
    </div>
  );
}
