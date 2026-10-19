import { Outlet } from 'react-router-dom';
import { Sidebar, MobileNav } from './Sidebar.jsx';
import { PlayerBar } from '../components/PlayerBar.jsx';
import { NowPlaying } from '../components/NowPlaying.jsx';
import { QueuePanel } from '../components/QueuePanel.jsx';
import { UploadModal } from '../components/UploadModal.jsx';
import { AddToPlaylistModal, PlaylistEditor } from '../components/PlaylistModals.jsx';
import { ConfirmDialog } from '../components/Modal.jsx';
import { AmbientBackdrop } from '../components/AmbientBackdrop.jsx';
import { MinimalWaves } from '../components/MinimalWaves.jsx';
import { ToastViewport, useToast } from '../context/ToastContext.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useTrackGlow } from '../hooks/useTrackGlow.js';
import { api } from '../services/api.js';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts.js';

export function AppLayout() {
  useKeyboardShortcuts();
  const { confirm, setConfirm, refresh } = useLibrary();
  const { current } = usePlayer();
  const { push } = useToast();
  useTrackGlow(current);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-shell text-ink">
      <AmbientBackdrop />
      <div className="relative z-[1] flex min-h-0 flex-1">
        <Sidebar />
        <main className="relative min-w-0 flex-1 overflow-hidden stage-canvas md:my-2 md:mr-2 md:rounded-2xl">
          <MinimalWaves className="absolute inset-x-0 top-[18%] z-0 h-[40%] opacity-40 md:top-[22%] md:h-[48%] md:opacity-60" />
          <div className="relative z-[1] h-full overflow-auto overscroll-contain">
            <Outlet />
          </div>
          <QueuePanel />
        </main>
      </div>
      <div className="relative z-[1]">
        <PlayerBar />
        <MobileNav />
      </div>
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
