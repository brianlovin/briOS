import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { allAppDissectionItems, AppDissectionItemType } from "@/data/app-dissection";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "App Dissection",
  description:
    "Breaking down the design details of well-crafted mobile apps. In-depth analysis of UI patterns, interactions, and user experience.",
  path: "/app-dissection",
});

export default function AppDissectionIndex() {
  return (
    <div className="@container flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto grid w-full grid-cols-3 gap-1 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:p-8">
          {allAppDissectionItems.map((item) => (
            <AppDissectionItem key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AppDissectionItem({ item }: { item: AppDissectionItemType }) {
  return (
    <Link
      href={`/app-dissection/${item.slug}`}
      className="group/app hover:bg-tertiary relative flex flex-none flex-col items-center justify-center gap-3 overflow-hidden rounded-xl px-3 py-6"
    >
      <Image
        width={48}
        height={48}
        layout="fixed"
        alt={item.title}
        className="border-secondary rounded-xl border shadow-xs"
        src={`/img/app-dissection/${item.slug}.jpeg`}
      />

      <div className="flex flex-col items-center text-center">
        <div className="text-primary text-sm font-medium">{item.title}</div>
        <div className="text-quaternary text-sm">
          {new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
    </Link>
  );
}
