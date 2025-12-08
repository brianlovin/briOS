import { ListDetailLayout } from "@/components/ListDetailLayout";
import { ListDetailWrapper } from "@/components/ListDetailWrapper";
import { Button } from "@/components/ui";

function AMAListSkeleton() {
  return (
    <ul className="flex flex-col md:p-3">
      {Array.from({ length: 15 }).map((_, i) => (
        <li key={i}>
          <div className="flex animate-pulse flex-col gap-1.5 border-b border-transparent px-3 py-3 md:rounded-lg md:border-b-0">
            <div className="bg-tertiary h-4 w-full max-w-md rounded-full" />
            <div className="bg-tertiary h-3 w-20 rounded-full" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function AMALoading() {
  return (
    <ListDetailWrapper>
      <ListDetailLayout
        backHref="/ama"
        list={
          <div className="flex h-full flex-1 flex-col">
            <div className="flex-col px-3 py-3 md:pb-0">
              <Button variant="secondary" fullWidth disabled>
                Ask a question
              </Button>
            </div>
            <AMAListSkeleton />
          </div>
        }
      />
    </ListDetailWrapper>
  );
}
