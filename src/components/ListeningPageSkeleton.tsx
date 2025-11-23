import { TopBar } from "@/components/TopBar";

export function ListeningPageSkeleton() {
  return (
    <div className="flex flex-1 flex-col">
      <TopBar>
        <div className="flex-1 text-sm font-semibold">Listening</div>
        <div className="text-quaternary hidden pr-1.5 text-sm sm:visible">
          Synced from Spotify every hour
        </div>
      </TopBar>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-1 p-4 md:p-8">
          {Array.from({ length: 20 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex gap-3 p-2">
      {/* Album artwork placeholder */}
      <div className="bg-tertiary size-12 flex-none animate-pulse rounded-lg" />

      {/* Track info */}
      <div className="flex min-w-0 flex-1 flex-col justify-center space-y-2">
        <div className="bg-tertiary h-4 w-48 animate-pulse rounded" />
        <div className="bg-tertiary h-3 w-32 animate-pulse rounded" />
      </div>

      {/* Timestamp placeholder */}
      <div className="text-quaternary hidden items-center sm:flex">
        <div className="bg-tertiary h-3 w-16 animate-pulse rounded" />
      </div>
    </div>
  );
}
