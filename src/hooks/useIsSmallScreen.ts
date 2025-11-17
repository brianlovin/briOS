import { useEffect, useState } from "react";

export function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handler = () => setIsSmall(mediaQuery.matches);
    handler();
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isSmall;
}
