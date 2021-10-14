import { UserInputError } from 'apollo-server-micro'
import { Context } from '~/graphql/context'
import {
  CommentType,
  MutationAddCommentArgs,
  MutationDeleteCommentArgs,
  MutationEditCommentArgs,
  UserRole,
} from '~/graphql/types.generated'

export async function editComment(
  _,
  args: MutationEditCommentArgs,
  ctx: Context
) {
  const { id, text } = args
  const { prisma } = ctx

  if (!text || text.length === 0)
    throw new UserInputError('Comment can’t be blank')

  return await prisma.comment.update({
    where: {
      id,
    },
    data: {
      text,
    },
  })
}

export async function addComment(
  _,
  args: MutationAddCommentArgs,
  ctx: Context
) {
  const { refId, type, text } = args
  const { viewer, prisma } = ctx

  const trimmedText = text.trim()

  if (trimmedText.length === 0)
    throw new UserInputError('Comments can’t be blank')

  let field
  switch (type) {
    case CommentType.Bookmark: {
      field = 'bookmarkId'
      break
    }
    case CommentType.Post: {
      field = 'postId'
      break
    }
    case CommentType.Question: {
      field = 'questionId'
      break
    }
    case CommentType.Stack: {
      field = 'stackId'
      break
    }
    default: {
      throw new UserInputError('Invalid comment type')
    }
  }
  return await prisma.comment.create({
    data: {
      text,
      userId: viewer.id,
      [field]: refId,
    },
  })
}

export async function deleteComment(
  _,
  args: MutationDeleteCommentArgs,
  ctx: Context
) {
  const { id } = args
  const { prisma, viewer } = ctx

  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  })

  // comment doesn't exist, already deleted
  if (!comment) return true
  // no permission
  if (comment.userId !== viewer?.id || viewer?.role !== UserRole.Admin) {
    throw new UserInputError('You can’t delete this comment')
  }

  await prisma.comment.delete({
    where: {
      id,
    },
  })

  return true
}
