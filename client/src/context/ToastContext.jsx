import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const value = useMemo(() => ({ push, toasts }), [push, toasts]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  return useContext(ToastContext);
}

export function ToastViewport() {
  const { toasts } = useToast();
  return (
    <div className="pointer-events-none fixed bottom-28 right-4 z-[80] flex w-[min(360px,calc(100%-2rem))] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto rounded-lg px-4 py-3 text-sm shadow-card animate-fade-up ${
            t.type === 'error' ? 'bg-red-600 text-white' : 'bg-white text-black'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
