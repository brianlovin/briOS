"use client";

import { ChevronLeft } from "@/components/icons/ChevronLeft";
import { ChevronRight } from "@/components/icons/ChevronRight";

interface StepDotsNavigationProps<T extends string> {
  steps: T[];
  currentStep: T;
  onStepChange: (step: T) => void;
  showBorder?: boolean;
}

export function StepDotsNavigation<T extends string>({
  steps,
  currentStep,
  onStepChange,
}: StepDotsNavigationProps<T>) {
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onStepChange(steps[Math.max(0, currentStepIndex - 1)]!)}
        disabled={currentStepIndex === 0}
        className="text-quaternary hover:text-primary p-1 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Previous"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-quaternary min-w-[3ch] text-center text-xs tabular-nums">
        {currentStepIndex + 1}/{steps.length}
      </span>
      <button
        type="button"
        onClick={() => onStepChange(steps[Math.min(steps.length - 1, currentStepIndex + 1)]!)}
        disabled={currentStepIndex === steps.length - 1}
        className="text-quaternary hover:text-primary p-1 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Next"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
