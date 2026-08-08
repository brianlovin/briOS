import Image from "next/image";

import { Section } from "@/components/shared/ListComponents";

export function HomeHero() {
  return (
    <Section>
      <Image
        src="/img/avatar.jpg"
        alt="Brian Lovin"
        width={60}
        height={60}
        draggable={false}
        className="mb-8 rounded-full select-none"
      />

      <h1 id="home-title" className="text-2xl font-semibold">
        Brian Lovin
      </h1>

      <p className="text-secondary text-2xl font-semibold text-pretty">
        I&apos;m a software designer living in San Francisco, currently making AI products at
        Notion.
      </p>
    </Section>
  );
}
