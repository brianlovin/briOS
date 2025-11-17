"use client";

import { useEffect } from "react";

export function useScrollDelegation() {
  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      const target = event.target as Element;

      // Find the main content area
      const mainContent = document.querySelector("[data-main-content]") as HTMLElement;
      if (!mainContent) return;

      const rect = mainContent.getBoundingClientRect();
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // Check if mouse is in the dead zone (outside main content horizontally)
      const isInDeadZone = mouseX < rect.left || mouseX > rect.right;

      // Check if mouse is over the primary sidebar
      const primarySidebar = document.querySelector("[data-primary-sidebar]") as HTMLElement;
      const isOverSidebar = primarySidebar && primarySidebar.contains(target);

      // Only handle events from dead zones or sidebar on large screens
      const shouldDelegate =
        (target === document.body || target === document.documentElement) && isInDeadZone;
      const shouldDelegateSidebar = isOverSidebar && window.innerWidth >= 768; // md breakpoint

      if (!shouldDelegate && !shouldDelegateSidebar) {
        return;
      }

      // Only proceed if within the vertical bounds of main content
      if (mouseY < rect.top || mouseY > rect.bottom) {
        return;
      }

      // For sidebar delegation, check if the sidebar actually needs scrolling
      if (shouldDelegateSidebar) {
        const sidebarScrollContainer = primarySidebar?.querySelector(
          '[class*="overflow-y-auto"]',
        ) as HTMLElement;
        if (
          sidebarScrollContainer &&
          sidebarScrollContainer.scrollHeight > sidebarScrollContainer.clientHeight
        ) {
          // Sidebar has scrollable content, let it handle scrolling naturally
          return;
        }
      }

      // Find the currently active scrollable container within the main content
      const scrollableContainer = findActiveScrollableContainer(mainContent, mouseY);

      if (scrollableContainer) {
        // Prevent the default scroll behavior
        event.preventDefault();

        // Forward the scroll to the active container
        scrollableContainer.scrollBy({
          top: event.deltaY,
          left: event.deltaX,
          behavior: "auto",
        });
      }
    }

    // Add the event listener with passive: false to allow preventDefault
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
  // Look for scrollable containers with data attributes
  const scrollableContainers = mainContent.querySelectorAll(
    "[data-scrollable]",
  ) as NodeListOf<HTMLElement>;

  // Find the container that contains the mouse Y position
  for (let i = 0; i < scrollableContainers.length; i++) {
    const container = scrollableContainers[i];
    const rect = container.getBoundingClientRect();
    if (mouseY >= rect.top && mouseY <= rect.bottom) {
      // Check if this container is actually scrollable
      if (container.scrollHeight > container.clientHeight) {
        return container;
      }
    }
  }

  // Fallback: find any scrollable element in the main content
  const allScrollable = mainContent.querySelectorAll(
    '[class*="overflow-y-auto"], [class*="overflow-auto"]',
  ) as NodeListOf<HTMLElement>;

  for (let i = 0; i < allScrollable.length; i++) {
    const container = allScrollable[i];
    const rect = container.getBoundingClientRect();
    if (
      mouseY >= rect.top &&
      mouseY <= rect.bottom &&
      container.scrollHeight > container.clientHeight
    ) {
      return container;
    }
  }

  return null;
}
