import { Heart, Home, Library, Plus, Search, Settings, Upload } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { Logo } from '../components/Logo.jsx';
import { Cover } from '../components/Cover.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';

const linkClass = ({ isActive }) =>
  `neo-nav flex items-center gap-3 px-3 py-2.5 text-sm font-semibold ${
    isActive
      ? 'neo-inset text-accent'
      : 'text-muted hover:text-white'
  }`;

export function Sidebar() {
  const { playlists, setUploadOpen, setPlaylistModal } = useLibrary();

  return (
    <aside className="hidden h-full w-[280px] shrink-0 flex-col gap-2 bg-transparent p-2 md:flex">
      <div className="surface-panel px-4 py-4">
        <Logo />
        <nav className="mt-6 space-y-1">
          <NavLink to="/" end className={linkClass}>
            <Home className="h-5 w-5" /> Home
          </NavLink>
          <NavLink to="/search" className={linkClass}>
            <Search className="h-5 w-5" /> Search
          </NavLink>
          <NavLink to="/library" className={linkClass}>
            <Library className="h-5 w-5" /> Library
          </NavLink>
        </nav>
      </div>
      <div className="surface-panel flex min-h-0 flex-1 flex-col px-2 py-3">
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
          className="neo-nav flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-muted hover:text-white"
        >
          Recently Played
        </Link>
        <div className="mt-2 flex-1 overflow-auto">
          {playlists.map((p) => (
            <NavLink key={p.id} to={`/playlist/${p.id}`} className={linkClass}>
              <Cover src={p.coverUrl} alt="" className="h-8 w-8" rounded="rounded-md" />
              <span className="truncate">{p.name}</span>
            </NavLink>
          ))}
        </div>
        <div className="mt-auto space-y-1 border-t border-line pt-2">
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
  const item =
    'flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-medium text-muted aria-[current=page]:text-accent';
  return (
    <nav className="mobile-nav-safe flex h-14 items-stretch border-t border-line bg-shell/95 px-1 backdrop-blur-xl md:hidden">
      <NavLink to="/" end className={item}>
        <Home className="h-5 w-5" />
        <span className="truncate">Home</span>
      </NavLink>
      <NavLink to="/search" className={item}>
        <Search className="h-5 w-5" />
        <span className="truncate">Search</span>
      </NavLink>
      <NavLink to="/liked" className={item}>
        <Heart className="h-5 w-5" />
        <span className="truncate">Liked</span>
      </NavLink>
      <NavLink to="/library" className={item}>
        <Library className="h-5 w-5" />
        <span className="truncate">Library</span>
      </NavLink>
      <button type="button" className={item} onClick={() => setUploadOpen(true)}>
        <Upload className="h-5 w-5" />
        <span className="truncate">Upload</span>
      </button>
    </nav>
  );
}
