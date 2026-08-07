import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

const lineWidths = ["w-full", "w-3/4", "w-5/6", "w-2/3"];

export default function AmaDetailLoading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 p-4 md:px-8 md:py-12">
      <div className="flex flex-col gap-6">
        <LoadingSkeleton className="h-5 w-32" />
        <LoadingSkeleton className="h-12 w-3/4 rounded-lg" />
        <LoadingSkeleton className="h-5 w-2/3" />
        <LoadingSkeleton className="h-8 w-20 rounded-lg" />
      </div>
      <LoadingSkeleton className="h-px w-full rounded-none" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <LoadingSkeleton key={index} className={`h-5 ${lineWidths[index % lineWidths.length]}`} />
        ))}
      </div>
    </div>
  );
}
