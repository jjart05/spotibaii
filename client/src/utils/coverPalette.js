/**
 * Sample a dominant (average) color from album artwork.
 * Same-origin covers only — cross-origin failures fall back silently.
 */

const cache = new Map();

/**
 * @param {string | null | undefined} src
 * @returns {Promise<string | null>} RGB channels `"r g b"` or null
 */
export async function sampleCoverColor(src) {
  if (!src) return null;
  if (cache.has(src)) return cache.get(src);

  const promise = new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      try {
        const size = 24;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        let r = 0;
        let g = 0;
        let b = 0;
        let n = 0;
        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a < 200) continue;
          const pr = data[i];
          const pg = data[i + 1];
          const pb = data[i + 2];
          const luma = 0.2126 * pr + 0.7152 * pg + 0.0722 * pb;
          // Skip near-black / near-white pixels so the glow feels chromatic
          if (luma < 28 || luma > 230) continue;
          r += pr;
          g += pg;
          b += pb;
          n += 1;
        }
        if (!n) {
          resolve(null);
          return;
        }
        resolve(
          `${Math.round(r / n)} ${Math.round(g / n)} ${Math.round(b / n)}`,
        );
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

  cache.set(src, promise);
  const result = await promise;
  cache.set(src, result);
  return result;
}

/**
 * Apply sampled cover color to CSS custom properties for ambient glow.
 * @param {string | null | undefined} src
 */
export async function applyTrackGlow(src) {
  const root = document.documentElement;
  const rgb = await sampleCoverColor(src);
  if (rgb) {
    root.style.setProperty('--track-glow', rgb);
    root.dataset.trackGlow = 'on';
  } else {
    root.style.removeProperty('--track-glow');
    delete root.dataset.trackGlow;
  }
}
