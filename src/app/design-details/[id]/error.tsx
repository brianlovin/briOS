"use client";

import { useEffect } from "react";

/**
 * Fallback UI when an unexpected error escapes the try/catch blocks in
 * page.tsx. Intentionally minimal: no data fetching, no design system
 * imports beyond what the rest of this route already depends on.
 */
export default function DesignDetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[design-details] Uncaught error:", error);
  }, [error]);

  return (
    <div className="flex max-w-2xl flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-primary text-2xl font-semibold">Episode unavailable</h1>
        <p className="text-tertiary text-base">
          Something went wrong loading this episode. This is usually temporary.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="border-secondary text-primary hover:bg-tertiary w-fit rounded-md border px-3 py-1.5 text-sm font-medium"
      >
        Try again
      </button>
    </div>
  );
}
