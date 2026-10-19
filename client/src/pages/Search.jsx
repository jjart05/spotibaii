import { Search as SearchIcon, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { ArrowScroller } from '../components/ArrowScroller.jsx';
import { EmptyState, RowSkeleton } from '../components/EmptyState.jsx';
import { AlbumCard, ArtistCard, PlaylistCard, Rail } from '../components/SongCard.jsx';
import { SongRow } from '../components/SongRow.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';
import { LANGUAGE_CHIPS, filterByLanguage } from '../utils/language.js';

const BROWSE = [
  { id: 'bisaya', label: 'Bisaya', q: 'bai' },
  { id: 'tagalog', label: 'Tagalog', q: 'puso' },
  { id: 'opm', label: 'OPM vibes', q: 'pilipino' },
  { id: 'heart', label: 'Heartbreak', q: 'ikaw' },
];

export default function SearchPage() {
  const { songs } = useLibrary();
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('all');

  const suggestions = useMemo(
    () =>
      songs
        .filter((s) => q && s.title.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 6),
    [songs, q],
  );

  const browseSongs = useMemo(() => filterByLanguage(songs, lang).slice(0, 12), [songs, lang]);

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
    <div className="browse-wash page-pad">
      <div className="sticky-chrome py-4">
        <h1 className="mb-3 font-display text-3xl font-extrabold tracking-tight">Search</h1>
        <label className="relative block max-w-xl">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Unsa’y gusto nimo? Title, artist, vibe…"
            className="neo-input w-full py-3 pl-12 pr-10 text-ink placeholder:text-faint"
            autoFocus
          />
          {q && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              onClick={() => setQ('')}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </label>
        {!debounced && q && suggestions.length > 0 && (
          <div className="neo-surface mt-2 max-w-xl p-2">
            {suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-hover"
                onClick={() => setQ(s.title)}
              >
                {s.title} · {s.artist}
              </button>
            ))}
          </div>
        )}
      </div>

      {!debounced && (
        <div className="mt-4">
          <p className="mb-3 text-sm text-muted">Browse by language & vibe</p>
          <ArrowScroller itemGap={8} className="mb-6">
            {LANGUAGE_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={`chip shrink-0 ${lang === chip.id ? 'chip-active' : ''}`}
                onClick={() => setLang(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </ArrowScroller>
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BROWSE.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setQ(b.q)}
                className="neo-surface neo-card px-4 py-5 text-left font-display text-lg font-bold"
              >
                {b.label}
              </button>
            ))}
          </div>
          {browseSongs.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-xl font-bold">From your library</h2>
              {browseSongs.map((s, i) => (
                <SongRow key={s.id} song={s} list={browseSongs} index={i + 1} />
              ))}
            </section>
          )}
        </div>
      )}

      {loading && <RowSkeleton />}
      {empty && (
        <EmptyState title="Walay results" body={`Nothing matched “${debounced}”. Try another word, Bai.`} />
      )}
      {results && !empty && (
        <div className="mt-4">
          {results.songs.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 font-display text-xl font-bold">Songs</h2>
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
