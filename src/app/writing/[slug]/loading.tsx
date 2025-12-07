import { PageTitle } from "@/components/Typography";

function ContentBlockSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-tertiary h-5 w-full rounded-full" />
        </div>
      ))}
      <div className="bg-tertiary h-5 w-3/4 animate-pulse rounded-full" />
    </div>
  );
}

export default function WritingDetailLoading() {
  return (
    <div className="min-w-0 flex-1">
      <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-8 px-4 py-12 md:px-6 lg:px-8 lg:py-16 xl:py-20">
        <div className="flex flex-col gap-6">
          <div className="bg-tertiary h-4 w-24 animate-pulse rounded-full" />
          <PageTitle>
            <div className="bg-tertiary h-8 w-96 max-w-full animate-pulse rounded-full" />
          </PageTitle>
        </div>

        <div className="flex min-w-0 flex-col gap-4 text-lg">
          <ContentBlockSkeleton />
          <ContentBlockSkeleton />
        </div>
      </div>
    </div>
  );
}
