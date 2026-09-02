let cached;

export async function loadCatalog() {
  if (cached) return cached;
  try {
    const res = await fetch('/library/catalog.json', { cache: 'no-store' });
    const type = res.headers.get('content-type') || '';
    if (!res.ok || type.includes('text/html')) {
      cached = emptyCatalog();
      return cached;
    }
    const data = await res.json();
    cached = {
      songs: Array.isArray(data.songs) ? data.songs : [],
      playlists: Array.isArray(data.playlists) ? data.playlists : [],
      favorites: Array.isArray(data.favorites) ? data.favorites : [],
      recentlyPlayed: Array.isArray(data.recentlyPlayed) ? data.recentlyPlayed : [],
    };
  } catch {
    cached = emptyCatalog();
  }
  return cached;
}

function emptyCatalog() {
  return { songs: [], playlists: [], favorites: [], recentlyPlayed: [] };
}

export function presentCatalogSong(song, likedSet) {
  return {
    id: song.id,
    title: song.title,
    artist: song.artist,
    album: song.album,
    genre: song.genre,
    duration: song.duration || 0,
    play_count: song.play_count || 0,
    created_at: song.created_at,
    liked: likedSet.has(song.id) || Boolean(song.liked),
    coverUrl: song.coverFile ? `/library/covers/${encodeURIComponent(song.coverFile)}` : null,
    streamUrl: `/library/songs/${encodeURIComponent(song.audioFile)}`,
    bundled: true,
  };
}
