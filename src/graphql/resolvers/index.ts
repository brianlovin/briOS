import Query from '~/graphql/resolvers/queries'
import Mutation from '~/graphql/resolvers/mutations'
import { UserRole } from '~/graphql/types.generated'
import {
  getCommentAuthor,
  getBookmarkComments,
} from '~/graphql/resolvers/queries/comment'
import {
  getQuestionAuthor,
  getQuestionComments,
} from '~/graphql/resolvers/queries/ama'

export default {
  Query,
  Mutation,
  Comment: {
    author: getCommentAuthor,
    viewerCanEdit: ({ userId }, _, { viewer }) => {
      return userId === viewer?.id
    },
    viewerCanDelete: ({ userId }, _, { viewer }) => {
      return userId === viewer?.id || viewer?.role === UserRole.Admin
    },
    createdAt: ({ createdAt }) =>
      new Date(createdAt).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
  },
  Bookmark: {
    comments: getBookmarkComments,
  },
  AMA: {
    author: getQuestionAuthor,
    comments: getQuestionComments,
    updatedAt: ({ updatedAt }) =>
      new Date(updatedAt).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
  },
}
