import { requiresAdmin } from '~/graphql/helpers/requiresAdmin'
import { requiresUser } from '~/graphql/helpers/requiresUser'
import {
  addBookmark,
  editBookmark,
  deleteBookmark,
  addBookmarkReaction,
} from '~/graphql/resolvers/mutations/bookmarks'
import {
  addAMAQuestion,
  editAMAQuestion,
  deleteAMAQuestion,
  addAMAReaction,
  addAMAAudioPlay,
  transcribeAudio,
} from '~/graphql/resolvers/mutations/ama'
import {
  addComment,
  editComment,
  deleteComment,
} from '~/graphql/resolvers/mutations/comment'
import { deleteUser } from '~/graphql/resolvers/mutations/user'

export default {
  addBookmark: requiresAdmin(addBookmark),
  editBookmark: requiresAdmin(editBookmark),
  deleteBookmark: requiresAdmin(deleteBookmark),
  addBookmarkReaction,
  addAMAQuestion: requiresUser(addAMAQuestion),
  editAMAQuestion: requiresAdmin(editAMAQuestion),
  deleteAMAQuestion: requiresAdmin(deleteAMAQuestion),
  addAMAReaction,
  addAMAAudioPlay,
  transcribeAudio: requiresAdmin(transcribeAudio),
  addComment: requiresUser(addComment),
  editComment: requiresUser(editComment),
  deleteComment: requiresUser(deleteComment),
  deleteUser: requiresUser(deleteUser),
}
