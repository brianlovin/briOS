import { Context } from '~/graphql/context'
import Mutation from '~/graphql/resolvers/mutations'
import Query from '~/graphql/resolvers/queries'
import { getCommentAuthor } from '~/graphql/resolvers/queries/comment'
import { getQuestionAuthor } from '~/graphql/resolvers/queries/questions'
import { QuestionStatus } from '~/graphql/types.generated'

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
  },
  Question: {
    author: getQuestionAuthor,
    status: ({ _count: { comments } }) =>
      comments > 0 ? QuestionStatus.Answered : QuestionStatus.Pending,
    reactionCount: async ({ id, _count }, _, { prisma }: Context) => {
      if (_count?.reactions) return _count.reactions

      const reactions = await prisma.question
        .findUnique({
          where: { id },
        })
        .reactions()

      return reactions.length
    },
  },

  Bookmark: {
    reactionCount: async ({ id, _count }, _, { prisma }: Context) => {
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
    reactionCount: async ({ id, _count }, _, { prisma }: Context) => {
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
    reactionCount: async ({ id, _count }, _, { prisma }: Context) => {
      if (_count?.reactions) return _count.reactions

      const reactions = await prisma.stack
        .findUnique({
          where: { id },
        })
        .reactions()

      return reactions.length
    },
    usedBy: async ({ id, users }, _, ctx: Context) => {
      return users
    },
  },
}
