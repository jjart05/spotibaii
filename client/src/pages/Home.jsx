import { Heart, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, SectionSkeleton } from '../components/EmptyState.jsx';
import { PlaylistCard, Rail, SongCard } from '../components/SongCard.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';
import { greeting } from '../utils/format.js';

export default function Home() {
  const { home, loading, setUploadOpen } = useLibrary();

  if (loading) {
    return (
      <div className="p-6">
        <SectionSkeleton />
      </div>
    );
  }

  if (!home?.totalSongs) {
    return (
      <EmptyState
        title="Welcome to Spotibai"
        body="Upload your first song to start building your library."
        action={
          <button type="button" onClick={() => setUploadOpen(true)} className="rounded-full bg-accent px-6 py-3 font-bold text-black">
            Upload Music
          </button>
        }
      />
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#333] to-canvas px-6 pb-10 pt-8">
      <h1 className="mb-6 text-3xl font-extrabold">{greeting()}</h1>
      <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Quick to="/liked" title="Liked Songs" icon={<Heart className="h-6 w-6" />} />
        <Quick to="/library?tab=recent" title="Recently Played" />
        <Quick to="/library?tab=songs" title="Recently Added" />
        <Quick to="/library?tab=playlists" title="Playlists" icon={<Music2 className="h-6 w-6" />} />
      </div>
      {home.recentlyPlayed?.length > 0 && (
        <Rail title="Recently played">
          {home.recentlyPlayed.map((s) => (
            <SongCard key={s.id} song={s} list={home.recentlyPlayed} />
          ))}
        </Rail>
      )}
      {home.recent?.length > 0 && (
        <Rail title="Recently added">
          {home.recent.map((s) => (
            <SongCard key={s.id} song={s} list={home.recent} />
          ))}
        </Rail>
      )}
      {home.popular?.length > 0 && (
        <Rail title="Popular songs">
          {home.popular.map((s) => (
            <SongCard key={s.id} song={s} list={home.popular} />
          ))}
        </Rail>
      )}
      {home.madeForYou?.length > 0 && (
        <Rail title="Made for you">
          {home.madeForYou.map((s) => (
            <SongCard key={s.id} song={s} list={home.madeForYou} />
          ))}
        </Rail>
      )}
      {home.playlists?.length > 0 && (
        <Rail title="Your playlists">
          {home.playlists.map((p) => (
            <PlaylistCard key={p.id} playlist={p} />
          ))}
        </Rail>
      )}
    </div>
  );
}

function Quick({ to, title, icon }) {
  return (
    <Link to={to} className="flex items-center gap-3 overflow-hidden rounded-md bg-white/10 hover:bg-white/20">
      <div className="flex h-16 w-16 items-center justify-center bg-accent/20 text-accent">{icon || <Music2 />}</div>
      <span className="font-bold">{title}</span>
    </Link>
  );
}
