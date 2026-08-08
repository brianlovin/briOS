import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

const lineWidths = ["w-full", "w-3/4", "w-5/6", "w-2/3"];

export default function DesignDetailsLoading() {
  return (
    <div className="flex max-w-2xl flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-1">
        <LoadingSkeleton className="h-8 w-3/4 rounded-lg" />
        <LoadingSkeleton className="h-4 w-28" />
        <LoadingSkeleton className="h-8 w-20 rounded-lg" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <LoadingSkeleton key={index} className={`h-5 ${lineWidths[index % lineWidths.length]}`} />
        ))}
      </div>
    </div>
  );
}
