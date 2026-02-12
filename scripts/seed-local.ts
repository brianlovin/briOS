/**
 * Seed script: Minimal local data for dev (no Notion required)
 *
 * Usage:
 *   DATABASE_URL="postgresql://brios:brios@localhost:5432/brios" bun scripts/seed-local.ts
 */
import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { amaQuestions } from "@/db/schema/ama";
import { appDissectionDetails, appDissections } from "@/db/schema/app-dissection";
import { designDetailsEpisodes } from "@/db/schema/design-details";
import { goodWebsites } from "@/db/schema/good-websites";
import { listeningHistory } from "@/db/schema/listening";
import { speakingEvents } from "@/db/schema/speaking";
import { stackItems } from "@/db/schema/stack";
import { tilEntries } from "@/db/schema/til";
import { writingPosts } from "@/db/schema/writing";

const NOW = new Date();

function daysAgo(days: number) {
  return new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000);
}

function makeShortId(prefix: string, n: number) {
  return `${prefix}${n.toString().padStart(6, "0")}`.slice(0, 7);
}

async function seedWriting() {
  const rows = Array.from({ length: 10 }).map((_, index) => {
    const n = index + 1;
    return {
      title: `Seed Writing Post ${n}`,
      slug: `seed-writing-post-${n}`,
      shortId: makeShortId("W", n),
      excerpt: `Short excerpt for seed writing post ${n}.`,
      content: `# Seed Writing Post ${n}\n\nThis is a local seed post for testing.\n\n- Item 1\n- Item 2`,
      featureImage: null,
      publishedAt: daysAgo(n),
      notionId: `seed-writing-${n}`,
    };
  });

  await db.insert(writingPosts).values(rows).onConflictDoNothing();
  const count = await db.$count(writingPosts);
  console.log(`Seeded writing_posts (total now ${count})`);
}

async function seedTil() {
  const rows = Array.from({ length: 10 }).map((_, index) => {
    const n = index + 1;
    return {
      title: `Seed TIL ${n}`,
      shortId: makeShortId("T", n),
      content: `## TIL ${n}\n\nA short local seed entry for testing.\n\n\`\`\`ts\nconst til = ${n};\n\`\`\``,
      publishedAt: daysAgo(n + 1),
      notionId: `seed-til-${n}`,
    };
  });

  await db.insert(tilEntries).values(rows).onConflictDoNothing();
  const count = await db.$count(tilEntries);
  console.log(`Seeded til_entries (total now ${count})`);
}

async function seedAma() {
  const rows = Array.from({ length: 10 }).map((_, index) => {
    const n = index + 1;
    const answered = n <= 6;
    return {
      title: `Seed AMA Question ${n}`,
      description: `Why is seed question ${n} important?`,
      status: answered ? "Answered" : "Unanswered",
      answer: answered ? `This is the answer for question ${n}.` : null,
      answeredAt: answered ? daysAgo(n) : null,
      notionId: `seed-ama-${n}`,
    };
  });

  await db.insert(amaQuestions).values(rows).onConflictDoNothing();
  const count = await db.$count(amaQuestions);
  console.log(`Seeded ama_questions (total now ${count})`);
}

async function seedAppDissection() {
  for (let i = 1; i <= 10; i++) {
    const slug = `seed-app-${i}`;
    const [inserted] = await db
      .insert(appDissections)
      .values({
        name: `Seed App Dissection ${i}`,
        slug,
        icon: null,
        status: "Published",
        introContent: `# Intro ${i}\n\nSeed app dissection intro content.`,
        publishedAt: daysAgo(i + 2),
        notionId: `seed-app-dissection-${i}`,
      })
      .onConflictDoNothing()
      .returning({ id: appDissections.id });

    let appId = inserted?.id;
    if (!appId) {
      const [existing] = await db
        .select({ id: appDissections.id })
        .from(appDissections)
        .where(eq(appDissections.slug, slug))
        .limit(1);
      appId = existing?.id;
    }

    if (!appId) continue;

    const details = [
      {
        appDissectionId: appId,
        title: `Seed Detail A ${i}`,
        description: `Detail A for seed app dissection ${i}.`,
        sortOrder: 0,
      },
      {
        appDissectionId: appId,
        title: `Seed Detail B ${i}`,
        description: `Detail B for seed app dissection ${i}.`,
        sortOrder: 1,
      },
    ];

    await db.insert(appDissectionDetails).values(details).onConflictDoNothing();
  }

  const count = await db.$count(appDissections);
  console.log(`Seeded app_dissections (total now ${count})`);
}

