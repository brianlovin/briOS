"use client";

import { useAtomValue } from "jotai";
import { useEffect } from "react";

import { bodyLockedAtom } from "@/atoms/bodyLock";

export function BodyLock() {
  const locked = useAtomValue(bodyLockedAtom);

  useEffect(() => {
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);

  return null;
}
