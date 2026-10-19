export function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5 text-ink">
      <svg width={compact ? 28 : 34} height={compact ? 28 : 34} viewBox="0 0 34 34" aria-hidden="true">
        <rect width="34" height="34" rx="10" fill="rgb(var(--accent))" />
        <path d="M12 24V10l16 7-16 7z" fill="#000000" />
      </svg>
      {!compact && (
        <div className="leading-none">
          <span className="font-display text-xl font-extrabold tracking-tight">Spotibai</span>
          <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            meme music · PH
          </div>
        </div>
      )}
    </div>
  );
}
