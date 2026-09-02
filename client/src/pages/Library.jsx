import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlbumCard, ArtistCard, PlaylistCard } from '../components/SongCard.jsx';
import { SongRow } from '../components/SongRow.jsx';
import { EmptyState, RowSkeleton } from '../components/EmptyState.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';
import { sortSongs } from '../utils/format.js';
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

const TABS = ['all', 'songs', 'albums', 'playlists', 'artists', 'liked', 'recent'];

export default function Library() {
  const { songs, playlists, recent, loading, setUploadOpen } = useLibrary();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'all';
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

  if (loading) return <div className="p-6"><RowSkeleton /></div>;
  if (!songs.length) {
    return (
      <EmptyState
        title="No songs uploaded yet."
        body="Your library will live here."
        action={
          <button type="button" className="rounded-full bg-accent px-5 py-2 font-bold text-black" onClick={() => setUploadOpen(true)}>
            Upload Music
          </button>
        }
      />
    );
  }

  return (
    <div className="p-6">
      <div className="sticky top-0 z-10 bg-canvas/90 pb-4 pt-2 backdrop-blur">
        <h1 className="text-3xl font-extrabold">Your Library</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setParams({ tab: t })}
              className={`rounded-full px-3 py-1 text-sm ${tab === t ? 'bg-white text-black' : 'bg-raised text-white'}`}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {(tab === 'all' || tab === 'songs') && (
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="mt-4 rounded-md bg-raised px-3 py-2 text-sm">
            <option value="recent">Recently added</option>
            <option value="played">Most played</option>
            <option value="alpha">Alphabetical</option>
            <option value="artist">Artist</option>
          </select>
        )}
      </div>
      {(tab === 'all' || tab === 'songs') && sorted.map((s, i) => <SongRow key={s.id} song={s} list={sorted} index={i + 1} showDate />)}
      {tab === 'liked' &&
        (liked.length ? liked.map((s, i) => <SongRow key={s.id} song={s} list={liked} index={i + 1} />) : <EmptyState title="No liked songs yet." />)}
      {tab === 'recent' &&
        (recent.length ? recent.map((s, i) => <SongRow key={s.id} song={s} list={recent} index={i + 1} />) : <EmptyState title="No recently played songs." />)}
      {tab === 'playlists' && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {playlists.length ? playlists.map((p) => <PlaylistCard key={p.id} playlist={p} />) : <EmptyState title="No playlists yet." />}
        </div>
      )}
      {tab === 'albums' && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {albums.map((a) => (
            <AlbumCard key={`${a.artist}-${a.name}`} album={a} />
          ))}
        </div>
      )}
      {tab === 'artists' && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {artists.map((a) => (
            <ArtistCard key={a.name} artist={a} />
          ))}
        </div>
      )}
    </div>
  );
}
