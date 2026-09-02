export function EmptyState({ title, body, action }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center px-6 py-16 text-center">
      <h2 className="text-2xl font-bold">{title}</h2>
      {body && <p className="mt-2 max-w-md text-muted">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg bg-panel p-3">
          <div className="aspect-square rounded-md bg-raised" />
          <div className="mt-3 h-4 w-3/4 rounded bg-raised" />
          <div className="mt-2 h-3 w-1/2 rounded bg-raised" />
        </div>
      ))}
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
