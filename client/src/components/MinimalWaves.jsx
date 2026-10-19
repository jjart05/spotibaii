/**
 * Static minimal waveform lines for atmospheric background.
 * Intentionally non-animated — texture only, not audio-reactive.
 */
export function MinimalWaves({ className = '' }) {
  return (
    <div className={`minimal-waves pointer-events-none ${className}`} aria-hidden>
      <svg viewBox="0 0 1200 240" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <path
          className="wave-line"
          d="M0 120 Q100 70 200 120 T400 120 T600 120 T800 120 T1000 120 T1200 120"
          fill="none"
        />
        <path
          className="wave-line wave-soft"
          d="M0 140 Q120 175 240 140 T480 140 T720 140 T960 140 T1200 140"
          fill="none"
        />
        <path
          className="wave-line wave-soft"
          d="M0 100 Q150 85 300 100 T600 100 T900 100 T1200 100"
          fill="none"
        />
      </svg>
    </div>
  );
}
