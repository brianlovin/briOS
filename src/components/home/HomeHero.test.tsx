import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { SectionHeading } from "@/components/shared/ListComponents";

import { HomeHero } from "./HomeHero";
import { ProjectsList } from "./ProjectsList";

describe("homepage content", () => {
  test("hero uses the person name as an h1", () => {
    const html = renderToStaticMarkup(<HomeHero />);
    expect(html).toContain("<h1");
    expect(html).toContain("Brian Lovin");
  });

  test("section titles are headings and projects keep their hrefs", () => {
    const heading = renderToStaticMarkup(<SectionHeading>Writing</SectionHeading>);
    const projects = renderToStaticMarkup(<ProjectsList />);

    expect(heading).toContain("<h2");
    expect(heading).toContain("Writing");
    expect(projects).toContain('href="/stack"');
    expect(projects).toContain('href="/computer"');
    expect(projects).toContain("How to Computer Better");
    expect(projects).not.toContain("notion.site/how-to-computer-better");
  });
});
