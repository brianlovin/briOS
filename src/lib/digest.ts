import { HackerNewsPost } from "@/types/hackernews";

/** Fields the HN digest email template actually renders. */
export type DigestPost = Pick<HackerNewsPost, "id" | "title" | "url" | "domain" | "comments_count">;

/**
 * Project a list (or detail) HN post to the digest email shape.
 * Does not read `comments` — list posts omit that key after S03-2.
 */
export function toDigestPost(post: Pick<HackerNewsPost, keyof DigestPost>): DigestPost {
  return {
    id: post.id,
    title: post.title,
    url: post.url,
    domain: post.domain,
    comments_count: post.comments_count,
  };
}

export function toDigestPosts(posts: Pick<HackerNewsPost, keyof DigestPost>[]): DigestPost[] {
  return posts.map(toDigestPost);
}
