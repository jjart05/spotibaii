import { Heart, Play, Shuffle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { EmptyState, RowSkeleton } from '../components/EmptyState.jsx';
import { SongRow } from '../components/SongRow.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';

export default function Liked() {
  const [songs, setSongs] = useState(null);
  const { playFromList } = usePlayer();

  useEffect(() => {
    api.favorites().then(setSongs);
  }, []);

  if (!songs) {
    return (
      <div className="page-pad">
        <RowSkeleton />
      </div>
    );
  }
  if (!songs.length) {
    return (
      <EmptyState
        title="Walay liked songs pa"
        body="Tap the heart on any track — your favorites live here."
      />
    );
  }

  return (
    <CollectionHeader
      kind="Playlist"
      title="Liked Songs"
      subtitle={`${songs.length} liked songs`}
      color="#1DB954"
      icon={<Heart className="h-16 w-16 fill-white" />}
      onPlay={() => playFromList(songs, 0)}
      onShuffle={() => playFromList([...songs].sort(() => Math.random() - 0.5), 0)}
    >
      {songs.map((s, i) => (
        <SongRow key={s.id} song={s} list={songs} index={i + 1} />
      ))}
    </CollectionHeader>
  );
}

export function CollectionHeader({
  kind = 'Playlist',
  title,
  subtitle,
  color,
  image,
  icon,
  onPlay,
  onShuffle,
  extra,
  children,
}) {
  const wash = color || 'rgb(var(--raised))';
  return (
    <div className="desk-wash">
      <div
        className="flex flex-col gap-6 px-4 pb-8 pt-12 sm:px-6 md:flex-row md:items-end"
        style={{
          backgroundImage: `linear-gradient(165deg, ${wash} 0%, transparent 72%), linear-gradient(180deg, rgb(var(--raised) / 0.55) 0%, rgb(var(--canvas)) 100%)`,
        }}
      >
        {image ? (
          <img src={image} alt="" className="h-48 w-48 rounded-2xl shadow-card track-glow-ring" />
        ) : (
          <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-black/20 shadow-card backdrop-blur-sm">
            {icon}
          </div>
        )}
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">{kind}</div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">{title}</h1>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={onPlay}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-shell shadow-glow"
              aria-label="Play"
            >
              <Play className="h-6 w-6 fill-current" />
            </button>
            <button
              type="button"
              onClick={onShuffle}
              className="text-muted hover:text-white"
              aria-label="Shuffle"
            >
              <Shuffle />
            </button>
            {extra}
          </div>
        </div>
      </div>
      <div className="px-2 pt-4 sm:px-3" style={{ paddingBottom: 'var(--chrome)' }}>
        {children}
      </div>
    </div>
  );
}
