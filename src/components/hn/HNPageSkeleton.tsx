export function HNPageSkeleton() {
  return (
    <div className="flex flex-col gap-px p-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-0.5 rounded-md px-3.5 py-3">
          <div className="bg-tertiary h-4 w-full animate-pulse rounded" />
          <div className="bg-tertiary h-4 w-4/5 animate-pulse rounded" />
          <div className="bg-tertiary h-3 w-1/4 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}
