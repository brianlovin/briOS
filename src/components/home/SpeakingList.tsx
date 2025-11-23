import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-tags";
import { getSpeakingItems } from "@/lib/notion/queries";

import { List, ListItem, ListItemLabel, ListItemSubLabel } from "../shared/ListComponents";

/**
 * Formats ISO date string (e.g., "2025-08-01") to display format (e.g., "Aug '25")
 * Parses the date components directly to avoid timezone conversion issues
 */
function formatSpeakingDate(isoDate: string): string {
  // Parse year, month, day directly from ISO string to avoid timezone issues
  const [year, month] = isoDate.split("-").map(Number);

  // Create date in local timezone
  const date = new Date(year, month - 1, 1);

  const monthStr = date.toLocaleDateString("en-US", { month: "short" });
  const yearStr = year.toString().slice(-2);
  return `${monthStr} '${yearStr}`;
}

export async function SpeakingList() {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.speaking);

  const speakingItems = await getSpeakingItems();

  return (
    <List>
      {speakingItems.map(({ id, title, date, href }) => (
        <ListItem href={href} key={id}>
          <ListItemLabel className="flex-1">{title}</ListItemLabel>
          <ListItemSubLabel className="font-mono opacity-80">
            {formatSpeakingDate(date)}
          </ListItemSubLabel>
        </ListItem>
      ))}
    </List>
  );
}
