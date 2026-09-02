import { Heart, Home, Library, Plus, Search, Settings, Upload } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { Logo } from '../components/Logo.jsx';
import { Cover } from '../components/Cover.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-white/10 text-white' : 'text-muted hover:bg-white/5 hover:text-white'
  }`;

export function Sidebar() {
  const { playlists, setUploadOpen, setPlaylistModal } = useLibrary();

  return (
    <aside className="hidden h-full w-[280px] shrink-0 flex-col gap-2 bg-shell p-2 md:flex">
      <div className="rounded-lg bg-panel px-4 py-4">
        <Logo />
        <nav className="mt-6 space-y-1">
          <NavLink to="/" end className={linkClass}>
            <Home className="h-5 w-5" /> Home
          </NavLink>
          <NavLink to="/search" className={linkClass}>
            <Search className="h-5 w-5" /> Search
          </NavLink>
          <NavLink to="/library" className={linkClass}>
            <Library className="h-5 w-5" /> Your Library
          </NavLink>
        </nav>
      </div>
      <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-panel px-2 py-3">
        <div className="mb-2 flex items-center justify-between px-2">
          <span className="text-sm font-bold text-muted">Playlists</span>
          <button
            type="button"
            className="text-muted hover:text-white"
            aria-label="Create playlist"
            onClick={() => setPlaylistModal({ mode: 'create' })}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <NavLink to="/liked" className={linkClass}>
          <Heart className="h-5 w-5" /> Liked Songs
        </NavLink>
        <Link
          to="/library?tab=recent"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-muted transition hover:bg-white/5 hover:text-white"
        >
          Recently Played
        </Link>
        <div className="mt-2 flex-1 overflow-auto">
          {playlists.map((p) => (
            <NavLink key={p.id} to={`/playlist/${p.id}`} className={linkClass}>
              <Cover src={p.coverUrl} alt="" className="h-8 w-8" />
              <span className="truncate">{p.name}</span>
            </NavLink>
          ))}
        </div>
        <div className="mt-auto space-y-1 border-t border-white/10 pt-2">
          <button type="button" className={linkClass({ isActive: false })} onClick={() => setUploadOpen(true)}>
            <Upload className="h-5 w-5" /> Upload Music
          </button>
          <NavLink to="/settings" className={linkClass}>
            <Settings className="h-5 w-5" /> Settings
          </NavLink>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const { setUploadOpen } = useLibrary();
  return (
    <nav className="flex h-14 items-center justify-around border-t border-white/10 bg-shell md:hidden">
      <NavLink to="/" end className="flex flex-col items-center text-[10px] text-muted aria-[current=page]:text-white">
        <Home className="h-5 w-5" /> Home
      </NavLink>
      <NavLink to="/search" className="flex flex-col items-center text-[10px] text-muted aria-[current=page]:text-white">
        <Search className="h-5 w-5" /> Search
      </NavLink>
      <NavLink to="/library" className="flex flex-col items-center text-[10px] text-muted aria-[current=page]:text-white">
        <Library className="h-5 w-5" /> Library
      </NavLink>
      <button type="button" className="flex flex-col items-center text-[10px] text-muted" onClick={() => setUploadOpen(true)}>
        <Upload className="h-5 w-5" /> Upload
      </button>
    </nav>
  );
}
