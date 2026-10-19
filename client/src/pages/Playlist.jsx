import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { CollectionHeader } from './Liked.jsx';
import { SongRow } from '../components/SongRow.jsx';
import { EmptyState, RowSkeleton } from '../components/EmptyState.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';

export default function PlaylistPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState('');
  const { playFromList } = usePlayer();
  const { setPlaylistModal, setConfirm, refresh } = useLibrary();
  const nav = useNavigate();

  useEffect(() => {
    api.playlist(id).then(setPlaylist).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <EmptyState title={error} />;
  if (!playlist) return <div className="p-6"><RowSkeleton /></div>;

  const songs = playlist.songs || [];

  return (
    <CollectionHeader
      kind="Playlist"
      title={playlist.name}
      subtitle={`${playlist.description || ''} · ${songs.length} songs`}
      image={playlist.coverUrl}
      onPlay={() => playFromList(songs, 0)}
      onShuffle={() => playFromList([...songs].sort(() => Math.random() - 0.5), 0)}
      extra={
        <div className="flex gap-2">
          <button type="button" className="text-muted hover:text-white" aria-label="Edit" onClick={() => setPlaylistModal({ mode: 'edit', playlist })}>
            <Pencil className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="text-muted hover:text-white"
            aria-label="Delete playlist"
            onClick={() =>
              setConfirm({
                title: 'Delete playlist?',
                body: `“${playlist.name}” will be removed.`,
                playlistId: playlist.id,
                after: () => nav('/library?tab=playlists'),
              })
            }
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      }
    >
      {songs.length === 0 && (
        <EmptyState
          title="Walay tracks pa"
          body="Open a song’s ⋯ menu and choose Add to playlist."
        />
      )}
      {songs.map((s, i) => (
        <SongRow
          key={s.id}
          song={s}
          list={songs}
          index={i + 1}
          onRemove={async () => {
            const next = await api.removeFromPlaylist(playlist.id, s.id);
            setPlaylist(next);
            refresh();
          }}
        />
      ))}
    </CollectionHeader>
  );
}
