"use client";

import { useAtomValue } from "jotai";

import { hnSubscribedAtom } from "@/atoms/hnSubscription";

import { SubscribeDialog } from "./SubscribeDialog";

export function HNHeaderClient() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const hnSubscribed = useAtomValue(hnSubscribedAtom);

  return (
    <>
      <div className="text-quaternary hidden text-sm sm:flex">{formattedDate}</div>
      {!hnSubscribed && <SubscribeDialog />}
    </>
  );
}
