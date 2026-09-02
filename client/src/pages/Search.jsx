import { Search as SearchIcon, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { EmptyState, RowSkeleton } from '../components/EmptyState.jsx';
import { AlbumCard, ArtistCard, PlaylistCard, Rail } from '../components/SongCard.jsx';
import { SongRow } from '../components/SongRow.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';

export default function SearchPage() {
  const { songs } = useLibrary();
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const suggestions = useMemo(
    () =>
      songs
        .filter((s) => q && s.title.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 6),
    [songs, q],
  );

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 180);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    if (!debounced) {
      setResults(null);
      return;
    }
    setLoading(true);
    api
      .search(debounced)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [debounced]);

  const empty =
    results &&
    !results.songs.length &&
    !results.artists.length &&
    !results.albums.length &&
    !results.playlists.length;

  return (
    <div className="p-6">
      <div className="sticky top-0 z-10 bg-canvas/90 py-4 backdrop-blur">
        <label className="relative block max-w-xl">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full rounded-full bg-white py-3 pl-12 pr-10 text-black outline-none"
            autoFocus
          />
          {q && (
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-black" onClick={() => setQ('')} aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          )}
        </label>
        {!debounced && q && suggestions.length > 0 && (
          <div className="mt-2 max-w-xl rounded-md bg-panel p-2">
            {suggestions.map((s) => (
              <button key={s.id} type="button" className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-hover" onClick={() => setQ(s.title)}>
                {s.title} · {s.artist}
              </button>
            ))}
          </div>
        )}
      </div>
      {!debounced && <p className="mt-10 text-muted">Search songs, artists, albums, genres, and playlists.</p>}
      {loading && <RowSkeleton />}
      {empty && <EmptyState title="No results found." body={`Nothing matched “${debounced}”.`} />}
      {results && !empty && (
        <div className="mt-4">
          {results.songs.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-xl font-bold">Songs</h2>
              {results.songs.map((s, i) => (
                <SongRow key={s.id} song={s} list={results.songs} index={i + 1} />
              ))}
            </section>
          )}
          {results.artists.length > 0 && (
            <Rail title="Artists">
              {results.artists.map((a) => (
                <ArtistCard key={a.name} artist={a} />
              ))}
            </Rail>
          )}
          {results.albums.length > 0 && (
            <Rail title="Albums">
              {results.albums.map((a) => (
                <AlbumCard key={`${a.artist}-${a.name}`} album={a} />
              ))}
            </Rail>
          )}
          {results.playlists.length > 0 && (
            <Rail title="Playlists">
              {results.playlists.map((p) => (
                <PlaylistCard key={p.id} playlist={p} />
              ))}
            </Rail>
          )}
        </div>
      )}
    </div>
  );
}
