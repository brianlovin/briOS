import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Safely strip HTML tags from a string.
 * Iteratively removes tags to prevent nested tag vulnerabilities (e.g., <scr<script>ipt>).
 */
export function stripHtmlTags(html: string): string {
  let text = html;
  let prevText = "";

  // Keep removing tags until no more tags are found
  while (text !== prevText) {
    prevText = text;
    text = text.replace(/<[^>]*>/g, "");
  }

  return text;
}
