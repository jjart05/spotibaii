import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Cover } from './Cover.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';

export function SongCard({ song, list }) {
  const { playSong, current, playing } = usePlayer();
  const nav = useNavigate();
  const active = current?.id === song.id;

  return (
    <button
      type="button"
      onClick={() => playSong(song, list)}
      onDoubleClick={() => nav(`/song/${song.id}`)}
      className="group relative w-full rounded-lg bg-panel p-3 text-left transition hover:-translate-y-0.5 hover:bg-hover hover:shadow-card"
    >
      <div className="relative">
        <Cover src={song.coverUrl} alt={song.title} className="aspect-square w-full" />
        <span className="absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-black opacity-0 shadow-card transition group-hover:translate-y-0 group-hover:opacity-100 translate-y-2">
          <Play className="h-5 w-5 fill-current" />
        </span>
      </div>
      <div className={`mt-3 truncate font-semibold ${active ? 'text-accent' : ''}`}>{song.title}</div>
      <div className="truncate text-sm text-muted">{song.artist}</div>
      {active && playing && <div className="sr-only">Now playing</div>}
    </button>
  );
}

export function AlbumCard({ album }) {
  const nav = useNavigate();
  return (
    <button
      type="button"
      onClick={() =>
        nav(`/album/${encodeURIComponent(album.name)}?artist=${encodeURIComponent(album.artist || '')}`)
      }
      className="group w-full rounded-lg bg-panel p-3 text-left transition hover:bg-hover"
    >
      <Cover src={album.coverUrl} alt={album.name} className="aspect-square w-full" />
      <div className="mt-3 truncate font-semibold">{album.name}</div>
      <div className="truncate text-sm text-muted">{album.artist}</div>
    </button>
  );
}

export function ArtistCard({ artist }) {
  const nav = useNavigate();
  return (
    <button
      type="button"
      onClick={() => nav(`/artist/${encodeURIComponent(artist.name)}`)}
      className="w-full rounded-lg bg-panel p-3 text-center transition hover:bg-hover"
    >
      <Cover src={artist.coverUrl} alt={artist.name} className="mx-auto aspect-square w-full" rounded="rounded-full" />
      <div className="mt-3 truncate font-semibold">{artist.name}</div>
      <div className="text-sm text-muted">Artist</div>
    </button>
  );
}

export function PlaylistCard({ playlist }) {
  const nav = useNavigate();
  return (
    <button
      type="button"
      onClick={() => nav(`/playlist/${playlist.id}`)}
      className="w-full rounded-lg bg-panel p-3 text-left transition hover:bg-hover"
    >
      <Cover src={playlist.coverUrl} alt={playlist.name} className="aspect-square w-full" />
      <div className="mt-3 truncate font-semibold">{playlist.name}</div>
      <div className="truncate text-sm text-muted">{playlist.trackCount || 0} songs</div>
    </button>
  );
}

export function Rail({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">{children}</div>
    </section>
  );
}
