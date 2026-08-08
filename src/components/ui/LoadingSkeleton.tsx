import { cn } from "@/lib/utils";

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn("bg-tertiary animate-pulse rounded-full", className)} />;
}
