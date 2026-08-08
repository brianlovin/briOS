import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function AppDissectionLoading() {
  return (
    <div className="@container flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto grid w-full grid-cols-3 gap-1 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:p-8">
          {Array.from({ length: 15 }).map((_, index) => (
            <div
              key={index}
              className="relative flex flex-none flex-col items-center justify-center gap-3 overflow-hidden rounded-xl px-3 py-6"
            >
              <LoadingSkeleton className="size-12 rounded-xl" />
              <LoadingSkeleton className="h-3.5 w-24" />
              <LoadingSkeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
