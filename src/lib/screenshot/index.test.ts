import { describe, expect, mock, test } from "bun:test";

import { capturePageScreenshot, colorSchemeMediaFeatures } from "@/lib/screenshot";

describe("colorSchemeMediaFeatures", () => {
  test("requests prefers-color-scheme dark", () => {
    expect(colorSchemeMediaFeatures("dark")).toEqual([
      { name: "prefers-color-scheme", value: "dark" },
    ]);
  });

  test("requests prefers-color-scheme light", () => {
    expect(colorSchemeMediaFeatures("light")).toEqual([
      { name: "prefers-color-scheme", value: "light" },
    ]);
  });
});

describe("capturePageScreenshot", () => {
  test("emulates dark before navigating", async () => {
    const order: string[] = [];
    const emulateMediaFeatures = mock(async () => {
      order.push("emulate");
    });
    const goto = mock(async () => {
      order.push("goto");
    });
    const screenshot = mock(async () => Buffer.from("png"));

    await capturePageScreenshot({ emulateMediaFeatures, goto, screenshot }, "https://example.com", {
      colorScheme: "dark",
      settleDelayMs: 0,
    });

    expect(emulateMediaFeatures).toHaveBeenCalledWith([
      { name: "prefers-color-scheme", value: "dark" },
    ]);
    expect(goto).toHaveBeenCalledWith(
      "https://example.com",
      expect.objectContaining({ waitUntil: "networkidle2" }),
    );
    expect(order).toEqual(["emulate", "goto"]);
  });
});
