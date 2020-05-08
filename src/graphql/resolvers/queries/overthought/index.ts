import { ghost } from '~/graphql/services/ghost'

export async function getPosts(_, { first = 'all' }) {
  return await ghost.posts
    .browse({ limit: first, order: 'updated_at DESC' })
    .catch(() => [])
}

export async function getPost(_, { slug }) {
  return await ghost.posts.read({ slug }).catch(() => null)
}
