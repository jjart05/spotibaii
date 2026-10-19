const TAGALOG = /\b(ako|ikaw|puso|pilipino|mahal|sinta|lating|sa\s|ng\s|ang\s|parati|parang|kahit|walang|tayo|natin)\b/i;
const BISAYA =
  /\b(bai|naunsa|unsa|kaayo|ganahan|diri|didto|kay|ug|nimo|nimo|wala|nana|mao|lang|pud|gyud|ra\b|ko\b)\b/i;

export function detectLanguage(song) {
  const blob = `${song?.title || ''} ${song?.artist || ''} ${song?.album || ''} ${song?.genre || ''}`;
  const tag = TAGALOG.test(blob);
  const bis = BISAYA.test(blob);
  if (tag && bis) return 'mixed';
  if (bis) return 'bisaya';
  if (tag) return 'tagalog';
  return 'other';
}

export function filterByLanguage(songs, lang) {
  if (!lang || lang === 'all') return songs;
  return songs.filter((s) => detectLanguage(s) === lang);
}

export const LANGUAGE_CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'bisaya', label: 'Bisaya' },
  { id: 'tagalog', label: 'Tagalog' },
  { id: 'mixed', label: 'Mixed' },
];
