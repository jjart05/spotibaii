export function cleanText(value, fallback = '', max = 200) {
  if (value == null) return fallback;
  const text = String(value)
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim();
  if (!text) return fallback;
  return text.slice(0, max);
}

export function safeInt(value, fallback = 0) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}
