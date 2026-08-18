import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ActivitySandbox } from "@/components/ActivitySandbox";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Activity Sandbox",
  description: "Simulate activity-feed events without writing to Redis.",
  path: "/activity/sandbox",
  noIndex: true,
});

export default function ActivitySandboxPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ActivitySandbox />;
}
