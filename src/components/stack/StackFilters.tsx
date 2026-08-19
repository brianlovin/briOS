"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/Select";

import { LoadingSpinner } from "../ui";

const PLATFORMS = ["macOS", "iOS", "Web", "Physical", "Windows"];
const STATUS_OPTIONS = [
  { label: "Actively using", value: "active" },
  { label: "Archived", value: "inactive" },
  { label: "All", value: "all" },
];

interface StackFiltersProps {
  isLoading?: boolean;
  status?: string;
  platform?: string;
}

export function StackFilters({ isLoading, status = "active", platform = "" }: StackFiltersProps) {
  const router = useRouter();

  const urlPlatform = platform || "all-platforms";
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentPlatform, setCurrentPlatform] = useState(urlPlatform);

  // Sync local state with URL params (for back/forward navigation)
  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  useEffect(() => {
    setCurrentPlatform(urlPlatform);
  }, [urlPlatform]);

  const pushFilters = (nextStatus: string, nextPlatform: string) => {
    const params = new URLSearchParams();
    if (nextStatus) params.set("status", nextStatus);
    if (nextPlatform && nextPlatform !== "all-platforms") {
      params.set("platform", nextPlatform);
    }
    const query = params.toString();
    router.push(`/stack${query ? `?${query}` : ""}`);
  };

  const handleStatusChange = (value: string | null) => {
    if (value === null) return;
    // Update local state immediately for instant UI feedback
    setCurrentStatus(value);
    pushFilters(value, currentPlatform);
  };

  const handlePlatformChange = (value: string | null) => {
    if (value === null) return;
    // Update local state immediately for instant UI feedback
    setCurrentPlatform(value);
    pushFilters(currentStatus, value);
  };

  const currentStatusLabel = STATUS_OPTIONS.find((opt) => opt.value === currentStatus)?.label;
  const currentPlatformLabel =
    currentPlatform === "all-platforms" ? "All Platforms" : currentPlatform;

  return (
    <div className="flex items-center gap-2 md:flex-row-reverse">
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger>{currentStatusLabel}</SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentPlatform} onValueChange={handlePlatformChange}>
        <SelectTrigger>{currentPlatformLabel}</SelectTrigger>
        <SelectContent>
          <SelectItem value="all-platforms">All Platforms</SelectItem>
          {PLATFORMS.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isLoading && <LoadingSpinner />}
    </div>
  );
}
