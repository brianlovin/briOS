/**
 * Type definitions for Hacker News API data structures
 * Based on HNPWA API (https://api.hnpwa.com/v0)
 */

export type HackerNewsPostType = "link" | "comment" | "job" | "poll" | "story";

export interface HackerNewsComment {
  id: number | string;
  user: string | null;
  content: string | null;
  level: number;
  comments: HackerNewsComment[];
  comments_count?: number | null;
  time?: number | null;
  time_ago?: string | null;
  dead?: boolean;
  deleted?: boolean;
}

export interface HackerNewsPost {
  id: number;
  title: string;
  points: number | null;
  user: string | null;
  time: number;
  time_ago: string;
  type: HackerNewsPostType;
  content: string | null;
  url: string;
  domain: string | null;
  comments: HackerNewsComment[];
  comments_count: number;
}
