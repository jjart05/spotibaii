import { Music2 } from 'lucide-react';

export function EmptyState({ title, body, action }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-accent">
        <Music2 className="h-8 w-8" />
      </div>
      <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
      {body && <p className="mt-2 max-w-md text-muted">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="page-pad">
      <div className="mb-8 h-10 w-48 animate-pulse rounded bg-raised" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-40 shrink-0 animate-pulse sm:w-44">
            <div className="aspect-square rounded-xl bg-raised" />
            <div className="mt-3 h-4 w-3/4 rounded bg-raised" />
            <div className="mt-2 h-3 w-1/2 rounded bg-raised" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-3 rounded-md px-2 py-2">
          <div className="h-10 w-10 rounded bg-raised" />
          <div className="h-4 flex-1 rounded bg-raised" />
          <div className="h-4 w-16 rounded bg-raised" />
        </div>
      ))}
    </div>
  );
}
