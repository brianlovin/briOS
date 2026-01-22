import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { createMetadata } from "@/lib/metadata";
import { getAppDissectionDatabaseItems } from "@/lib/notion/queries";
import { formatPublishedDate, type NotionAppDissectionItem } from "@/lib/notion/types";

export const metadata: Metadata = createMetadata({
  title: "App Dissection",
  description:
    "Breaking down the design details of well-crafted mobile apps. In-depth analysis of UI patterns, interactions, and user experience.",
  path: "/app-dissection",
});

export default async function AppDissectionIndex() {
  const items = await getAppDissectionDatabaseItems();

  return (
    <div className="@container flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto grid w-full grid-cols-3 gap-1 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:p-8">
          {items.map((item) => (
            <AppDissectionItem key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AppDissectionItem({ item }: { item: NotionAppDissectionItem }) {
  const date = formatPublishedDate(item.published);

  return (
    <Link
      href={`/app-dissection/${item.slug}`}
      className="group/app hover:bg-tertiary dark:hover:shadow-contrast dark:hover:bg-secondary relative flex flex-none flex-col items-center justify-center gap-3 overflow-hidden rounded-xl px-3 py-6"
    >
      {item.icon ? (
        <Image
          width={48}
          height={48}
          alt={item.name}
          className="border-secondary rounded-xl border shadow-xs"
          src={item.icon}
        />
      ) : (
        <div className="border-secondary bg-tertiary flex h-12 w-12 items-center justify-center rounded-xl border shadow-xs">
          <span className="text-tertiary text-lg font-medium">{item.name.charAt(0)}</span>
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        <div className="text-primary text-sm font-medium">{item.name}</div>
        <div className="text-quaternary text-sm">{date}</div>
      </div>
    </Link>
  );
}
