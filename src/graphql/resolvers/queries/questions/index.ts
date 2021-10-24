import {
  UserRole,
  QueryQuestionArgs,
  Question,
} from '~/graphql/types.generated'
import { Context } from '~/graphql/context'

export async function getQuestion(_, { id }: QueryQuestionArgs, ctx: Context) {
  const { prisma, viewer } = ctx
  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      comments: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  })

  if (!question) return null

  // answered, good to view
  if (question.comments && question._count.comments > 0) {
    return question
  }

  // question hasn't been answered, show it to admin or asker
  if (!viewer) return null

  if (question.userId === viewer.id || viewer.role === UserRole.Admin) {
    return question
  }

  return null
}

export async function getQuestions(_, __, ctx: Context) {
  const { prisma, viewer } = ctx

  if (viewer?.role === UserRole.Admin) {
    return await prisma.question.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
  }

  return await prisma.question.findMany({
    where: {
      comments: {
        some: {},
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  })
}

export async function getQuestionAuthor(parent: Question, _, ctx: Context) {
  const { id } = parent
  const { prisma } = ctx

  return await prisma.question.findUnique({ where: { id } }).author()
}
