import { Badge } from "@/components/ui";

interface PlatformBadgeProps {
  platform: string;
  className?: string;
}

const platformColors = {
  Windows: "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Web: "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  Physical: "bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  macOS: "bg-purple-50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  iOS: "bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
} as const;

export function PlatformBadge({ platform, className = "" }: PlatformBadgeProps) {
  const colorClasses =
    platformColors[platform as keyof typeof platformColors] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";

  return <Badge className={`${colorClasses} text-sm font-medium ${className}`}>{platform}</Badge>;
}
