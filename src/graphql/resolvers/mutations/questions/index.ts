import { UserInputError } from 'apollo-server-micro'

import { baseUrl } from '~/config/seo'
import { Context } from '~/graphql/context'
import {
  MutationAddQuestionArgs,
  MutationDeleteQuestionArgs,
  MutationEditQuestionArgs,
  UserRole,
} from '~/graphql/types.generated'
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
    return await prisma.question.update({
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

  emailMe({
    subject: `AMA: ${title}`,
    body: `${title}\n\n${baseUrl}/ama`,
  })

  return await prisma.question.create({
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
    return await prisma.question.delete({ where: { id } }).then(() => true)
  }

  throw new UserInputError('No permission to delete this question')
}
