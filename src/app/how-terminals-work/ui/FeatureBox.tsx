import { cn } from "@/lib/utils";

interface FeatureBoxProps {
  children: React.ReactNode;
  className?: string;
  number?: number | string;
  title?: string;
}

export function FeatureBox({ children, className = "", number, title }: FeatureBoxProps) {
  return (
    <div className={cn("bg-tertiary space-y-2 p-4", className)}>
      {(number !== undefined || title) && (
        <div className="text-primary flex items-center gap-2 text-sm font-medium">
          {number !== undefined && <span className="text-quaternary tabular-nums">{number}</span>}
          {title && <span>{title}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
