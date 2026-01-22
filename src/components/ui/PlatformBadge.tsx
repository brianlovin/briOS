import { Badge } from "@/components/ui";

interface PlatformBadgeProps {
  platform: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const platformColors = {
  Windows:
    "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50",
  Web: "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50",
  Physical:
    "bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50",
  macOS:
    "bg-purple-50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50",
  iOS: "bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50",
} as const;

const defaultColors =
  "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-900/50";

export function PlatformBadge({ platform, className = "", onClick }: PlatformBadgeProps) {
  const colorClasses = platformColors[platform as keyof typeof platformColors] || defaultColors;

  return (
    <Badge
      className={`${colorClasses} cursor-pointer text-sm font-medium ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {platform}
    </Badge>
  );
}
