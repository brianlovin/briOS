export function DesignDetailsPageSkeleton() {
  return (
    <div className="flex flex-col space-y-1 p-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-1 rounded-md px-3.5 py-2">
          <div className="bg-tertiary h-4 w-3/4 animate-pulse rounded" />
          <div className="bg-tertiary h-3 w-1/3 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}
