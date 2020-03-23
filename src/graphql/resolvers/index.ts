import { getBookmarks } from '~/graphql/bookmarks'
import { getPosts, getPost } from '~/graphql/overthought'
import { getEpisodes } from '~/graphql/podcast'

export default {
  Query: {
    bookmarks: getBookmarks,
    episodes: getEpisodes,
    posts: getPosts,
    post: getPost,
  },
}
