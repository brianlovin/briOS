import { login, logout } from '~/graphql/resolvers/mutations/auth'
import {
  addBookmark,
  editBookmark,
  deleteBookmark,
  addBookmarkReaction,
} from '~/graphql/resolvers/mutations/bookmarks'
import { requiresMe } from '~/graphql/helpers/requiresMe'

export default {
  login: login,
  logout: logout,
  addBookmark: requiresMe(addBookmark),
  editBookmark: requiresMe(editBookmark),
  deleteBookmark: requiresMe(deleteBookmark),
  addBookmarkReaction: addBookmarkReaction,
}
