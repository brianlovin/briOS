import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

const lineWidths = ["w-full", "w-3/4", "w-5/6"];

export default function TilEntryLoading() {
  return (
    <div className="min-w-0 flex-1">
      <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-8 px-4 py-12 md:px-6 lg:px-8 lg:py-16 xl:py-20">
        <div className="flex flex-col gap-4">
          <LoadingSkeleton className="h-5 w-36" />
          <LoadingSkeleton className="h-12 w-3/4 rounded-lg" />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton
              key={index}
              className={`h-5 ${lineWidths[index % lineWidths.length]}`}
            />
          ))}
        </div>
        <LoadingSkeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}
