import { TopBar } from "@/components/TopBar";

// Static skeleton for filters - doesn't access any data
function GoodWebsitesFiltersSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-tertiary h-7 w-32 animate-pulse rounded-md" />
    </div>
  );
}

export function GoodWebsitesPageSkeleton() {
  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <TopBar>
        <div className="text-sm font-medium">Good websites</div>
        <div className="flex-1" />
        {/* Filters */}
        <div className="hidden md:block">
          <GoodWebsitesFiltersSkeleton />
        </div>
      </TopBar>

      <div className="border-secondary flex border-b p-2 md:hidden">
        <GoodWebsitesFiltersSkeleton />
      </div>

      {/* Table */}
      <div className="relative flex-1 overflow-auto">
        {/* Table Header - Sticky (hidden on mobile) */}
        <div className="bg-secondary md:dark:bg-tertiary border-secondary sticky top-0 z-20 hidden border-b md:block">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium">
            <div className="col-span-7 text-left text-[13px]">Name</div>
            <div className="col-span-3 text-left text-[13px]">Site</div>
          </div>
        </div>

        {/* Skeleton Rows */}
        <div className="divide-secondary divide-y">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="border-secondary border-b">
      <div className="flex gap-3 px-4 py-3 text-sm md:grid md:grid-cols-12 md:items-center md:gap-4">
        {/* Icon placeholder - mobile */}
        <div className="bg-tertiary size-10 flex-none animate-pulse rounded-lg md:hidden" />

        {/* Name column + Icon - desktop */}
        <div className="min-w-0 flex-1 md:col-span-7 md:flex md:items-center md:gap-3">
          <div className="bg-tertiary hidden size-6 flex-none animate-pulse rounded-md md:block" />
          <div className="bg-tertiary h-4 w-32 animate-pulse rounded" />
        </div>

        {/* Site/URL column - desktop only */}
        <div className="hidden md:col-span-3 md:block">
          <div className="bg-tertiary h-3 w-24 animate-pulse rounded" />
        </div>

        {/* X/Twitter icon placeholder - desktop only */}
        <div className="hidden md:col-span-2 md:block">
          <div className="bg-tertiary size-4 animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  );
}
