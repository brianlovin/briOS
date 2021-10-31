import { GetHackerNewsPostQueryVariables } from '~/graphql/types.generated'
import { getHNPosts, getPostById } from '~/lib/hn'

export async function getHackerNewsPosts() {
  return await getHNPosts('top')
}

export async function getHackerNewsPost(
  _,
  args: GetHackerNewsPostQueryVariables
) {
  const { id } = args
  return await getPostById(id, true)
}
