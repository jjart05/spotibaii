import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowScroller } from '../components/ArrowScroller.jsx';
import { AlbumCard, ArtistCard, PlaylistCard } from '../components/SongCard.jsx';
import { SongRow } from '../components/SongRow.jsx';
import { EmptyState, RowSkeleton } from '../components/EmptyState.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';
import { sortSongs } from '../utils/format.js';
import { api } from '../services/api.js';

const TABS = [
  { id: 'songs', label: 'Songs' },
  { id: 'albums', label: 'Albums' },
  { id: 'playlists', label: 'Playlists' },
  { id: 'artists', label: 'Artists' },
  { id: 'liked', label: 'Liked' },
  { id: 'recent', label: 'Recent' },
];

export default function Library() {
  const { songs, playlists, recent, loading, setUploadOpen } = useLibrary();
  const [params, setParams] = useSearchParams();
  const rawTab = params.get('tab') || 'songs';
  const tab = rawTab === 'all' ? 'songs' : rawTab;
  const [sort, setSort] = useState('recent');
  const [liked, setLiked] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    api.favorites().then(setLiked).catch(() => {});
    api.albums().then(setAlbums).catch(() => {});
    api.artists().then(setArtists).catch(() => {});
  }, [songs]);

  const sorted = useMemo(() => sortSongs(songs, sort), [songs, sort]);

  if (loading) {
    return (
      <div className="page-pad">
        <RowSkeleton />
      </div>
    );
  }
  if (!songs.length) {
    return (
      <EmptyState
        title="Walay songs pa"
        body="Your library starts empty — upload Bisaya & Tagalog tracks to fill it."
        action={
          <button
            type="button"
            className="rounded-full bg-accent px-5 py-2 font-bold text-shell"
            onClick={() => setUploadOpen(true)}
          >
            Upload Music
          </button>
        }
      />
    );
  }

  return (
    <div className="desk-wash page-pad">
      <div className="sticky-chrome pb-4 pt-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Library</h1>
        <ArrowScroller itemGap={8} className="mt-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setParams({ tab: t.id })}
              className={`chip shrink-0 ${tab === t.id ? 'chip-active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </ArrowScroller>
        {tab === 'songs' && (
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="neo-inset mt-4 rounded-lg px-3 py-2 text-sm"
          >
            <option value="recent">Recently added</option>
            <option value="played">Most played</option>
            <option value="alpha">Alphabetical</option>
            <option value="artist">Artist</option>
          </select>
        )}
      </div>
      {tab === 'songs' &&
        sorted.map((s, i) => <SongRow key={s.id} song={s} list={sorted} index={i + 1} showDate />)}
      {tab === 'liked' &&
        (liked.length ? (
          liked.map((s, i) => <SongRow key={s.id} song={s} list={liked} index={i + 1} />)
        ) : (
          <EmptyState title="Walay liked songs pa" />
        ))}
      {tab === 'recent' &&
        (recent.length ? (
          recent.map((s, i) => <SongRow key={s.id} song={s} list={recent} index={i + 1} />)
        ) : (
          <EmptyState title="Walay recently played pa" />
        ))}
      {tab === 'playlists' && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {playlists.length ? (
            playlists.map((p) => <PlaylistCard key={p.id} playlist={p} fluid />)
          ) : (
            <EmptyState title="Walay playlists pa" />
          )}
        </div>
      )}
      {tab === 'albums' && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {albums.map((a) => (
            <AlbumCard key={`${a.artist}-${a.name}`} album={a} fluid />
          ))}
        </div>
      )}
      {tab === 'artists' && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {artists.map((a) => (
            <ArtistCard key={a.name} artist={a} fluid />
          ))}
        </div>
      )}
    </div>
  );
}
