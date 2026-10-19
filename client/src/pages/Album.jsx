import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { CollectionHeader } from './Liked.jsx';
import { SongRow } from '../components/SongRow.jsx';
import { EmptyState, RowSkeleton } from '../components/EmptyState.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';

export default function AlbumPage() {
  const { name } = useParams();
  const [params] = useSearchParams();
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState('');
  const { playFromList } = usePlayer();

  useEffect(() => {
    api.album(name, params.get('artist')).then(setAlbum).catch((e) => setError(e.message));
  }, [name, params]);

  if (error) return <EmptyState title={error} />;
  if (!album) return <div className="p-6"><RowSkeleton /></div>;

  return (
    <CollectionHeader
      kind="Album"
      title={album.name}
      subtitle={`${album.artist} · ${album.genre} · ${album.trackCount} tracks`}
      image={album.coverUrl}
      onPlay={() => playFromList(album.songs, 0)}
      onShuffle={() => playFromList([...album.songs].sort(() => Math.random() - 0.5), 0)}
    >
      {album.songs.map((s, i) => (
        <SongRow key={s.id} song={s} list={album.songs} index={i + 1} showAlbum={false} />
      ))}
    </CollectionHeader>
  );
}
