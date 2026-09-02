import { useEffect } from 'react';

export function Modal({ title, children, onClose, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className={`max-h-[90vh] w-full overflow-auto rounded-xl bg-panel p-6 shadow-card animate-fade-up ${wide ? 'max-w-xl' : 'max-w-md'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button type="button" onClick={onClose} className="text-muted hover:text-white" aria-label="Close">
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
