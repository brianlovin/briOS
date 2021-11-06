import { Context } from '~/graphql/context'
import Mutation from '~/graphql/resolvers/mutations'
import Query from '~/graphql/resolvers/queries'
import { getCommentAuthor } from '~/graphql/resolvers/queries/comment'
import { getQuestionAuthor } from '~/graphql/resolvers/queries/questions'
import {
  EmailSubscriptionType,
  QuestionStatus,
  UserRole,
} from '~/graphql/types.generated'
import { revue } from '~/lib/revue'

import { dateScalar } from '../scalars'

export default {
  Date: dateScalar,
  Query,
  Mutation,
  Reactable: {
    __resolveType(obj) {
      switch (obj.reactableType) {
        case 'question':
          return 'Question'
        case 'stack':
          return 'Stack'
        case 'post':
          return 'Post'
        case 'bookmark':
          return 'Bookmark'
        default:
          return null
      }
    },
  },
  Comment: {
    author: getCommentAuthor,
    viewerCanEdit: ({ userId }, _, { viewer }: Context) => {
      return userId === viewer?.id
    },
    viewerCanDelete: ({ userId }, _, { viewer }: Context) => {
      return userId === viewer?.id || viewer?.role === UserRole.Admin
    },
  },
  Question: {
    viewerCanEdit: ({ userId }, _, { viewer }: Context) => {
      return userId === viewer?.id || viewer?.role === UserRole.Admin
    },
    viewerCanComment: async ({ id }, _, ctx: Context) => {
      const { viewer, prisma } = ctx
      const isAdmin = viewer?.role === UserRole.Admin
      // I can always comment to answer a question
      if (isAdmin) return true
      // If it's not me, only let people see the comment form if there are existing comments (answered)
      const comments = await prisma.question
        .findUnique({
          where: { id },
        })
        .comments()
      return comments.length > 0
    },
    author: getQuestionAuthor,
    status: ({ _count: { comments } }) =>
      comments > 0 ? QuestionStatus.Answered : QuestionStatus.Pending,
    viewerHasReacted: async ({ id }, _, { viewer }: Context) => {
      if (!viewer) return false

      const reactions = await prisma.question
        .findUnique({
          where: { id },
        })
        .reactions()

      return reactions.some(({ userId }) => userId === viewer.id)
    },
    reactionCount: async ({ id, _count }) => {
      if (_count?.reactions) return _count.reactions

      const reactions = await prisma.question
        .findUnique({
          where: { id },
        })
        .reactions()

      return reactions.length
    },
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
      if (!viewer || !viewer.email || viewer.id !== id)
        return [
          {
            type: EmailSubscriptionType.HackerNews,
            subscribed: false,
          },
        ]

      const [hn, newsletter] = await Promise.all([
        prisma.emailSubscription.findUnique({
          where: {
            emailAndType: {
              email: viewer.email,
              type: EmailSubscriptionType.HackerNews,
            },
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
  Bookmark: {
    viewerHasReacted: async ({ id }, _, { viewer }: Context) => {
      if (!viewer) return false

      const reactions = await prisma.bookmark
        .findUnique({
          where: { id },
        })
        .reactions()

      return reactions.some(({ userId }) => userId === viewer.id)
    },
    reactionCount: async ({ id, _count }) => {
      if (_count?.reactions) return _count.reactions

      const reactions = await prisma.bookmark
        .findUnique({
          where: { id },
        })
        .reactions()

      return reactions.length
    },
  },
  Post: {
    viewerHasReacted: async ({ id }, _, { viewer }: Context) => {
      if (!viewer) return false

      const reactions = await prisma.post
        .findUnique({
          where: { id },
        })
        .reactions()

      return reactions.length

      return reactions.some(({ userId }) => userId === viewer.id)
    },
    reactionCount: async ({ id, _count }) => {
      if (_count?.reactions) return _count.reactions

      const reactions = await prisma.post
        .findUnique({
          where: { id },
        })
        .reactions()

      return reactions.length
    },
  },
  Stack: {
    viewerHasReacted: async ({ id }, _, { viewer }: Context) => {
      if (!viewer) return false

      const reactions = await prisma.stack
        .findUnique({
          where: { id },
        })
        .reactions()

      return reactions.some(({ userId }) => userId === viewer.id)
    },
    reactionCount: async ({ id, _count }) => {
      if (_count?.reactions) return _count.reactions

      const reactions = await prisma.stack
        .findUnique({
          where: { id },
        })
        .reactions()

      return reactions.length
    },
  },
}
