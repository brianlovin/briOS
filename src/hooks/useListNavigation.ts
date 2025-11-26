import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";

export function useListNavigation<T extends { id: string | number }>(
  items: T[],
  currentIndex: number,
  getHref: (item: T) => string,
) {
  const router = useRouter();

  useHotkeys(
    "j",
    (e) => {
      if (e.repeat) return;
      if (currentIndex < items.length - 1) {
        const nextItem = items[currentIndex + 1];
        router.push(getHref(nextItem));
        scrollToItem(String(nextItem.id));
      }
    },
    [currentIndex, items, router],
  );

  useHotkeys(
    "k",
    (e) => {
      if (e.repeat) return;
      if (currentIndex > 0) {
        const prevItem = items[currentIndex - 1];
        router.push(getHref(prevItem));
        scrollToItem(String(prevItem.id));
      }
    },
    [currentIndex, items, router],
  );
}

function scrollToItem(id: string) {
  requestAnimationFrame(() => {
    const el = document.querySelector(`[data-id="${id}"]`);
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  });
}
