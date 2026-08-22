import { describe, expect, test } from "bun:test";

import {
  appendVaryAccept,
  isMarkdownNegotiablePath,
  isNextInternalRequest,
  markdownRewritePath,
  parseAccept,
  preferredType,
} from "@/lib/accept-markdown";

describe("parseAccept", () => {
  test("reads q-values and specificity", () => {
    const entries = parseAccept("text/html;q=0.8, text/markdown, */*;q=0.1");
    expect(entries[0]).toEqual({ type: "text/html", q: 0.8, specificity: 2 });
    expect(entries[1]).toEqual({ type: "text/markdown", q: 1, specificity: 2 });
    expect(entries[2]).toEqual({ type: "*/*", q: 0.1, specificity: 0 });
  });
});

describe("preferredType", () => {
  test("defaults to HTML when Accept is missing", () => {
    expect(preferredType(null)).toBe("text/html");
    expect(preferredType("")).toBe("text/html");
  });

  test("selects text/markdown when it is preferred", () => {
    expect(preferredType("text/markdown")).toBe("text/markdown");
    expect(preferredType("text/markdown, text/html")).toBe("text/markdown");
    expect(preferredType("text/markdown;q=0.9, text/html;q=0.8")).toBe("text/markdown");
  });

  test("selects HTML for typical browser Accept", () => {
    expect(preferredType("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")).toBe(
      "text/html",
    );
  });

  test("honors q=0 rejection even when a wildcard would match", () => {
    expect(preferredType("text/html;q=0, */*;q=1")).toBe("text/markdown");
    expect(preferredType("text/html;q=0, text/markdown;q=0, */*;q=1")).toBe(null);
  });

  test("returns null for exclusive unsupported types", () => {
    expect(preferredType("application/pdf")).toBe(null);
    expect(preferredType("application/pdf, application/xml")).toBe(null);
  });

  test("does not substring-match markdown out of unrelated types", () => {
    expect(preferredType("application/vnd.markdown+json")).toBe(null);
  });
});

describe("appendVaryAccept", () => {
  test("sets Vary when missing and appends when other tokens exist", () => {
    const empty = new Headers();
    appendVaryAccept(empty);
    expect(empty.get("Vary")).toBe("Accept");

    const existing = new Headers({ Vary: "RSC, Next-Router-Prefetch" });
    appendVaryAccept(existing);
    expect(existing.get("Vary")).toBe("RSC, Next-Router-Prefetch, Accept");

    appendVaryAccept(existing);
    expect(existing.get("Vary")).toBe("RSC, Next-Router-Prefetch, Accept");
  });
});

describe("isNextInternalRequest", () => {
  test("treats RSC and router prefetch as internal", () => {
    expect(isNextInternalRequest(new Headers({ RSC: "1" }))).toBe(true);
    expect(isNextInternalRequest(new Headers({ "Next-Router-Prefetch": "1" }))).toBe(true);
    expect(isNextInternalRequest(new Headers({ Accept: "text/x-component" }))).toBe(true);
    expect(isNextInternalRequest(new Headers({ Accept: "text/markdown" }))).toBe(false);
  });
});

describe("isMarkdownNegotiablePath", () => {
  test("allows public pages and sibling .md URLs", () => {
    expect(isMarkdownNegotiablePath("/")).toBe(true);
    expect(isMarkdownNegotiablePath("/writing/hello-abc1234")).toBe(true);
    expect(isMarkdownNegotiablePath("/about.md")).toBe(true);
  });

  test("skips APIs, internals, feeds, and assets", () => {
    expect(isMarkdownNegotiablePath("/api/writing")).toBe(false);
    expect(isMarkdownNegotiablePath("/_next/static/chunk.js")).toBe(false);
    expect(isMarkdownNegotiablePath("/writing/rss.xml")).toBe(false);
    expect(isMarkdownNegotiablePath("/img/og.png")).toBe(false);
    expect(isMarkdownNegotiablePath("/llms.txt")).toBe(false);
    expect(isMarkdownNegotiablePath("/sitemap.xml")).toBe(false);
  });
});

describe("markdownRewritePath", () => {
  test("maps the canonical path and .md sibling onto the markdown handler", () => {
    expect(markdownRewritePath("/")).toBe("/api/markdown");
    expect(markdownRewritePath("/writing")).toBe("/api/markdown/writing");
    expect(markdownRewritePath("/writing/hello.md")).toBe("/api/markdown/writing/hello");
  });
});
