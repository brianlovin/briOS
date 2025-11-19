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

const PLATFORMS = ["macOS", "iOS", "Web", "Physical", "Windows"];
const STATUS_OPTIONS = [
  { label: "Actively using", value: "active" },
  { label: "Archive", value: "inactive" },
  { label: "All", value: "all" },
];

interface StackFiltersProps {
  isLoading?: boolean;
}

export function StackFilters({ isLoading }: StackFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlStatus = searchParams.get("status") || "active";
  const urlPlatform = searchParams.get("platform") || "all-platforms";

  const [currentStatus, setCurrentStatus] = useState(urlStatus);
  const [currentPlatform, setCurrentPlatform] = useState(urlPlatform);

  // Sync local state with URL params (for back/forward navigation)
  useEffect(() => {
    setCurrentStatus(urlStatus);
  }, [urlStatus]);

  useEffect(() => {
    setCurrentPlatform(urlPlatform);
  }, [urlPlatform]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all-platforms") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const query = params.toString();
    router.push(`/stack${query ? `?${query}` : ""}`);
  };

  const handleStatusChange = (value: string) => {
    // Update local state immediately for instant UI feedback
    setCurrentStatus(value);
    // Then update URL which triggers data refetch
    updateParam("status", value);
  };

  const handlePlatformChange = (value: string) => {
    // Update local state immediately for instant UI feedback
    setCurrentPlatform(value);
    // Then update URL which triggers data refetch
    updateParam("platform", value);
  };

  return (
    <div className="flex items-center gap-2">
      {isLoading && <LoadingSpinner />}
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="h-7 w-auto flex-none pr-1.5 pl-2.5 not-last-of-type:self-start">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentPlatform} onValueChange={handlePlatformChange}>
        <SelectTrigger className="h-7 w-auto flex-none pr-1.5 pl-2.5 not-last-of-type:self-start">
          <SelectValue placeholder="All Platforms" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-platforms">All Platforms</SelectItem>
          {PLATFORMS.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
