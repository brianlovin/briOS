"use client";

import { useSetAtom } from "jotai";
import type { RefObject } from "react";
import { useLayoutEffect } from "react";

import { scrollTargetAtom } from "@/atoms/scrollTarget";

export function useRegisterScrollTarget(ref: RefObject<HTMLElement | null>, active = true) {
  const setScrollTarget = useSetAtom(scrollTargetAtom);

  useLayoutEffect(() => {
    if (!active) return;

    const el = ref.current;
    if (!el) return;

    setScrollTarget(el);
    return () => {
      setScrollTarget((current) => (current === el ? null : current));
    };
  }, [active, ref, setScrollTarget]);
}
