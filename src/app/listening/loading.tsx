import { ListDetailWrapper } from "@/components/ListDetailWrapper";

function ListeningTableSkeleton() {
  return (
    <div className="divide-secondary divide-y">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse px-4 py-3 md:flex md:items-center md:gap-4 md:py-2"
        >
          {/* Mobile: Album art + Song/Artist */}
          <div className="flex gap-3 md:min-w-[200px] md:flex-1 md:gap-3">
            <div className="bg-tertiary size-12 flex-none rounded-lg md:size-8 md:rounded-md" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 md:gap-1">
              <div className="bg-tertiary h-4 w-44 rounded-full md:h-3.5" />
              <div className="bg-tertiary h-3 w-28 rounded-full md:hidden" />
            </div>
          </div>
          {/* Desktop: Artist */}
          <div className="bg-tertiary hidden h-3.5 min-w-[150px] flex-1 rounded-full md:block md:w-32" />
          {/* Desktop: Album */}
          <div className="bg-tertiary hidden h-3.5 min-w-[150px] flex-1 rounded-full md:block md:w-40" />
          {/* Desktop: Played date */}
          <div className="bg-tertiary hidden h-3.5 min-w-[120px] rounded-full md:block md:w-24" />
        </div>
      ))}
    </div>
  );
}

export default function ListeningLoading() {
  return (
    <ListDetailWrapper>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="relative flex-1 overflow-auto">
          <div className="min-w-fit">
            {/* Table Header - Desktop */}
            <div className="bg-secondary border-secondary sticky top-0 z-10 hidden border-b md:block dark:bg-neutral-950">
              <div className="flex gap-4 px-4 py-2 text-sm font-medium">
                <div className="min-w-[200px] flex-1 text-left">Song</div>
                <div className="min-w-[150px] flex-1 text-left">Artist</div>
                <div className="min-w-[150px] flex-1 text-left">Album</div>
                <div className="min-w-[120px] text-left">Played</div>
              </div>
            </div>

            <ListeningTableSkeleton />
          </div>
        </div>
      </div>
    </ListDetailWrapper>
  );
}
