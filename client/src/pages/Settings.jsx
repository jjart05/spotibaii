import { useEffect, useState } from 'react';
import { api, getStorageMode } from '../services/api.js';
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
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-extrabold">Settings</h1>
      <section className="mt-8">
        <h2 className="mb-3 font-bold">Appearance</h2>
        <label className="mb-3 flex items-center justify-between rounded-lg bg-panel px-4 py-3">
          Dark mode
          <input type="checkbox" checked={settings.theme !== 'light'} onChange={(e) => patch({ theme: e.target.checked ? 'dark' : 'light' })} />
        </label>
        <div className="rounded-lg bg-panel px-4 py-3">
          <div className="mb-2">Accent</div>
          <div className="flex gap-2">
            {[
              ['green', '#1FE07A'],
              ['teal', '#14D2B4'],
              ['violet', '#A882FF'],
              ['amber', '#FFBA49'],
            ].map(([id, color]) => (
              <button
                key={id}
                type="button"
                aria-label={id}
                onClick={() => patch({ accent: id })}
                className={`h-8 w-8 rounded-full ${settings.accent === id ? 'ring-2 ring-white' : ''}`}
                style={{ background: color }}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="mt-8">
        <h2 className="mb-3 font-bold">Playback</h2>
        <label className="mb-3 flex items-center justify-between rounded-lg bg-panel px-4 py-3">
          Autoplay
          <input type="checkbox" checked={settings.autoplay} onChange={(e) => patch({ autoplay: e.target.checked })} />
        </label>
        <div className="mb-3 rounded-lg bg-panel px-4 py-3">
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
        <label className="flex items-center justify-between rounded-lg bg-panel px-4 py-3 text-muted">
          Crossfade
          <input type="checkbox" checked={settings.crossfade} onChange={(e) => patch({ crossfade: e.target.checked })} />
        </label>
        <p className="mt-2 text-xs text-faint">Crossfade is a visual preference in this local build and does not overlap tracks.</p>
      </section>
      <section className="mt-8">
        <h2 className="mb-3 font-bold">Storage</h2>
        <div className="space-y-2 rounded-lg bg-panel px-4 py-4 text-sm">
          <div className="flex justify-between">
            <span>Library location</span>
            <span>{storageMode === 'browser' ? 'This browser' : storageMode === 'server' ? 'This computer (server)' : '—'}</span>
          </div>
          <div className="flex justify-between"><span>Songs</span><span>{stats?.songs ?? '—'}</span></div>
          <div className="flex justify-between"><span>Playlists</span><span>{stats?.playlists ?? '—'}</span></div>
          <div className="flex justify-between"><span>Liked songs</span><span>{stats?.favorites ?? '—'}</span></div>
          <div className="flex justify-between"><span>Total storage used</span><span>{stats ? formatBytes(stats.storageBytes) : '—'}</span></div>
        </div>
        {storageMode === 'browser' && (
          <p className="mt-3 text-xs text-faint">
            Songs you exported with npm run export-library are part of the website for everyone. Extra uploads on this live URL stay only in this browser until you export and push again.
          </p>
        )}
      </section>
    </div>
  );
}
