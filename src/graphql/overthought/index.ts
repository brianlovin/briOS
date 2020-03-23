import GhostContentAPI from "@tryghost/content-api";

const api = new GhostContentAPI({
  url: 'https://overthought.ghost.io',
  key: process.env.GHOST_API_KEY,
  version: "v3"
});

export async function getPosts(_, { first = "all" }) {
  return await api.posts
    .browse({ limit: first, order: "updated_at DESC" })
    .catch(err => []);
}

export async function getPost(_, { slug }) {
  return await api.posts
    .read({ slug })
    .catch(err => null);
}