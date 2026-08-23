import { cn } from "@/lib/utils";

interface SubsectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SubsectionLabel({ children, className = "" }: SubsectionLabelProps) {
  return (
    <div className={cn("text-quaternary mb-2 text-xs tracking-wide uppercase", className)}>
      {children}
    </div>
  );
}
