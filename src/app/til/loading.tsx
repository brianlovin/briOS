import { PageTitle } from "@/components/Typography";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function TilLoading() {
  return (
    <div data-scrollable className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-12 py-16 leading-[1.6]">
        <div className="grid grid-cols-1 gap-2 px-4 sm:grid-cols-[140px_1fr] sm:gap-6 md:grid-cols-[180px_1fr]">
          <div className="hidden sm:block" />
          <PageTitle>TIL</PageTitle>
        </div>
        <div className="flex flex-col gap-12 px-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-2 sm:grid-cols-[140px_1fr] sm:items-baseline sm:gap-6 md:grid-cols-[180px_1fr]"
            >
              <LoadingSkeleton className="h-4 w-24" />
              <div className="flex flex-col gap-3">
                <LoadingSkeleton className="h-5 w-3/4" />
                <div className="flex flex-col gap-2">
                  <LoadingSkeleton className="h-4 w-full" />
                  <LoadingSkeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
