import { cn } from "@/lib/utils";

interface InfoPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function InfoPanel({ children, className = "" }: InfoPanelProps) {
  return (
    <div className={cn("border-primary bg-tertiary border px-4 py-3 text-sm", className)}>
      {children}
    </div>
  );
}
