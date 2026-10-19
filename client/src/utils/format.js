export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value.includes('T') ? value : `${value}Z`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Maayong buntag';
  if (h < 18) return 'Maayong hapon';
  return 'Maayong gabii';
}

export function sortSongs(songs, sort) {
  const copy = [...songs];
  if (sort === 'alpha') copy.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'artist') copy.sort((a, b) => a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title));
  else if (sort === 'played') copy.sort((a, b) => b.play_count - a.play_count);
  else copy.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  return copy;
}

export function shuffleArray(list, currentId) {
  const rest = list.filter((s) => s.id !== currentId);
  for (let i = rest.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  const current = list.find((s) => s.id === currentId);
  return current ? [current, ...rest] : rest;
}
