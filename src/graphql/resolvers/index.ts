import { getBookmarks } from '~/graphql/resolvers/bookmarks'
import { getPosts, getPost } from '~/graphql/resolvers/overthought'
import { getEpisodes } from '~/graphql/resolvers/podcast'
import { getRepos } from '~/graphql/resolvers/repos'
import { isMe } from '~/graphql/resolvers/isMe'
import { login, logout } from '~/graphql/resolvers/mutations/auth'
import {
  addBookmark,
  editBookmark,
  deleteBookmark,
} from '~/graphql/resolvers/mutations/bookmarks'
import { requiresMe } from '~/graphql/authorization'

export default {
  Query: {
    bookmarks: getBookmarks,
    episodes: getEpisodes,
    posts: getPosts,
    post: getPost,
    repos: getRepos,
    isMe: isMe,
  },
  Mutation: {
    login: login,
    logout: logout,
    addBookmark: requiresMe(addBookmark),
    editBookmark: requiresMe(editBookmark),
    deleteBookmark: requiresMe(deleteBookmark),
  },
}
