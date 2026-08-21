import { describe, expect, test } from "bun:test";

import nextConfig from "../../next.config";
import { redirectDestination } from "./redirects";

async function configuredRedirects() {
  if (typeof nextConfig.redirects !== "function") {
    throw new Error("next.config is missing redirects()");
  }
  return nextConfig.redirects();
}

describe("overthought redirects", () => {
  test("/overthought permanently redirects to /writing", async () => {
    expect(redirectDestination("/overthought")).toBe("/writing");

    const match = (await configuredRedirects()).find(
      (redirect) => redirect.source === "/overthought",
    );
    expect(match?.destination).toBe("/writing");
    expect(match?.permanent).toBe(true);
  });

  test("a nested /overthought/slug permanently redirects to /writing", async () => {
    expect(redirectDestination("/overthought/investing-for-designers-and-developers")).toBe(
      "/writing",
    );

    const match = (await configuredRedirects()).find(
      (redirect) => redirect.source === "/overthought/:path*",
    );
    expect(match?.destination).toBe("/writing");
    expect(match?.permanent).toBe(true);
  });
});
