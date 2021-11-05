import { UserInputError } from 'apollo-server-micro'

import { CLIENT_URL } from '~/graphql/constants'
import { Context } from '~/graphql/context'
import {
  CommentType,
  MutationAddCommentArgs,
  MutationDeleteCommentArgs,
  MutationEditCommentArgs,
  UserRole,
} from '~/graphql/types.generated'
import { graphcdn } from '~/lib/graphcdn'
import { emailMe } from '~/lib/postmark'

export async function editComment(
  _,
  args: MutationEditCommentArgs,
  ctx: Context
) {
  const { id, text } = args
  const { prisma, viewer } = ctx

  if (!text || text.length === 0)
    throw new UserInputError('Comment can’t be blank')

  const comment = await prisma.comment.findUnique({
    where: { id },
  })

  if (!comment) throw new UserInputError('Comment doesn’t exist')

  if (comment.userId !== viewer?.id) {
    throw new UserInputError('You can’t edit this comment')
  }

  return await prisma.comment
    .update({
      where: { id },
      data: { text },
    })
    .then((comment) => {
      graphcdn.purgeList('comments')
      return comment
    })
    .catch((err) => {
      console.error({ err })
      throw new UserInputError('Unable to edit comment')
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
  let table
  let route
  switch (type) {
    case CommentType.Bookmark: {
      field = 'bookmarkId'
      table = 'bookmark'
      route = `${CLIENT_URL}/bookmarks/${refId}`
      break
    }
    case CommentType.Post: {
      field = 'postId'
      table = 'post'
      route = `${CLIENT_URL}/writing/${refId}`
      break
    }
    case CommentType.Question: {
      field = 'questionId'
      table = 'question'
      route = `${CLIENT_URL}/ama/${refId}`
      break
    }
    case CommentType.Stack: {
      field = 'stackId'
      table = 'stack'
      route = `${CLIENT_URL}/stack/${refId}`
      break
    }
    default: {
      throw new UserInputError('Invalid comment type')
    }
  }

  const parentObject = await prisma[table].findUnique({ where: { id: refId } })

  if (!parentObject) {
    throw new UserInputError('Commenting on something that doesn’t exist')
  }

  if (viewer.role !== UserRole.Admin) {
    emailMe({
      subject: `New comment on ${table}`,
      body: `${text}\n\n${route}`,
    })
  }

  const [comment] = await Promise.all([
    prisma.comment.create({
      data: {
        text,
        userId: viewer.id,
        [field]: refId,
      },
    }),
    prisma[table].update({
      where: {
        id: refId,
      },
      data: {
        updatedAt: new Date(),
      },
    }),
  ]).catch((err) => {
    console.error({ err })
    throw new UserInputError('Unable to add comment')
  })

  graphcdn.purgeList('comments')

  return comment
}

export async function deleteComment(
  _,
  args: MutationDeleteCommentArgs,
  ctx: Context
) {
  const { id } = args
  const { prisma, viewer } = ctx

  const comment = await prisma.comment.findUnique({
    where: { id },
  })

  // comment doesn't exist, already deleted
  if (!comment) return true
  // no permission
  if (comment.userId !== viewer?.id && viewer?.role !== UserRole.Admin) {
    throw new UserInputError('You can’t delete this comment')
  }

  return await prisma.comment
    .delete({
      where: { id },
    })
    .then(() => {
      graphcdn.purgeList('comments')
      return true
    })
    .catch((err) => {
      console.error({ err })
      throw new UserInputError('Unable to delete comment')
    })
}
