import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function HNLoading() {
  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
