import Query from '~/graphql/resolvers/queries'
import Mutation from '~/graphql/resolvers/mutations'
import { UserRole, EmailSubscriptionType } from '~/graphql/types.generated'
import { getCommentAuthor } from '~/graphql/resolvers/queries/comment'
import {
  getQuestionAuthor,
  getQuestionComments,
} from '~/graphql/resolvers/queries/ama'
import { Context } from '~/graphql/context'
import { revue } from '~/lib/revue'

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
    email: ({ id }, _, { viewer }: Context) => {
      return viewer && viewer.id === id ? viewer.email : null
    },
    pendingEmail: ({ id }, _, { viewer }: Context) => {
      return viewer && viewer.id === id ? viewer.pendingEmail : null
    },
    emailSubscriptions: async ({ id }, _, { viewer, prisma }: Context) => {
      if (!viewer || !viewer.email || viewer.id !== id) return []

      const [hn, newsletter] = await Promise.all([
        prisma.emailSubscription.findUnique({
          where: {
            email: viewer.email,
          },
        }),
        // revue.getSubscriber({ email: viewer.email }),
      ])

      return [
        // {
        //   type: EmailSubscriptionType.Newsletter,
        //   subscribed: !!newsletter,
        // },
        {
          type: EmailSubscriptionType.HackerNews,
          subscribed: !!hn,
        },
      ]
    },
  },
}
