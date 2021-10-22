import { requiresAdmin } from '~/graphql/helpers/requiresAdmin'
import { requiresUser } from '~/graphql/helpers/requiresUser'
import {
  addBookmark,
  editBookmark,
  deleteBookmark,
  addBookmarkReaction,
} from '~/graphql/resolvers/mutations/bookmarks'
import {
  addStack,
  editStack,
  deleteStack,
  toggleStackUser,
} from '~/graphql/resolvers/mutations/stack'
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
import { deleteUser, editUser } from '~/graphql/resolvers/mutations/user'
import { editEmailSubscription } from './emailSubscription'

export default {
  addBookmark: requiresAdmin(addBookmark),
  editBookmark: requiresAdmin(editBookmark),
  deleteBookmark: requiresAdmin(deleteBookmark),
  addStack: requiresAdmin(addStack),
  editStack: requiresAdmin(editStack),
  deleteStack: requiresAdmin(deleteStack),
  toggleStackUser: requiresUser(toggleStackUser),
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
  editUser: requiresUser(editUser),
  editEmailSubscription: editEmailSubscription,
}
