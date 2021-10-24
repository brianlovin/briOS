import { IS_PROD } from '~/graphql/constants'
import { useLocalFiles } from '~/graphql/helpers/useLocalFiles'
import { ghost } from '~/lib/ghost'

export async function getPosts(_, args) {
  const { first = 'all', filter = null, order = 'published_at DESC' } = args

  async function getPosts() {
    return await ghost.posts
      .browse({ limit: first, order, filter })
      .catch(() => [])
  }

  if (IS_PROD) {
    return await getPosts()
  } else {
    return useLocalFiles({
      path: `${first}${filter}${order}Posts`,
      fetch: getPosts,
    })
  }
}

export async function getPost(_, { slug }) {
  async function getPost() {
    return await ghost.posts.read({ slug }).catch(() => null)
  }

  if (IS_PROD) {
    return await getPost()
  } else {
    return useLocalFiles({ path: slug, fetch: getPost })
  }
}
