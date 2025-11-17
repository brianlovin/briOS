import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";

export function useListNavigation<T>(
  items: T[],
  currentIndex: number,
  getHref: (item: T) => string,
) {
  const router = useRouter();

  useHotkeys(
    "j",
    () => {
      if (currentIndex < items.length - 1) {
        router.push(getHref(items[currentIndex + 1]));
      }
    },
    [currentIndex, items, router],
  );

  useHotkeys(
    "k",
    () => {
      if (currentIndex > 0) {
        router.push(getHref(items[currentIndex - 1]));
      }
    },
    [currentIndex, items, router],
  );
}
