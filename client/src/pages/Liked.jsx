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

  if (!songs) return <div className="p-6"><RowSkeleton /></div>;
  if (!songs.length) return <EmptyState title="No liked songs yet." body="Tap the heart on any track to save it here." />;

  return (
    <CollectionHeader
      title="Liked Songs"
      subtitle={`${songs.length} liked songs`}
      color="#5036a6"
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

export function CollectionHeader({ title, subtitle, color, image, icon, onPlay, onShuffle, extra, children }) {
  return (
    <div>
      <div className="flex flex-col gap-6 bg-gradient-to-b px-6 pb-8 pt-12 md:flex-row md:items-end" style={{ backgroundImage: `linear-gradient(${color || '#333'}, #121212)` }}>
        {image ? <img src={image} alt="" className="h-48 w-48 rounded shadow-card" /> : (
          <div className="flex h-48 w-48 items-center justify-center rounded bg-white/10 shadow-card">{icon}</div>
        )}
        <div>
          <div className="text-sm font-semibold">Playlist</div>
          <h1 className="text-4xl font-extrabold md:text-6xl">{title}</h1>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="mt-6 flex items-center gap-3">
            <button type="button" onClick={onPlay} className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-black" aria-label="Play">
              <Play className="h-6 w-6 fill-current" />
            </button>
            <button type="button" onClick={onShuffle} className="text-muted hover:text-white" aria-label="Shuffle">
              <Shuffle />
            </button>
            {extra}
          </div>
        </div>
      </div>
      <div className="px-3 pb-8 pt-4">{children}</div>
    </div>
  );
}
