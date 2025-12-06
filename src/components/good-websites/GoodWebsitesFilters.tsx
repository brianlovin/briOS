"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

import { LoadingSpinner } from "../ui";

const TAGS = ["Personal site", "Company"];

interface GoodWebsitesFiltersProps {
  isLoading?: boolean;
}

export function GoodWebsitesFilters({ isLoading }: GoodWebsitesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlTag = searchParams.get("tag") || "all";
  const [currentTag, setCurrentTag] = useState(urlTag);

  // Sync local state with URL params (for back/forward navigation)
  useEffect(() => {
    setCurrentTag(urlTag);
  }, [urlTag]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const query = params.toString();
    router.push(`/sites${query ? `?${query}` : ""}`);
  };

  const handleTagChange = (value: string) => {
    // Update local state immediately for instant UI feedback
    setCurrentTag(value);
    // Then update URL which triggers data refetch
    updateParam("tag", value);
  };

  return (
    <div className="flex items-center gap-2 md:flex-row-reverse">
      <Select value={currentTag} onValueChange={handleTagChange}>
        <SelectTrigger className="h-7 w-auto flex-none pr-1.5 pl-2.5 not-last-of-type:self-start">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {TAGS.map((tag) => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isLoading && <LoadingSpinner />}
    </div>
  );
}
