import { getTopPostIds, getPostById } from '~/graphql/services/hn'

export async function getTopHNPosts(_, { first = 16, sort = 'top' }) {
  const ids = await getTopPostIds(sort)
  const truncated = ids.slice(0, first)
  const postPromises = truncated.map(async (id) => await getPostById(id))
  const posts = await Promise.all([...postPromises])
  return posts
}

export async function getHNPost(_, { id }) {
  return await getPostById(id)
}
