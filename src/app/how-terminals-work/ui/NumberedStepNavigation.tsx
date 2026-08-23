"use client";

import { cn } from "@/lib/utils";

interface NumberedStepNavigationProps {
  totalSteps: number;
  currentStep: number;
  onStepChange: (step: number) => void;
}

export function NumberedStepNavigation({
  totalSteps,
  currentStep,
  onStepChange,
}: NumberedStepNavigationProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onStepChange(i)}
          className={cn(
            "flex h-8 w-8 items-center justify-center border text-sm tabular-nums transition-colors",
            i === currentStep
              ? "border-primary bg-tertiary text-primary"
              : "border-primary text-quaternary hover:text-primary",
          )}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
