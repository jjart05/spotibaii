async function request(path, options = {}) {
  const res = await fetch(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed.');
  return data;
}

export const api = {
  home: () => request('/api/home'),
  stats: () => request('/api/stats'),
  songs: (sort) => request(`/api/songs${sort ? `?sort=${sort}` : ''}`),
  song: (id) => request(`/api/songs/${id}`),
  search: (q) => request(`/api/songs/search?q=${encodeURIComponent(q)}`),
  deleteSong: (id) => request(`/api/songs/${id}`, { method: 'DELETE' }),
  artists: () => request('/api/artists'),
  artist: (name) => request(`/api/artists/${encodeURIComponent(name)}`),
  albums: () => request('/api/albums'),
  album: (name, artist) =>
    request(`/api/albums/${encodeURIComponent(name)}${artist ? `?artist=${encodeURIComponent(artist)}` : ''}`),
  favorites: () => request('/api/favorites'),
  like: (id) => request(`/api/favorites/${id}`, { method: 'POST' }),
  unlike: (id) => request(`/api/favorites/${id}`, { method: 'DELETE' }),
  playlists: () => request('/api/playlists'),
  playlist: (id) => request(`/api/playlists/${id}`),
  createPlaylist: (form) => request('/api/playlists', { method: 'POST', body: form }),
  updatePlaylist: (id, form) => request(`/api/playlists/${id}`, { method: 'PUT', body: form }),
  deletePlaylist: (id) => request(`/api/playlists/${id}`, { method: 'DELETE' }),
  addToPlaylist: (id, songId) =>
    request(`/api/playlists/${id}/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId }),
    }),
  removeFromPlaylist: (id, songId) => request(`/api/playlists/${id}/songs/${songId}`, { method: 'DELETE' }),
  reorderPlaylist: (id, songIds) =>
    request(`/api/playlists/${id}/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songIds }),
    }),
  recent: () => request('/api/recently-played'),
  recordPlay: (songId) =>
    request('/api/recently-played', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId }),
    }),
  upload: (form, onProgress) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload');
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText || '{}');
          if (xhr.status >= 200 && xhr.status < 300) resolve(data);
          else reject(new Error(data.error || 'Upload failed.'));
        } catch {
          reject(new Error('Upload failed.'));
        }
      };
      xhr.onerror = () => reject(new Error('Upload failed.'));
      xhr.send(form);
    }),
};