async function seedDesignDetails() {
  const rows = Array.from({ length: 10 }).map((_, index) => {
    const n = index + 1;
    return {
      name: `Seed Design Details Episode ${n}`,
      slug: `seed-design-details-${n}`,
      description: `Description for design details episode ${n}.`,
      episodeNumber: n,
      publishedAt: daysAgo(n + 3),
      imageUrl: null,
      audioUrl: null,
      content: `# Episode ${n}\n\nLocal seed content.`,
      notionId: `seed-design-details-${n}`,
    };
  });

  await db.insert(designDetailsEpisodes).values(rows).onConflictDoNothing();
  const count = await db.$count(designDetailsEpisodes);
  console.log(`Seeded design_details_episodes (total now ${count})`);
}

async function seedGoodWebsites() {
  const rows = Array.from({ length: 10 }).map((_, index) => {
    const n = index + 1;
    return {
      name: `Seed Site ${n}`,
      url: `https://example.com/seed-site-${n}`,
      xUrl: null,
      icon: null,
      tags: ["Seed", "Example"],
      previewImage: null,
      previewImageDark: null,
      previewStatus: "Done",
      notionId: `seed-good-sites-${n}`,
    };
  });

  await db.insert(goodWebsites).values(rows).onConflictDoNothing();
  const count = await db.$count(goodWebsites);
  console.log(`Seeded good_websites (total now ${count})`);
}

async function seedListening() {
  const rows = Array.from({ length: 10 }).map((_, index) => {
    const n = index + 1;
    return {
      name: `Seed Track ${n}`,
      artist: `Seed Artist ${n}`,
      album: `Seed Album ${n}`,
      spotifyUrl: null,
      icon: null,
      playedAt: daysAgo(n),
      notionId: `seed-listening-${n}`,
    };
  });

  await db.insert(listeningHistory).values(rows).onConflictDoNothing();
  const count = await db.$count(listeningHistory);
  console.log(`Seeded listening_history (total now ${count})`);
}

async function seedSpeaking() {
  const rows = Array.from({ length: 10 }).map((_, index) => {
    const n = index + 1;
    return {
      name: `Seed Speaking Event ${n}`,
      date: daysAgo(n + 5),
      url: `https://example.com/seed-speaking-${n}`,
      notionId: `seed-speaking-${n}`,
    };
  });

  await db.insert(speakingEvents).values(rows).onConflictDoNothing();
  const count = await db.$count(speakingEvents);
  console.log(`Seeded speaking_events (total now ${count})`);
}

async function seedStack() {
  const rows = Array.from({ length: 10 }).map((_, index) => {
    const n = index + 1;
    return {
      name: `Seed Stack Item ${n}`,
      slug: `seed-stack-${n}`,
      description: `Seed stack item ${n} description.`,
      image: null,
      icon: null,
      url: `https://example.com/seed-stack-${n}`,
      platforms: ["Web"],
      status: "Active",
      previewImage: null,
      previewImageDark: null,
      previewStatus: "Done",
      notionId: `seed-stack-${n}`,
    };
  });

  await db.insert(stackItems).values(rows).onConflictDoNothing();
  const count = await db.$count(stackItems);
  console.log(`Seeded stack_items (total now ${count})`);
}

async function main() {
  console.log("Seeding local Postgres with minimal data...");

  await seedWriting();
  await seedTil();
  await seedAma();
  await seedAppDissection();
  await seedDesignDetails();
  await seedGoodWebsites();
  await seedListening();
  await seedSpeaking();
  await seedStack();

  console.log("Seeding complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
