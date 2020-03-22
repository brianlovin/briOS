import GhostContentAPI from "@tryghost/content-api";

// Create API instance with site credentials
const api = new GhostContentAPI({
  url: 'https://overthought.ghost.io',
  key: process.env.GHOST_API_KEY,
  version: "v3"
});

export async function getPosts() {
  return await api.posts
    .browse({ limit: "all", order: "updated_at DESC" })
    .catch(err => {
      console.error(err);
    });
}

export async function getFeaturedPosts() {
  return await getPosts()
}

export async function getPostBySlug(slug) {
  return await api.posts
    .read({
      slug
    })
    .catch(err => {
      console.error('Error getting post by slug: ', slug);
    });
}