"use client";

import { Dithering } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";
import { memo } from "react";

export const PlaceholderShader = memo(function PlaceholderShader() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Dithering
      speed={0.17}
      shape="warp"
      type="4x4"
      size={3.4}
      scale={1.98}
      colorBack="#00000000"
      colorFront={isDark ? "#1F1F1F" : "#eeeeee"}
      className="absolute inset-0"
      style={{ backgroundColor: isDark ? "#000000" : "#f6f7f8", width: "100%", height: "100%" }}
    />
  );
});
