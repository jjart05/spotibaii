import { useMemo, useState } from 'react';
import { Heart, Music2, Play, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArrowScroller } from '../components/ArrowScroller.jsx';
import { Cover } from '../components/Cover.jsx';
import { EmptyState, SectionSkeleton } from '../components/EmptyState.jsx';
import { PlaylistCard, Rail, SongCard } from '../components/SongCard.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';
import { greeting } from '../utils/format.js';
import { filterByLanguage, LANGUAGE_CHIPS } from '../utils/language.js';
import { usePlayer } from '../context/PlayerContext.jsx';

export default function Home() {
  const { home, loading, setUploadOpen, songs } = useLibrary();
  const { playSong } = usePlayer();
  const [lang, setLang] = useState('all');

  const featured = useMemo(() => {
    const pool = home?.popular?.length ? home.popular : home?.recent || [];
    return pool[0] || songs[0] || null;
  }, [home, songs]);

  const deskPicks = useMemo(() => {
    const pool = home?.popular?.length ? home.popular : home?.recent || songs;
    return (pool || []).filter((s) => s.id !== featured?.id).slice(0, 4);
  }, [home, songs, featured]);

  const collage = useMemo(() => {
    const pool = [...(home?.popular || []), ...(home?.recent || []), ...songs];
    const seen = new Set();
    const covers = [];
    for (const s of pool) {
      if (!s?.coverUrl || seen.has(s.coverUrl)) continue;
      seen.add(s.coverUrl);
      covers.push(s);
      if (covers.length >= 4) break;
    }
    return covers;
  }, [home, songs]);

  const filteredRecent = useMemo(
    () => filterByLanguage(home?.recentlyPlayed || [], lang),
    [home, lang],
  );
  const filteredPopular = useMemo(() => filterByLanguage(home?.popular || [], lang), [home, lang]);
  const filteredAdded = useMemo(() => filterByLanguage(home?.recent || [], lang), [home, lang]);

  if (loading) return <SectionSkeleton />;

  if (!home?.totalSongs) {
    return (
      <EmptyState
        title="Kumusta, Bai — welcome to Spotibai"
        body="Upload Bisaya & Tagalog meme tracks and build a library your friends can vibe with."
        action={
          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-bold text-shell"
          >
            <Upload className="h-4 w-4" /> Upload Music
          </button>
        }
      />
    );
  }

  const playPool = home.popular?.length ? home.popular : home.recent;

  return (
    <div className="hero-wash page-pad animate-fade-up">
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] lg:gap-10">
        <div className="min-w-0">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-accent sm:text-sm sm:tracking-[0.2em]">
            Spotibai · PH
          </p>
          <h1 className="mt-2 font-display text-[1.85rem] font-extrabold leading-tight tracking-tight sm:mt-3 sm:text-5xl">
            {greeting()}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:mt-3 sm:text-base">
            Filipino meme-music desk — Bisaya, Tagalog, and whatever banger you just uploaded.
          </p>

          {featured && (
            <button
              type="button"
              onClick={() => playSong(featured, playPool)}
              className="neo-surface group mt-5 flex w-full items-stretch overflow-hidden rounded-2xl text-left sm:mt-9 sm:rounded-3xl"
            >
              <Cover
                src={featured.coverUrl}
                alt=""
                className="h-24 w-24 shrink-0 track-glow-ring sm:h-40 sm:w-40"
                rounded="rounded-none"
              />
              <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2.5 sm:px-6 sm:py-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent sm:text-xs">
                  Featured spin
                </div>
                <div className="mt-0.5 truncate font-display text-lg font-bold sm:mt-1 sm:text-3xl">
                  {featured.title}
                </div>
                <div className="truncate text-xs text-muted sm:text-sm">{featured.artist}</div>
                <div className="mt-2 text-xs font-semibold text-white/90 transition group-hover:text-accent sm:mt-4 sm:text-sm">
                  Tap to play →
                </div>
              </div>
            </button>
          )}

          <ArrowScroller itemGap={8} className="mt-5 sm:mt-9">
            {LANGUAGE_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={`chip shrink-0 ${lang === chip.id ? 'chip-active' : ''}`}
                onClick={() => setLang(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </ArrowScroller>
        </div>

        {/* Compact mobile / tablet desk strip */}
        <aside className="neo-surface overflow-hidden rounded-2xl p-3 lg:hidden">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              Desk pulse · {home.totalSongs} tracks
            </div>
            <Link to="/library?tab=songs" className="text-xs font-semibold text-accent">
              Library
            </Link>
          </div>
          <ArrowScroller itemGap={8}>
            {deskPicks.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => playSong(s, playPool)}
                className="flex w-[7.5rem] shrink-0 flex-col gap-1.5 text-left"
                aria-label={`Play ${s.title}`}
              >
                <Cover
                  src={s.coverUrl}
                  alt=""
                  className="aspect-square w-full"
                  rounded="rounded-xl"
                />
                <div className="truncate text-xs font-semibold">{s.title}</div>
              </button>
            ))}
          </ArrowScroller>
        </aside>

        {/* Full desktop desk panel */}
        <aside className="neo-surface hidden overflow-hidden rounded-3xl p-5 lg:block">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                Desk pulse
              </div>
              <div className="mt-1 font-display text-xl font-bold tracking-tight">Sikat diri</div>
            </div>
            <div className="text-right text-xs text-muted">
              <div>
                <span className="font-semibold text-ink">{home.totalSongs}</span> tracks
              </div>
              <div>{home.recentlyPlayed?.length || 0} recent</div>
            </div>
          </div>

          {collage.length > 0 && (
            <div className="neo-inset mt-5 grid grid-cols-2 gap-2 rounded-2xl p-2">
              {collage.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => playSong(s, playPool)}
                  className="overflow-hidden rounded-xl transition hover:opacity-90"
                  aria-label={`Play ${s.title}`}
                >
                  <Cover
                    src={s.coverUrl}
                    alt=""
                    className="aspect-square w-full"
                    rounded="rounded-xl"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 space-y-1">
            {deskPicks.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => playSong(s, playPool)}
                className="neo-nav flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/5"
              >
                <span className="w-4 text-center text-xs font-bold text-faint">{i + 1}</span>
                <Cover src={s.coverUrl} alt="" className="h-9 w-9 shrink-0" rounded="rounded-md" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{s.title}</div>
                  <div className="truncate text-xs text-muted">{s.artist}</div>
                </div>
                <Play className="h-3.5 w-3.5 shrink-0 text-muted" />
              </button>
            ))}
          </div>

          <Link
            to="/library?tab=songs"
            className="mt-4 inline-flex text-sm font-semibold text-accent hover:underline"
          >
            Open full library →
          </Link>
        </aside>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:grid-cols-4 sm:gap-3">
        <Quick to="/liked" title="Liked" icon={<Heart className="h-5 w-5" />} />
        <Quick to="/library?tab=recent" title="Recent" />
        <Quick to="/library?tab=songs" title="Library" />
        <Quick to="/search" title="Search" icon={<Music2 className="h-5 w-5" />} />
      </div>

      <div className="mt-8 sm:mt-10">
        {filteredRecent.length > 0 && (
          <Rail title="Bagas pa" subtitle="Recently played">
            {filteredRecent.map((s) => (
              <SongCard key={s.id} song={s} list={filteredRecent} />
            ))}
          </Rail>
        )}
        {filteredAdded.length > 0 && (
          <Rail title="Bag-ong upload" subtitle="Fresh from your desk">
            {filteredAdded.map((s) => (
              <SongCard key={s.id} song={s} list={filteredAdded} />
            ))}
          </Rail>
        )}
        {filteredPopular.length > 0 && (
          <Rail title="Sikat diri" subtitle="Most played">
            {filteredPopular.map((s) => (
              <SongCard key={s.id} song={s} list={filteredPopular} />
            ))}
          </Rail>
        )}
        {home.playlists?.length > 0 && (
          <Rail title="Your playlists">
            {home.playlists.map((p) => (
              <PlaylistCard key={p.id} playlist={p} />
            ))}
          </Rail>
        )}
        {!filteredRecent.length && !filteredAdded.length && !filteredPopular.length && (
          <p className="py-8 text-muted">Walay tracks under this filter — try All.</p>
        )}
      </div>
    </div>
  );
}

function Quick({ to, title, icon }) {
  return (
    <Link
      to={to}
      className="neo-surface neo-card flex min-h-[3.25rem] items-center gap-2.5 overflow-hidden rounded-2xl px-2.5 py-2.5 sm:gap-3 sm:px-3 sm:py-3"
    >
      <div className="neo-inset flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-accent sm:h-10 sm:w-10">
        {icon || <Music2 className="h-5 w-5" />}
      </div>
      <span className="truncate text-sm font-semibold sm:text-base">{title}</span>
    </Link>
  );
}
