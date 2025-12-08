import { ListDetailLayout } from "@/components/ListDetailLayout";
import { ListDetailWrapper } from "@/components/ListDetailWrapper";

function HNStoriesListSkeleton() {
  return (
    <ul className="flex flex-col gap-0.5 md:p-3">
      {Array.from({ length: 20 }).map((_, i) => (
        <li key={i} className="scroll-my-3">
          <div className="flex animate-pulse flex-col gap-1.5 border-b border-transparent px-3.5 py-3 md:rounded-lg md:border-b-0">
            <div className="bg-tertiary h-4 w-full max-w-xs rounded-full" />
            <div className="bg-tertiary h-3 w-24 rounded-full" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function HNLoading() {
  return (
    <ListDetailWrapper>
      <ListDetailLayout backHref="/hn" list={<HNStoriesListSkeleton />} />
    </ListDetailWrapper>
  );
}
