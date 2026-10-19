import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Horizontal scroller with arrow buttons only — scrollbar is fully hidden.
 */
export function ArrowScroller({
  children,
  className = '',
  trackClassName = '',
  itemGap = 8,
}) {
  const ref = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const overflow = max > 4;
    setCanLeft(overflow && el.scrollLeft > 4);
    setCanRight(overflow && el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    update();
    // Re-check after images/layout settle
    const t = window.setTimeout(update, 80);
    el.addEventListener('scroll', update, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(el);
    window.addEventListener('resize', update);
    return () => {
      window.clearTimeout(t);
      el.removeEventListener('scroll', update);
      ro?.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [update, children]);

  function scrollByDir(dir) {
    const el = ref.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.72, 160);
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }

  const overflow = canLeft || canRight;

  return (
    <div className={`arrow-scroller relative ${className}`}>
      {canLeft && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollByDir(-1)}
          className="neo-btn absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-ink"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      {canRight && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollByDir(1)}
          className="neo-btn absolute right-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-ink"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
      <div
        ref={ref}
        className={`arrow-scroller-track no-scrollbar flex overflow-x-auto overflow-y-hidden scroll-smooth ${
          canLeft ? 'pl-9' : ''
        } ${canRight ? 'pr-9' : ''} ${overflow ? '' : ''} ${trackClassName}`}
        style={{ gap: itemGap }}
      >
        {children}
      </div>
    </div>
  );
}
