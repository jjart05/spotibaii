export function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5 text-white">
      <svg width={compact ? 28 : 32} height={compact ? 28 : 32} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="rgb(var(--accent))" />
        <path d="M10 22V10l14 6-14 6z" fill="#111" />
      </svg>
      {!compact && <span className="text-xl font-extrabold tracking-tight">Spotibai</span>}
    </div>
  );
}
