import { ListDetailWrapper } from "@/components/ListDetailWrapper";

function StackTableSkeleton() {
  return (
    <div className="divide-secondary divide-y">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="animate-pulse px-4 py-3 md:grid md:grid-cols-12 md:items-center md:gap-4">
          {/* Mobile: Icon + Name/Description */}
          <div className="flex gap-3 md:col-span-3 md:gap-3">
            <div className="bg-tertiary size-12 flex-none rounded-lg md:size-8 md:rounded-md" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 md:gap-1">
              <div className="bg-tertiary h-4 w-32 rounded-full md:h-3.5" />
              <div className="bg-tertiary h-3 w-48 rounded-full md:hidden" />
            </div>
          </div>
          {/* Desktop: Description */}
          <div className="bg-tertiary hidden h-3.5 w-64 rounded-full md:col-span-6 md:block" />
          {/* Desktop: Platforms */}
          <div className="hidden gap-1 md:col-span-3 md:flex">
            <div className="bg-tertiary h-5 w-14 rounded-full" />
            <div className="bg-tertiary h-5 w-12 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StackLoading() {
  return (
    <ListDetailWrapper>
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Filters skeleton - mobile */}
        <div className="border-secondary flex border-b p-4 md:hidden">
          <div className="bg-tertiary h-9 w-full animate-pulse rounded-lg" />
        </div>

        {/* Table */}
        <div className="relative flex-1 overflow-auto">
          {/* Table Header - Desktop */}
          <div className="bg-secondary border-secondary sticky top-0 z-10 hidden border-b md:block dark:bg-neutral-950">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium">
              <div className="col-span-3 text-left">Name</div>
              <div className="col-span-6 text-left">Description</div>
              <div className="col-span-3 text-left">Platforms</div>
            </div>
          </div>

          <StackTableSkeleton />
        </div>
      </div>
    </ListDetailWrapper>
  );
}
