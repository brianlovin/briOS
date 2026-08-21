import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { SectionHeading } from "@/components/shared/ListComponents";

import { HomeHero } from "./HomeHero";
import { ProjectsList } from "./ProjectsList";

describe("homepage content without JavaScript", () => {
  test("hero uses the person name as an h1 and includes bio copy", () => {
    const html = renderToStaticMarkup(<HomeHero />);
    expect(html).toContain("<h1");
    expect(html).toContain("Brian Lovin");
    expect(html).toContain("San Francisco");
    expect(html).toContain("Campsite");
  });

  test("section titles are headings and project copy is in the HTML", () => {
    const heading = renderToStaticMarkup(<SectionHeading>Writing</SectionHeading>);
    const projects = renderToStaticMarkup(<ProjectsList />);
    const text = (heading + projects).replace(/<[^>]+>/g, " ");

    expect(heading).toContain("<h2");
    expect(heading).toContain("Writing");
    expect(projects).toContain("Stack");
    expect(projects).toContain('href="/stack"');
    expect(text.length).toBeGreaterThan(500);
  });
});
