import { getBookmarks } from '~/graphql/resolvers/bookmarks'
import { getPosts, getPost } from '~/graphql/resolvers/overthought'
import { getEpisodes } from '~/graphql/resolvers/podcast'
import { getRepos } from '~/graphql/resolvers/repos'

export default {
  Query: {
    bookmarks: getBookmarks,
    episodes: getEpisodes,
    posts: getPosts,
    post: getPost,
    repos: getRepos,
  },
}
