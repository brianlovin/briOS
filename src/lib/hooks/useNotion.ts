import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import type { NotionItem, ProcessedBlock } from "@/lib/notion";

/**
 * Hook to fetch a single Notion page content by ID
 */
export function useNotionPage(id: string) {
  const { data, error, isLoading } = useSWR<{
    blocks: ProcessedBlock[];
    metadata: NotionItem;
  }>(`/api/notion/content/${id}`, fetcher);

  return {
    data,
    error,
    isLoading,
  };
}
