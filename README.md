This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Stack data via Notion

Stack items are stored in a dedicated Notion database. Each page in the database uses the following properties:

- **Name** – title
- **Slug** – rich text
- **Description** – rich text
- **Image** – URL
- **URL** – URL

Set `NOTION_TOKEN` and `NOTION_STACK_DATABASE_ID` in your environment to connect.

To migrate the existing JSON stack data to Notion run:

```bash
bun tsx scripts/backfillStacksToNotion.ts
```

Stack lists are fetched from `/api/stacks` which caches the response for 24 hours using Next.js route handlers.

## Podcast migration

Mirror episodes from Simplecast to an S3 bucket:

```bash
bun tsx scripts/migrateSimplecast.ts
```

Set `SIMPLECAST_API_TOKEN`, `SIMPLECAST_PODCAST_ID`, and `S3_BUCKET` in your environment before running the script.

## AMA via Notion

AMA questions live in a separate Notion database. Pages use these properties:

- **Name** – title of the question
- **Status** – select (`Answered` or `Unanswered`)

Set `NOTION_AMA_DATABASE_ID` alongside `NOTION_TOKEN` in your environment.

To import the historical JSON questions run:

```bash
bun tsx scripts/backfillAmaToNotion.ts
```
