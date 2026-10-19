import { Moon, Sun } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext.jsx';

/**
 * Premium theme toggle — circular reveal expands from this control.
 */
export function ThemeToggle({ className = '' }) {
  const { settings, setTheme } = useLibrary();
  const isDark = settings.theme !== 'light';

  function onToggle(event) {
    setTheme(isDark ? 'light' : 'dark', {
      originEvent: event,
      originElement: event.currentTarget,
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      onClick={onToggle}
      className={`theme-toggle neo-toggle relative inline-flex h-8 w-[52px] shrink-0 items-center rounded-full bg-raised p-1 transition-colors ${className}`}
    >
      <span
        className={`pointer-events-none absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-shell shadow transition-transform duration-300 ease-out ${
          isDark ? 'translate-x-0' : 'translate-x-[20px]'
        }`}
      >
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}
