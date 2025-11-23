import { TopBar } from "@/components/TopBar";

// Static skeleton for filters - doesn't access any data
function StackFiltersSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-tertiary h-7 w-32 animate-pulse rounded-md" />
      <div className="bg-tertiary h-7 w-32 animate-pulse rounded-md" />
    </div>
  );
}

export function StackPageSkeleton() {
  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <TopBar>
        <div className="text-sm font-medium">My Stack</div>
        <div className="flex-1" />

        {/* Filters */}
        <div className="hidden md:block">
          <StackFiltersSkeleton />
        </div>
      </TopBar>

      <div className="border-secondary flex border-b p-2 md:hidden">
        <StackFiltersSkeleton />
      </div>

      {/* Table */}
      <div className="relative flex-1 overflow-auto">
        {/* Table Header - Sticky (hidden on mobile) */}
        <div className="bg-secondary md:dark:bg-tertiary border-secondary sticky top-0 z-10 hidden border-b md:block">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium">
            <div className="col-span-3 text-left text-[13px]">Name</div>
            <div className="col-span-6 text-left text-[13px]">Description</div>
            <div className="col-span-3 text-left text-[13px]">Platforms</div>
          </div>
        </div>

        {/* Skeleton Rows */}
        <div className="divide-secondary divide-y">
          {Array.from({ length: 8 }).map((_, i) => (
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
        <div className="bg-tertiary size-10 flex-none animate-pulse rounded-xl md:hidden" />

        {/* Name column + Icon - desktop */}
        <div className="min-w-0 flex-1 md:col-span-3 md:flex md:items-center md:gap-3">
          <div className="bg-tertiary hidden size-6 flex-none animate-pulse rounded-md md:block" />
          <div className="min-w-0 flex-1">
            <div className="bg-tertiary h-3 w-24 animate-pulse rounded" />
            <div className="bg-tertiary h-3 w-32 animate-pulse rounded md:hidden" />
          </div>
        </div>

        {/* Description column - desktop only */}
        <div className="hidden space-y-2 md:col-span-6 md:block">
          <div className="bg-tertiary h-3 w-3/4 animate-pulse rounded" />
        </div>

        {/* Platforms column - desktop only */}
        <div className="hidden gap-1 md:col-span-3 md:flex">
          <div className="bg-tertiary h-5 w-12 animate-pulse rounded-full" />
          <div className="bg-tertiary h-5 w-12 animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  );
}
