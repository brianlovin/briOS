"use client";

import { useEffect } from "react";

export function useScrollDelegation() {
  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      const target = event.target as Element;

      const mainContent = document.querySelector("[data-main-content]");
      if (!(mainContent instanceof HTMLElement)) return;

      const rect = mainContent.getBoundingClientRect();
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const isInDeadZone = mouseX < rect.left || mouseX > rect.right;
      const shouldDelegate =
        (target === document.body || target === document.documentElement) && isInDeadZone;

      if (!shouldDelegate) {
        return;
      }

      if (mouseY < rect.top || mouseY > rect.bottom) {
        return;
      }

      const scrollableContainer = findActiveScrollableContainer(mainContent, mouseY);

      if (scrollableContainer) {
        event.preventDefault();
        scrollableContainer.scrollBy({
          top: event.deltaY,
          left: event.deltaX,
          behavior: "auto",
        });
      }
    }

    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);
}

function findActiveScrollableContainer(
  mainContent: HTMLElement,
  mouseY: number,
): HTMLElement | null {
  const scrollableContainers = mainContent.querySelectorAll("[data-scrollable]");

  for (let i = 0; i < scrollableContainers.length; i++) {
    const container = scrollableContainers[i];
    if (!(container instanceof HTMLElement)) continue;
    const rect = container.getBoundingClientRect();
    if (mouseY >= rect.top && mouseY <= rect.bottom) {
      if (container.scrollHeight > container.clientHeight) {
        return container;
      }
    }
  }

  return null;
}
