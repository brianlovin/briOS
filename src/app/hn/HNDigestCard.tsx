"use client";
import { useAtom } from "jotai";

import { hnSubscribedAtom } from "@/atoms/hnSubscription";
import { Close } from "@/components/icons/Close";
import { Triangle } from "@/components/icons/Triangle";
import { cn } from "@/lib/utils";

import { SubscribeForm } from "./SubscribeForm";

export function HNDigestCard({ className }: { className?: string }) {
  const [isSubscribed, setIsSubscribed] = useAtom(hnSubscribedAtom);

  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (isSubscribed) return null;

  return (
    <div
      className={cn(
        "bg-tertiary dark:bg-secondary dark:shadow-contrast @container relative w-full overflow-hidden rounded-2xl ring-[0.5px] ring-black/5",
        className,
      )}
    >
      <div className="grid grid-cols-1 @lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 @lg:p-8 @lg:pr-0">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Triangle className="fill-black dark:fill-white" />
              <div className="text-primary font-semibold">Daily Digest email</div>
            </div>
            <p className="text-secondary leading-tight text-pretty">
              Get the top HN stories in your inbox every day.
            </p>
          </div>

          <SubscribeForm className="w-full" />
        </div>

        <button
          onClick={() => setIsSubscribed(true)}
          className="hover:text-primary absolute top-2 right-2 z-10 flex size-6 items-center justify-center rounded-full bg-black/10 text-neutral-500 hover:bg-black/15 dark:bg-white/10 dark:hover:bg-white/15"
        >
          <Close size={16} strokeWidth={2} />
        </button>

        <div className="relative hidden select-none @lg:block">
          <div className="dark:shadow-contrast absolute top-13 -right-23 flex aspect-3/5 min-w-64 rotate-1 flex-col gap-4 rounded-lg bg-white p-6 shadow-lg ring-[0.5px] ring-black/5 sm:-right-11 dark:bg-white/10" />

          <div className="dark:shadow-contrast absolute top-12 -right-24 flex aspect-3/5 min-w-64 rotate-3 flex-col gap-4 rounded-lg bg-white p-6 shadow-lg ring-[0.5px] ring-black/5 sm:-right-12 dark:bg-neutral-700">
            <div className="flex flex-col gap-0">
              <div className="text-quaternary grid grid-cols-4 gap-2 font-mono text-xs">
                <span>From:</span>
                <span className="col-span-3">Brian</span>
              </div>
              <div className="text-quaternary grid grid-cols-4 gap-2 font-mono text-xs">
                <span>To:</span>
                <span className="col-span-3">you@gmail.com</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="text-sm font-semibold">Daily Digest</div>
              <div className="text-tertiary text-sm">{date}</div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="h-2 w-[80%] rounded-full bg-black/10 dark:bg-white/10" />
              <div className="h-2 w-[60%] rounded-full bg-black/10 dark:bg-white/10" />
              <div className="h-2 w-[70%] rounded-full bg-black/10 dark:bg-white/10" />
              <div className="h-2 w-[30%] rounded-full bg-black/10 dark:bg-white/10" />
              <div className="h-2 w-[55%] rounded-full bg-black/10 dark:bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
