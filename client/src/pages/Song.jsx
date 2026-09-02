import { Heart, ListMusic, Play, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { Cover } from '../components/Cover.jsx';
import { EmptyState, RowSkeleton } from '../components/EmptyState.jsx';
import { formatDate, formatTime } from '../utils/format.js';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';

export default function SongPage() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [error, setError] = useState('');
  const { playSong, addToQueue } = usePlayer();
  const { toggleLike, setAddToPlaylistSong, setConfirm, songs } = useLibrary();

  useEffect(() => {
    api.song(id).then(setSong).catch((e) => setError(e.message));
  }, [id, songs]);

  if (error) return <EmptyState title={error} />;
  if (!song) return <div className="p-6"><RowSkeleton /></div>;

  return (
    <div className="p-6">
      <div className="flex flex-col gap-8 md:flex-row">
        <Cover src={song.coverUrl} alt={song.title} className="h-64 w-64 shadow-card" />
        <div>
          <p className="text-sm font-semibold">Song</p>
          <h1 className="text-4xl font-extrabold">{song.title}</h1>
          <p className="mt-2 text-lg">
            <Link className="hover:underline" to={`/artist/${encodeURIComponent(song.artist)}`}>{song.artist}</Link>
            {' · '}
            <Link className="hover:underline" to={`/album/${encodeURIComponent(song.album)}?artist=${encodeURIComponent(song.artist)}`}>{song.album}</Link>
          </p>
          <p className="mt-2 text-muted">
            {song.genre} · {formatTime(song.duration)} · {song.play_count} plays · Added {formatDate(song.created_at)}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="rounded-full bg-accent px-6 py-2 font-bold text-black" onClick={() => playSong(song, songs)}>
              <span className="inline-flex items-center gap-2"><Play className="h-4 w-4 fill-current" /> Play</span>
            </button>
            <button type="button" className="rounded-full bg-raised px-4 py-2" onClick={() => addToQueue(song)}>
              <span className="inline-flex items-center gap-2"><ListMusic className="h-4 w-4" /> Queue</span>
            </button>
            <button type="button" className="rounded-full bg-raised px-4 py-2" onClick={() => setAddToPlaylistSong(song)}>
              Add to playlist
            </button>
            <button type="button" className={song.liked ? 'text-accent' : 'text-muted'} onClick={() => toggleLike(song)} aria-label="Like">
              <Heart className={`h-6 w-6 ${song.liked ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              className="text-red-400"
              onClick={() =>
                setConfirm({
                  title: 'Delete song?',
                  body: `“${song.title}” and its files will be deleted.`,
                  songId: song.id,
                })
              }
            >
              <Trash2 />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
