import { requiresAdmin } from '~/graphql/helpers/requiresAdmin'
import { requiresUser } from '~/graphql/helpers/requiresUser'
import {
  addBookmark,
  editBookmark,
  deleteBookmark,
} from '~/graphql/resolvers/mutations/bookmarks'
import {
  addStack,
  editStack,
  deleteStack,
  toggleStackUser,
} from '~/graphql/resolvers/mutations/stack'
import {
  addQuestion,
  editQuestion,
  deleteQuestion,
} from '~/graphql/resolvers/mutations/questions'
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
  addQuestion: requiresUser(addQuestion),
  editQuestion: requiresUser(editQuestion),
  deleteQuestion: requiresUser(deleteQuestion),
  addComment: requiresUser(addComment),
  editComment: requiresUser(editComment),
  deleteComment: requiresUser(deleteComment),
  deleteUser: requiresUser(deleteUser),
  editUser: requiresUser(editUser),
  editEmailSubscription: editEmailSubscription,
}
