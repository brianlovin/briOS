import { UserInputError } from 'apollo-server-micro'

import { baseUrl } from '~/config/seo'
import { Context } from '~/graphql/context'
import {
  MutationAddQuestionArgs,
  MutationDeleteQuestionArgs,
  MutationEditQuestionArgs,
  UserRole,
} from '~/graphql/types.generated'
import { graphcdn } from '~/lib/graphcdn'
import { emailMe } from '~/lib/postmark'

export async function editQuestion(
  _,
  args: MutationEditQuestionArgs,
  ctx: Context
) {
  const { data, id } = args
  const { prisma, viewer } = ctx

  const question = await prisma.question.findUnique({ where: { id } })
  if (!question) {
    throw new UserInputError('Question doesn’t exist')
  }

  if (viewer.role === UserRole.Admin || viewer.id === question.userId) {
    return await prisma.question
      .update({
        where: { id },
        data,
        include: {
          _count: {
            select: {
              comments: true,
            },
          },
        },
      })
      .then((question) => {
        graphcdn.purgeList('questions')
        return question
      })
      .catch((err) => {
        console.error({ err })
        throw new UserInputError('Unable to edit question')
      })
  }

  throw new UserInputError('No permission to delete this question')
}

export async function addQuestion(
  _,
  args: MutationAddQuestionArgs,
  ctx: Context
) {
  const { data } = args
  const { title, description } = data
  const { viewer, prisma } = ctx

  const question = await prisma.question
    .create({
      data: {
        title,
        description,
        userId: viewer.id,
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
    .then((question) => {
      graphcdn.purgeList('questions')
      return question
    })
    .catch((err) => {
      console.error({ err })
      throw new UserInputError('Unable to add question')
    })

  emailMe({
    subject: `AMA: ${title}`,
    body: `${title}\n\n${baseUrl}/ama/${question.id}`,
  })

  return question
}

export async function deleteQuestion(
  _,
  args: MutationDeleteQuestionArgs,
  ctx: Context
) {
  const { id } = args
  const { prisma, viewer } = ctx

  const question = await prisma.question.findUnique({ where: { id } })
  if (!question) return true

  if (viewer.role === UserRole.Admin || viewer.id === question.userId) {
    return await prisma.question
      .delete({ where: { id } })
      .then(() => {
        graphcdn.purgeList('questions')
        return true
      })
      .catch((err) => {
        console.error({ err })
        throw new UserInputError('Unable to delete question')
      })
  }

  throw new UserInputError('No permission to delete this question')
}
