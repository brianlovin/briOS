import { ListDetailWrapper } from "@/components/ListDetailWrapper";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function SitesLoading() {
  return (
    <ListDetailWrapper>
      <div className="flex h-full flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    </ListDetailWrapper>
  );
}
