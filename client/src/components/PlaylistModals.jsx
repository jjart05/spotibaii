import { Modal } from './Modal.jsx';
import { api } from '../services/api.js';
import { useLibrary } from '../context/LibraryContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useEffect, useState } from 'react';

export function PlaylistEditor() {
  const { playlistModal, setPlaylistModal, refresh } = useLibrary();
  const { push } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState(null);

  useEffect(() => {
    setName(playlistModal?.playlist?.name || '');
    setDescription(playlistModal?.playlist?.description || '');
    setCover(null);
  }, [playlistModal]);

  if (!playlistModal) return null;

  async function submit(e) {
    e.preventDefault();
    const form = new FormData();
    form.append('name', name);
    form.append('description', description);
    if (cover) form.append('cover', cover);
    try {
      if (playlistModal.mode === 'edit') {
        await api.updatePlaylist(playlistModal.playlist.id, form);
        push('Playlist updated.');
      } else {
        await api.createPlaylist(form);
        push('Playlist created.');
      }
      await refresh();
      setPlaylistModal(null);
    } catch (err) {
      push(err.message, 'error');
    }
  }

  return (
    <Modal title={playlistModal.mode === 'edit' ? 'Edit playlist' : 'Create playlist'} onClose={() => setPlaylistModal(null)}>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full rounded-md bg-raised px-3 py-2" placeholder="Playlist name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea className="w-full rounded-md bg-raised px-3 py-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setCover(e.target.files[0])} />
        <button type="submit" className="w-full rounded-full bg-accent py-2 font-bold text-black">
          Save
        </button>
      </form>
    </Modal>
  );
}

export function AddToPlaylistModal() {
  const { addToPlaylistSong, setAddToPlaylistSong, playlists, refresh, setPlaylistModal } = useLibrary();
  const { push } = useToast();
  if (!addToPlaylistSong) return null;

  return (
    <Modal title="Add to playlist" onClose={() => setAddToPlaylistSong(null)}>
      <button
        type="button"
        className="mb-3 w-full rounded-md bg-raised px-3 py-2 text-left hover:bg-hover"
        onClick={() => {
          setAddToPlaylistSong(null);
          setPlaylistModal({ mode: 'create' });
        }}
      >
        New playlist
      </button>
      <div className="max-h-64 space-y-1 overflow-auto">
        {playlists.map((p) => (
          <button
            key={p.id}
            type="button"
            className="block w-full rounded-md px-3 py-2 text-left hover:bg-hover"
            onClick={async () => {
              try {
                await api.addToPlaylist(p.id, addToPlaylistSong.id);
                push('Added to playlist.');
                await refresh();
                setAddToPlaylistSong(null);
              } catch (err) {
                push(err.message, 'error');
              }
            }}
          >
            {p.name}
          </button>
        ))}
      </div>
    </Modal>
  );
}
