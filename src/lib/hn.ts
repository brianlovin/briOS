import { externalFetcher } from "@/lib/fetcher";
import { HackerNewsComment, HackerNewsPost } from "@/types/hackernews";

const BASE_URL = "https://brianlovin.com";
const TOP_BASE_URL = "https://hacker-news.firebaseio.com/v0";
const ITEM_BASE_URL = "https://api.hnpwa.com/v0";

// Conditional logging helper - only logs in development
const log = (...args: unknown[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};

const logError = (...args: unknown[]) => {
  if (process.env.NODE_ENV === "development") {
    console.error(...args);
  }
};

export async function getPostIds(): Promise<number[]> {
  const ids = await externalFetcher<number[]>(`${TOP_BASE_URL}/topstories.json`);
  log(`[HN] Fetched ${ids.length} top story IDs`);
  return ids;
}

export async function getPostById(
  id: string,
  includeComments = false,
): Promise<HackerNewsPost | null> {
  async function getPost(): Promise<HackerNewsPost | null> {
    try {
      const post = await externalFetcher<HackerNewsPost>(`${ITEM_BASE_URL}/item/${id}.json`);
      log(`[HN] Fetched post ${id}:`, {
        title: post.title,
        type: post.type,
        points: post.points,
        commentsCount: post.comments_count,
      });
      return post;
    } catch (error) {
      logError(`[HN] Failed to fetch post ${id}:`, error);
      return null;
    }
  }

  const data = await getPost();

  if (!data) return null;

  function trimComments(comment: HackerNewsComment): HackerNewsComment | null {
    if (!comment) return null;

    if (comment.level > 3) {
      log(`[HN] Trimming comment at level ${comment.level}`);
      return null;
    }

    return {
      ...comment,
      comments: comment.comments
        .slice(0, 8)
        .map(trimComments)
        .filter(Boolean) as HackerNewsComment[],
    };
  }

  const shortComments = data.comments
    .slice(0, 12)
    .map(trimComments)
    .filter(Boolean) as HackerNewsComment[];

  log(
    `[HN] Trimmed comments from ${data.comments.length} to ${shortComments.length} root comments`,
  );

  const cleanUrl = data.domain ? `${data.url}` : `${BASE_URL}/hn/${data.id}`;

  const post: HackerNewsPost = {
    ...data,
    url: cleanUrl,
    comments: includeComments ? shortComments : [],
  };

  return post;
}

export async function getHNPosts(): Promise<(HackerNewsPost | null)[]> {
  const topPostIds = await getPostIds();
  log(`[HN] Fetching top 24 posts from ${topPostIds.length} story IDs`);

  const postPromises = topPostIds
    .slice(0, 24)
    .map(async (id: number) => await getPostById(id.toString(), false));

  const posts = await Promise.all([...postPromises]);

  const validPosts = posts.filter(Boolean);
  log(`[HN] Successfully fetched ${validPosts.length} out of 24 posts`);

  return posts;
}

export async function getRankedHNPosts(): Promise<HackerNewsPost[]> {
  const topPostIds = await getPostIds();
  log(`[HN Filtered] Starting with ${topPostIds.length} total story IDs`);

  // Fetch 200 most recent posts
  const filtered = topPostIds.sort((a: number, b: number) => b - a).slice(0, 200);
  log(`[HN Filtered] Filtered to top 200 most recent IDs`);

  const postPromises = filtered.map(async (id: number) => await getPostById(id.toString(), false));
  const posts = await Promise.all([...postPromises]);

  const now = new Date().getTime() / 1000;
  const oneDayAgo = now - 60 * 60 * 24;

  // Filter out null posts
  const validPosts = posts.filter((post): post is HackerNewsPost => post !== null);
  log(`[HN Filtered] ${validPosts.length} valid posts fetched`);

  // Only show links (exclude jobs, polls)
  const links = validPosts.filter((post) => post.type === "link");
  log(`[HN Filtered] ${links.length} posts are links (filtered out jobs/polls)`);

  // Only show posts from last 24 hours
  const withinLastDay = links.filter((post) => post.time > oneDayAgo);
  log(`[HN Filtered] ${withinLastDay.length} posts within last 24 hours`);

  // Filter by minimum engagement (50+ points OR 20+ comments)
  const highEngagement = withinLastDay.filter(
    (post) => (post.points || 0) >= 50 || post.comments_count >= 20,
  );
  log(`[HN Filtered] ${highEngagement.length} posts with high engagement`);

  // Sort by weighted score: points + (comments * 0.75) + recency bonus
  const sorted = highEngagement.sort((a, b) => {
    const hoursOldA = (now - a.time) / 3600;
    const hoursOldB = (now - b.time) / 3600;

    // Recency bonus: newer posts get higher scores (decays from 100 to 0 over 24 hours)
    const recencyBonusA = Math.max(0, 100 * (1 - hoursOldA / 24));
    const recencyBonusB = Math.max(0, 100 * (1 - hoursOldB / 24));

    const scoreA = (a.points || 0) + a.comments_count * 0.75 + recencyBonusA;
    const scoreB = (b.points || 0) + b.comments_count * 0.75 + recencyBonusB;

    return scoreB - scoreA;
  });

  const top24 = sorted.slice(0, 24);

  log(`[HN Filtered] Returning top ${top24.length} posts by weighted score`);

  return top24;
}

export async function getHNPostsForDigest(): Promise<HackerNewsPost[]> {
  const topPostIds = await getPostIds();
  log(`[HN Digest] Starting with ${topPostIds.length} total story IDs`);

  // topPostIds returns 500 by default. this can block the API route from
  // responding for a long time while each one is fetched individually.
  // it's much more likely that the most recent 200 (by decrementing id) are
  // the top posts within the last 24 hours
  const filtered = topPostIds.sort((a: number, b: number) => b - a).slice(0, 200);
  log(`[HN Digest] Filtered to top 200 most recent IDs`);

  const postPromises = filtered.map(async (id: number) => await getPostById(id.toString(), false));
  const posts = await Promise.all([...postPromises]);

  const now = new Date().getTime() / 1000;
  const dayAgo = now - 60 * 60 * 24;

  // don't return jobs or polls
  const validPosts = posts.filter((post): post is HackerNewsPost => post !== null);
  log(`[HN Digest] ${validPosts.length} valid posts fetched`);

  const links = validPosts.filter((post) => post.type === "link");
  log(`[HN Digest] ${links.length} posts are links (filtered out jobs/polls)`);

  const withinLastDay = links.filter((post) => post.time > dayAgo);
  log(`[HN Digest] ${withinLastDay.length} posts within last 24 hours`);

  const sorted = withinLastDay.sort((a, b) => (b.points || 0) - (a.points || 0));
  const top16 = sorted.slice(0, 16);

  log(`[HN Digest] Returning top ${top16.length} posts by points`);

  return top16;
}
