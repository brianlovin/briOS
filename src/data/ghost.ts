import GhostContentAPI from "@tryghost/content-api";

// Create API instance with site credentials
const api = new GhostContentAPI({
  url: 'https://overthought.ghost.io',
  key: 'a731438732f44c2cdf30dd4955',
  version: "v3"
});

export async function getPosts() {
  return await api.posts
    .browse({
      limit: "all"
    })
    .catch(err => {
      console.error(err);
    });
}

function isFeatured(post) {
  return post.featured
}

export async function getFeaturedPosts() {
  return await getPosts()
    .then(posts => posts.filter(isFeatured))
}

export async function getPostBySlug(slug) {
  return await api.posts
    .read({
      slug
    })
    .catch(err => {
      console.error(err);
    });
}