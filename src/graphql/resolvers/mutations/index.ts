import { login, logout } from '~/graphql/resolvers/mutations/auth'
import {
  addBookmark,
  editBookmark,
  deleteBookmark,
  addBookmarkReaction,
} from '~/graphql/resolvers/mutations/bookmarks'
import { requiresMe } from '~/graphql/helpers/requiresMe'
import {
  addAMAQuestion,
  editAMAQuestion,
  deleteAMAQuestion,
  addAMAReaction,
} from '~/graphql/resolvers/mutations/ama'

export default {
  login,
  logout,
  addBookmark: requiresMe(addBookmark),
  editBookmark: requiresMe(editBookmark),
  deleteBookmark: requiresMe(deleteBookmark),
  addBookmarkReaction,
  addAMAQuestion,
  editAMAQuestion: requiresMe(editAMAQuestion),
  deleteAMAQuestion: requiresMe(deleteAMAQuestion),
  addAMAReaction,
}
