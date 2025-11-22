import { getSpeakingItems } from "@/lib/notion/queries";

import { List, ListItem, ListItemLabel, ListItemSubLabel } from "../shared/ListComponents";

/**
 * Formats ISO date string (e.g., "2025-08-01") to display format (e.g., "Aug '25")
 */
function formatSpeakingDate(isoDate: string): string {
  const date = new Date(isoDate);
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);
  return `${month} '${year}`;
}

export async function SpeakingList() {
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
