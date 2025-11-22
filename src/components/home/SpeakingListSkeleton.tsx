import { List, ListItem } from "../shared/ListComponents";

export function SpeakingListSkeleton() {
  return (
    <List className="flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <ListItem key={i} className="animate-pulse py-1">
          <div className="bg-tertiary h-3.5 max-w-sm flex-1 rounded-full" />
          <div className="bg-tertiary ml-auto h-3.5 w-16 rounded-full" />
        </ListItem>
      ))}
    </List>
  );
}
