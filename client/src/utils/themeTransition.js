/**
 * Apply light/dark theme with a circular View Transition reveal from an origin point.
 * Falls back to a short CSS color fade when VT API is unavailable or reduced motion is on.
 */

const DURATION_MS = 520;

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function supportsViewTransitions() {
  return typeof document.startViewTransition === 'function';
}

/** Sync DOM theme class (avoids flash before React re-renders). */
export function applyThemeClass(theme) {
  const light = theme === 'light';
  document.body.classList.toggle('theme-light', light);
  document.documentElement.style.colorScheme = light ? 'light' : 'dark';
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
}

function revealRadius(x, y) {
  const maxX = Math.max(x, window.innerWidth - x);
  const maxY = Math.max(y, window.innerHeight - y);
  return Math.hypot(maxX, maxY);
}

function originFromTarget(target) {
  if (!target?.getBoundingClientRect) {
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }
  const rect = target.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

/**
 * @param {'light'|'dark'} theme
 * @param {{ originEvent?: Event, originElement?: Element }} [opts]
 * @param {() => void} [onApplied] called after theme class is applied (for React state)
 */
export async function transitionTheme(theme, opts = {}, onApplied) {
  const { originEvent, originElement } = opts;
  const target =
    originElement ||
    (originEvent?.currentTarget instanceof Element ? originEvent.currentTarget : null) ||
    (originEvent?.target instanceof Element ? originEvent.target : null);

  const { x, y } = originFromTarget(target);
  const endRadius = revealRadius(x, y);

  document.documentElement.style.setProperty('--theme-reveal-x', `${x}px`);
  document.documentElement.style.setProperty('--theme-reveal-y', `${y}px`);
  document.documentElement.style.setProperty('--theme-reveal-r', `${endRadius}px`);

  const apply = () => {
    applyThemeClass(theme);
    onApplied?.();
  };

  if (prefersReducedMotion() || !supportsViewTransitions()) {
    document.documentElement.classList.add('theme-fallback-transition');
    apply();
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-fallback-transition');
    }, DURATION_MS);
    return;
  }

  const transition = document.startViewTransition(apply);

  try {
    await transition.ready;
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: DURATION_MS,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        pseudoElement: '::view-transition-new(root)',
      },
    );
    await transition.finished;
  } catch {
    /* Transition interrupted or unsupported mid-flight — theme already applied. */
  }
}
