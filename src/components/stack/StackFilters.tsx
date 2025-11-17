"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

const PLATFORMS = ["macOS", "iOS", "Web", "Physical", "Windows"];
const STATUS_OPTIONS = [
  { label: "Actively using", value: "active" },
  { label: "Archive", value: "inactive" },
  { label: "All", value: "all" },
];

export function StackFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "active";
  const currentPlatform = searchParams.get("platform") || "all-platforms";

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
    updateParam("status", value);
  };

  const handlePlatformChange = (value: string) => {
    updateParam("platform", value);
  };

  return (
    <div className="flex items-center gap-2 border-b p-2">
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="h-8 w-auto flex-none not-last-of-type:self-start">
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
        <SelectTrigger className="h-8 w-auto flex-none not-last-of-type:self-start">
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
