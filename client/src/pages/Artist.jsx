import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { CollectionHeader } from './Liked.jsx';
import { AlbumCard, Rail } from '../components/SongCard.jsx';
import { SongRow } from '../components/SongRow.jsx';
import { EmptyState, RowSkeleton } from '../components/EmptyState.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';

export default function ArtistPage() {
  const { name } = useParams();
  const [artist, setArtist] = useState(null);
  const [error, setError] = useState('');
  const { playFromList } = usePlayer();

  useEffect(() => {
    api.artist(name).then(setArtist).catch((e) => setError(e.message));
  }, [name]);

  if (error) return <EmptyState title={error} />;
  if (!artist) return <div className="p-6"><RowSkeleton /></div>;

  return (
    <CollectionHeader
      title={artist.name}
      subtitle={`${artist.songs.length} songs`}
      image={artist.coverUrl}
      onPlay={() => playFromList(artist.songs, 0)}
      onShuffle={() => playFromList([...artist.songs].sort(() => Math.random() - 0.5), 0)}
    >
      <h2 className="mb-3 px-3 text-xl font-bold">Popular</h2>
      {artist.songs.slice(0, 5).map((s, i) => (
        <SongRow key={s.id} song={s} list={artist.songs} index={i + 1} />
      ))}
      {artist.albums?.length > 0 && (
        <div className="mt-8 px-3">
          <Rail title="Albums">
            {artist.albums.map((a) => (
              <AlbumCard key={a.name} album={a} />
            ))}
          </Rail>
        </div>
      )}
      <h2 className="mb-3 mt-6 px-3 text-xl font-bold">All songs</h2>
      {artist.songs.map((s, i) => (
        <SongRow key={`all-${s.id}`} song={s} list={artist.songs} index={i + 1} />
      ))}
    </CollectionHeader>
  );
}
