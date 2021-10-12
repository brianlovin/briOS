import Query from '~/graphql/resolvers/queries'
import Mutation from '~/graphql/resolvers/mutations'
import { UserRole } from '~/graphql/types.generated'
import { getCommentAuthor } from '~/graphql/resolvers/queries/comment'
import {
  getQuestionAuthor,
  getQuestionComments,
} from '~/graphql/resolvers/queries/ama'
import { Context } from '~/graphql/context'

export default {
  Query,
  Mutation,
  Comment: {
    author: getCommentAuthor,
    viewerCanEdit: ({ userId }, _, { viewer }: Context) => {
      return userId === viewer?.id
    },
    viewerCanDelete: ({ userId }, _, { viewer }: Context) => {
      return userId === viewer?.id || viewer?.role === UserRole.Admin
    },
    createdAt: ({ createdAt }) =>
      new Date(createdAt).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
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
  User: {
    isViewer: ({ id }, _, { viewer }: Context) => {
      return viewer && viewer.id === id
    },
  },
}
