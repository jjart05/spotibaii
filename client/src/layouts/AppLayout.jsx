import { Outlet } from 'react-router-dom';
import { Sidebar, MobileNav } from './Sidebar.jsx';
import { PlayerBar } from '../components/PlayerBar.jsx';
import { NowPlaying } from '../components/NowPlaying.jsx';
import { QueuePanel } from '../components/QueuePanel.jsx';
import { UploadModal } from '../components/UploadModal.jsx';
import { AddToPlaylistModal, PlaylistEditor } from '../components/PlaylistModals.jsx';
import { ConfirmDialog } from '../components/Modal.jsx';
import { ToastViewport, useToast } from '../context/ToastContext.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';
import { api } from '../services/api.js';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts.js';

export function AppLayout() {
  useKeyboardShortcuts();
  const { confirm, setConfirm, refresh } = useLibrary();
  const { push } = useToast();

  return (
    <div className="flex h-full flex-col bg-shell text-white">
      <div className="relative flex min-h-0 flex-1">
        <Sidebar />
        <main className="relative min-w-0 flex-1 overflow-hidden rounded-lg bg-canvas md:my-2 md:mr-2">
          <div className="h-full overflow-auto">
            <Outlet />
          </div>
          <QueuePanel />
        </main>
      </div>
      <PlayerBar />
      <MobileNav />
      <NowPlaying />
      <UploadModal />
      <PlaylistEditor />
      <AddToPlaylistModal />
      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          body={confirm.body}
          onClose={() => setConfirm(null)}
          onConfirm={async () => {
            try {
              if (confirm.songId) await api.deleteSong(confirm.songId);
              if (confirm.playlistId) await api.deletePlaylist(confirm.playlistId);
              push(confirm.songId ? 'Song deleted.' : 'Playlist deleted.');
              await refresh();
            } catch (err) {
              push(err.message, 'error');
            } finally {
              setConfirm(null);
            }
          }}
        />
      )}
      <ToastViewport />
    </div>
  );
}
