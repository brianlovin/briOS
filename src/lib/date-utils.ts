/**
 * Format a date string (YYYY-MM-DD) to "Month Year" format
 */
export function formatPublishedDate(dateString: string): string {
  const [year, month] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
