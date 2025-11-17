import { Client } from "@notionhq/client";

// Initialize Notion client singleton
export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
