import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

const labels = ["World Population", "Births Today", "Deaths Today"];

export default function NumbersLoading() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-8">
      <div className="grid gap-8 text-4xl sm:grid-cols-2 md:grid-cols-3">
        {labels.map((label) => (
          <div key={label} className="flex flex-col gap-2">
            <div className="text-secondary text-sm">{label}</div>
            <LoadingSkeleton className="h-10 w-48 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
