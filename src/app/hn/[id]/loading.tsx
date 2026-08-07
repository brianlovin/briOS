import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

const lineWidths = ["w-full", "w-3/4", "w-5/6", "w-2/3"];

export default function HNPostLoading() {
  return (
    <div className="relative flex min-w-0 flex-col px-4 md:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-col">
        <div className="flex flex-col gap-4 py-8 md:py-12">
          <LoadingSkeleton className="h-12 w-5/6 rounded-lg" />
          <LoadingSkeleton className="h-4 w-28" />
          <LoadingSkeleton className="h-5 w-full" />
          <LoadingSkeleton className="h-5 w-4/5" />
        </div>
        <div className="flex flex-col gap-3 pb-12">
          {Array.from({ length: 8 }).map((_, index) => (
            <LoadingSkeleton
              key={index}
              className={`h-5 ${lineWidths[index % lineWidths.length]}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
