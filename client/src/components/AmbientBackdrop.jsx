/**
 * Layered atmospheric fields behind the app chrome.
 * Slow drift is CSS-only; disabled under prefers-reduced-motion.
 */
export function AmbientBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="ambient-field ambient-field-a" />
      <div className="ambient-field ambient-field-b" />
      <div className="ambient-field ambient-field-c" />
      <div className="ambient-grain" />
    </div>
  );
}
