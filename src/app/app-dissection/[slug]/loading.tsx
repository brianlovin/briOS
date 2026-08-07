import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

const lineWidths = ["w-full", "w-3/4", "w-5/6"];

export default function AppDissectionPostLoading() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-4 py-12 md:px-6 lg:px-8 lg:py-16 xl:py-20">
        <div className="flex flex-col gap-6">
          <LoadingSkeleton className="size-20 rounded-2xl" />
          <div className="flex flex-col gap-2">
            <LoadingSkeleton className="h-12 w-3/4 rounded-lg" />
            <LoadingSkeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton
              key={index}
              className={`h-5 ${lineWidths[index % lineWidths.length]}`}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton key={index} className="aspect-video rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
