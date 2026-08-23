import { cn } from "@/lib/utils";

interface TerminalFrameProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function TerminalFrame({ children, className = "", noPadding = false }: TerminalFrameProps) {
  return (
    <div className={cn("border-primary bg-secondary overflow-hidden border", className)}>
      <div className={cn("font-mono text-sm", !noPadding && "p-4")}>{children}</div>
    </div>
  );
}

/** @deprecated Use TerminalFrame. Kept so ported demos can keep their original import name. */
export const TerminalWindow = TerminalFrame;
