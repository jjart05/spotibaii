import { useEffect, useId, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ title, children, onClose, wide }) {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);
  const titleId = useId();

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const panel = panelRef.current;
    const focusables = () => [...(panel?.querySelectorAll(FOCUSABLE) || [])];

    const focusFirst = () => {
      const nodes = focusables();
      (nodes[0] || panel)?.focus();
    };
    // Defer so children (e.g. form fields) are mounted
    const t = window.setTimeout(focusFirst, 0);

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const nodes = focusables();
      if (!nodes.length) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      const prev = previouslyFocused.current;
      if (prev && typeof prev.focus === 'function') prev.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        ref={panelRef}
        className={`max-h-[90vh] w-full overflow-auto rounded-xl bg-panel p-6 shadow-card animate-fade-up ${wide ? 'max-w-xl' : 'max-w-md'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id={titleId} className="min-w-0 text-xl font-bold">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="shrink-0 text-muted hover:text-white" aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ title, body, confirmLabel = 'Delete', onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="text-sm text-muted">{body}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm hover:bg-hover">
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-black"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
