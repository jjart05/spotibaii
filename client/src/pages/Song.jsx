import { Heart, ListMusic, Play, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { Cover } from '../components/Cover.jsx';
import { EmptyState, RowSkeleton } from '../components/EmptyState.jsx';
import { formatDate, formatTime } from '../utils/format.js';
import { detectLanguage } from '../utils/language.js';
import { sampleCoverColor } from '../utils/coverPalette.js';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';

const LANG_LABEL = {
  bisaya: 'Bisaya',
  tagalog: 'Tagalog',
  mixed: 'Mixed PH',
  other: 'Track',
};

export default function SongPage() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [error, setError] = useState('');
  const [pageGlow, setPageGlow] = useState(null);
  const { playSong, addToQueue } = usePlayer();
  const { toggleLike, setAddToPlaylistSong, setConfirm, songs } = useLibrary();

  useEffect(() => {
    api.song(id).then(setSong).catch((e) => setError(e.message));
  }, [id, songs]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rgb = await sampleCoverColor(song?.coverUrl);
      if (!cancelled) setPageGlow(rgb);
    })();
    return () => {
      cancelled = true;
    };
  }, [song?.coverUrl]);

  if (error) {
    return <EmptyState title={error} body="Try another track from Home or Search." />;
  }
  if (!song) {
    return (
      <div className="page-pad">
        <RowSkeleton />
      </div>
    );
  }

  const lang = detectLanguage(song);

  return (
    <div
      className="hero-wash page-pad"
      style={pageGlow ? { '--track-glow': pageGlow } : undefined}
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-end">
        <Cover
          src={song.coverUrl}
          alt={song.title}
          className="h-56 w-56 shadow-card track-glow-ring sm:h-64 sm:w-64"
          rounded="rounded-2xl"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip chip-active text-xs">{LANG_LABEL[lang]}</span>
            <span className="text-sm font-semibold text-muted">Song</span>
          </div>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {song.title}
          </h1>
          <p className="mt-2 text-lg">
            <Link className="hover:underline" to={`/artist/${encodeURIComponent(song.artist)}`}>
              {song.artist}
            </Link>
            {' · '}
            <Link
              className="hover:underline"
              to={`/album/${encodeURIComponent(song.album)}?artist=${encodeURIComponent(song.artist)}`}
            >
              {song.album}
            </Link>
          </p>
          <p className="mt-2 text-sm text-muted">
            {song.genre !== 'Unknown' ? `${song.genre} · ` : ''}
            {formatTime(song.duration)} · {song.play_count} plays · Added {formatDate(song.created_at)}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-full bg-accent px-6 py-2.5 font-bold text-shell"
              onClick={() => playSong(song, songs)}
            >
              <span className="inline-flex items-center gap-2">
                <Play className="h-4 w-4 fill-current" /> Play
              </span>
            </button>
            <button
              type="button"
              className="rounded-full border border-line bg-raised px-4 py-2.5"
              onClick={() => addToQueue(song)}
            >
              <span className="inline-flex items-center gap-2">
                <ListMusic className="h-4 w-4" /> Queue
              </span>
            </button>
            <button
              type="button"
              className="rounded-full border border-line bg-raised px-4 py-2.5"
              onClick={() => setAddToPlaylistSong(song)}
            >
              Add to playlist
            </button>
            <button
              type="button"
              className={song.liked ? 'text-accent' : 'text-muted'}
              onClick={() => toggleLike(song)}
              aria-label="Like"
            >
              <Heart className={`h-6 w-6 ${song.liked ? 'fill-current' : ''}`} />
            </button>
          </div>
          <button
            type="button"
            className="mt-8 inline-flex items-center gap-2 text-sm text-faint hover:text-red-400"
            onClick={() =>
              setConfirm({
                title: 'Delete song?',
                body: `“${song.title}” and its files will be deleted.`,
                songId: song.id,
              })
            }
          >
            <Trash2 className="h-4 w-4" /> Delete from library
          </button>
        </div>
      </div>
      <div className="neo-surface mt-10 px-5 py-6">
        <h2 className="font-display text-lg font-bold">Lyrics desk</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Synced karaoke lyrics are next on the roadmap. For now, play the track and vibe — Bisaya & Tagalog
          meme energy belongs here.
        </p>
      </div>
    </div>
  );
}
