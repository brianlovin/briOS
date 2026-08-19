"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/Select";

import { LoadingSpinner } from "../ui";

const TAGS = [
  { value: "Personal site", label: "Personal" },
  { value: "Company", label: "Company" },
];

interface GoodWebsitesFiltersProps {
  isLoading?: boolean;
  tag?: string;
}

export function GoodWebsitesFilters({ isLoading, tag = "" }: GoodWebsitesFiltersProps) {
  const router = useRouter();

  const urlTag = tag || "all";
  const [currentTag, setCurrentTag] = useState(urlTag);

  // Sync local state with URL params (for back/forward navigation)
  useEffect(() => {
    setCurrentTag(urlTag);
  }, [urlTag]);

  const pushTag = (value: string) => {
    const params = new URLSearchParams();
    if (value && value !== "all") {
      params.set("tag", value);
    }
    const query = params.toString();
    router.push(`/sites${query ? `?${query}` : ""}`);
  };

  const handleTagChange = (value: string | null) => {
    if (value === null) return;
    // Update local state immediately for instant UI feedback
    setCurrentTag(value);
    pushTag(value);
  };

  const currentTagLabel =
    currentTag === "all" ? "All" : (TAGS.find((t) => t.value === currentTag)?.label ?? currentTag);

  return (
    <div className="flex items-center gap-2 md:flex-row-reverse">
      <Select value={currentTag} onValueChange={handleTagChange}>
        <SelectTrigger>{currentTagLabel}</SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {TAGS.map((tagOption) => (
            <SelectItem key={tagOption.value} value={tagOption.value}>
              {tagOption.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isLoading && <LoadingSpinner />}
    </div>
  );
}
