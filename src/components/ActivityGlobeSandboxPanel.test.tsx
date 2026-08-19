import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { ActivityGlobeSandboxPanel } from "@/components/ActivityGlobeSandboxPanel";
import { DEFAULT_ACTIVITY_GLOBE_CONFIG } from "@/lib/activity-globe-config";

describe("ActivityGlobeSandboxPanel", () => {
  test("renders DialKit-style sliders instead of native range inputs", () => {
    const markup = renderToStaticMarkup(
      <ActivityGlobeSandboxPanel config={DEFAULT_ACTIVITY_GLOBE_CONFIG} onChange={() => {}} />,
    );

    expect(markup).toContain("Diffuse");
    expect(markup).toContain('role="slider"');
    expect(markup).toContain("0.60");
    expect(markup).not.toContain('type="range"');
  });
});
