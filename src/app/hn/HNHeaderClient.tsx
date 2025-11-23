"use client";

import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { hnSubscribedAtom } from "@/atoms/hnSubscription";

import { SubscribeDialog } from "./SubscribeDialog";

export function HNHeaderClient() {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    requestAnimationFrame(() => {
      setFormattedDate(formatted);
    });
  }, []);

  const hnSubscribed = useAtomValue(hnSubscribedAtom);

  return (
    <>
      <div className="text-quaternary hidden text-sm sm:flex">{formattedDate}</div>
      {!hnSubscribed && <SubscribeDialog />}
    </>
  );
}
