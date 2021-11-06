import { requiresAdmin } from '~/graphql/helpers/requiresAdmin'
import { requiresUser } from '~/graphql/helpers/requiresUser'
import {
  addBookmark,
  deleteBookmark,
  editBookmark,
} from '~/graphql/resolvers/mutations/bookmarks'
import {
  addComment,
  deleteComment,
  editComment,
} from '~/graphql/resolvers/mutations/comment'
import { editEmailSubscription } from '~/graphql/resolvers/mutations/emailSubscription'
import {
  addPost,
  deletePost,
  editPost,
} from '~/graphql/resolvers/mutations/post'
import {
  addQuestion,
  deleteQuestion,
  editQuestion,
} from '~/graphql/resolvers/mutations/questions'
import { toggleReaction } from '~/graphql/resolvers/mutations/reactions'
import {
  addStack,
  deleteStack,
  editStack,
  toggleStackUser,
} from '~/graphql/resolvers/mutations/stack'
import { deleteUser, editUser } from '~/graphql/resolvers/mutations/user'

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
  addPost: requiresAdmin(addPost),
  editPost: requiresAdmin(editPost),
  deletePost: requiresAdmin(deletePost),
  toggleReaction: requiresUser(toggleReaction),
}
