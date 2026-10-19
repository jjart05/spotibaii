import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ArrowScroller } from './ArrowScroller.jsx';
import { Cover } from './Cover.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';

export function SongCard({ song, list }) {
  const { playSong, current, playing } = usePlayer();
  const nav = useNavigate();
  const active = current?.id === song.id;

  return (
    <div className="neo-card group relative w-[132px] shrink-0 snap-start sm:w-40">
      <button
        type="button"
        onClick={() => playSong(song, list)}
        className="w-full text-left"
        aria-label={`Play ${song.title}`}
      >
        <div className="neo-inset relative overflow-hidden rounded-xl">
          <Cover src={song.coverUrl} alt={song.title} className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.03]" rounded="rounded-xl" />
          <span className="neo-play absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-shell opacity-100 transition duration-200 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <Play className="h-5 w-5 fill-current" />
          </span>
        </div>
        <div className={`mt-3 truncate font-semibold ${active ? 'text-accent' : ''}`}>{song.title}</div>
        <div className="truncate text-sm text-muted">{song.artist}</div>
      </button>
      <button
        type="button"
        className="mt-1 text-xs font-medium text-muted hover:text-white"
        onClick={() => nav(`/song/${song.id}`)}
      >
        Details
      </button>
      {active && playing && <div className="sr-only">Now playing</div>}
    </div>
  );
}

export function AlbumCard({ album, fluid = false }) {
  const nav = useNavigate();
  return (
    <button
      type="button"
      onClick={() =>
        nav(`/album/${encodeURIComponent(album.name)}?artist=${encodeURIComponent(album.artist || '')}`)
      }
      className={fluid ? 'w-full text-left' : 'w-[148px] shrink-0 snap-start text-left sm:w-40'}
    >
      <Cover src={album.coverUrl} alt={album.name} className="aspect-square w-full" rounded="rounded-xl" />
      <div className="mt-3 truncate font-semibold">{album.name}</div>
      <div className="truncate text-sm text-muted">{album.artist}</div>
    </button>
  );
}

export function ArtistCard({ artist, fluid = false }) {
  const nav = useNavigate();
  return (
    <button
      type="button"
      onClick={() => nav(`/artist/${encodeURIComponent(artist.name)}`)}
      className={fluid ? 'w-full text-center' : 'w-[148px] shrink-0 snap-start text-center sm:w-40'}
    >
      <Cover
        src={artist.coverUrl}
        alt={artist.name}
        className="mx-auto aspect-square w-full"
        rounded="rounded-full"
      />
      <div className="mt-3 truncate font-semibold">{artist.name}</div>
      <div className="text-sm text-muted">Artist</div>
    </button>
  );
}

export function PlaylistCard({ playlist, fluid = false }) {
  const nav = useNavigate();
  return (
    <button
      type="button"
      onClick={() => nav(`/playlist/${playlist.id}`)}
      className={fluid ? 'w-full text-left' : 'w-[148px] shrink-0 snap-start text-left sm:w-40'}
    >
      <Cover src={playlist.coverUrl} alt={playlist.name} className="aspect-square w-full" rounded="rounded-xl" />
      <div className="mt-3 truncate font-semibold">{playlist.name}</div>
      <div className="truncate text-sm text-muted">{playlist.trackCount || 0} songs</div>
    </button>
  );
}

export function Rail({ title, children, subtitle }) {
  return (
    <section className="mb-7 sm:mb-9">
      <div className="mb-3 sm:mb-4">
        <h2 className="font-display text-lg font-bold tracking-tight sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-muted sm:mt-1 sm:text-sm">{subtitle}</p>}
      </div>
      <ArrowScroller itemGap={16} className="-mx-1 px-1" trackClassName="pb-1 snap-x snap-mandatory">
        {children}
      </ArrowScroller>
    </section>
  );
}
