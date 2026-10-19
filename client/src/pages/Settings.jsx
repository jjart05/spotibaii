import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getStorageMode } from '../services/api.js';
import { ThemeToggle } from '../components/ThemeToggle.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';
import { formatBytes } from '../utils/format.js';

export default function Settings() {
  const { settings, setSettings } = useLibrary();
  const [stats, setStats] = useState(null);
  const [storageMode, setStorageMode] = useState(null);

  useEffect(() => {
    api.stats().then(setStats);
    getStorageMode().then(setStorageMode);
  }, []);

  function patch(next) {
    setSettings((s) => ({ ...s, ...next }));
  }

  return (
    <div className="desk-wash page-pad mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Settings</h1>
      <p className="mt-2 text-muted">Tune Spotibai to your desk vibe.</p>
      <section className="mt-8">
        <h2 className="mb-3 font-bold">Appearance</h2>
        <div className="neo-surface mb-3 flex items-center justify-between px-4 py-3">
          <div>
            <div className="font-semibold">Dark mode</div>
            <div className="text-xs text-muted">
              {settings.theme === 'light' ? 'Light theme on' : 'Dark theme on'}
            </div>
          </div>
          <ThemeToggle />
        </div>
        <div className="neo-surface px-4 py-3">
          <div className="mb-2">Accent</div>
          <div className="flex gap-2">
            {[
              ['green', '#1ED760'],
              ['coral', '#ff5a3c'],
              ['teal', '#14b8a6'],
              ['gold', '#eab308'],
            ].map(([id, color]) => (
              <button
                key={id}
                type="button"
                aria-label={id}
                onClick={() => patch({ accent: id })}
                className={`neo-btn h-8 w-8 ${settings.accent === id ? 'neo-btn-active ring-2 ring-accent ring-offset-2 ring-offset-panel' : ''}`}
                style={{ background: color }}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="mt-8">
        <h2 className="mb-3 font-bold">Playback</h2>
        <label className="neo-surface mb-3 flex items-center justify-between px-4 py-3">
          Autoplay
          <input
            type="checkbox"
            checked={settings.autoplay}
            onChange={(e) => patch({ autoplay: e.target.checked })}
          />
        </label>
        <div className="neo-surface mb-3 px-4 py-3">
          <div className="mb-2">Default volume</div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.defaultVolume}
            onChange={(e) => patch({ defaultVolume: Number(e.target.value) })}
            className="w-full accent-[rgb(var(--accent))]"
          />
        </div>
        <p className="text-xs text-faint">
          Crossfade is not supported in this build — playback stays simple and solid.
        </p>
      </section>
      <section className="mt-8">
        <h2 className="mb-3 font-bold">Storage</h2>
        <div className="neo-surface space-y-2 px-4 py-4 text-sm">
          <div className="flex justify-between">
            <span>Library location</span>
            <span>
              {storageMode === 'browser'
                ? 'This browser'
                : storageMode === 'server'
                  ? 'This computer (server)'
                  : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Songs</span>
            <span>{stats?.songs ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span>Playlists</span>
            <span>{stats?.playlists ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span>Liked songs</span>
            <span>{stats?.favorites ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span>Total storage used</span>
            <span>{stats ? formatBytes(stats.storageBytes) : '—'}</span>
          </div>
        </div>
        {storageMode === 'browser' && (
          <p className="mt-3 text-xs text-faint">
            Songs exported with npm run export-library ship with the site. Extra uploads on the live URL stay in this browser until you export and push again.
          </p>
        )}
        <Link to="/" className="mt-6 inline-block text-sm font-semibold text-accent hover:underline">
          ← Back to Home
        </Link>
      </section>
    </div>
  );
}
