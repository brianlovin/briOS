import { cn } from "@/lib/utils";

interface InfoPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function InfoPanel({ children, className = "" }: InfoPanelProps) {
  return <div className={cn("text-sm", className)}>{children}</div>;
}
