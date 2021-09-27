import { Context } from '~/graphql/context'
import {
  Bookmark,
  CommentType,
  QueryCommentArgs,
} from '~/graphql/types.generated'

export async function getComment(_, args: QueryCommentArgs, ctx: Context) {
  const { id } = args
  const { prisma } = ctx

  return await prisma.comment.findUnique({ where: { id } })
}

export async function getBookmarkComments(parent: Bookmark, _, ctx: Context) {
  const { id } = parent
  const { prisma } = ctx

  return await prisma.bookmark.findUnique({ where: { id } }).comments()
}

export async function getCommentAuthor(parent: Bookmark, _, ctx: Context) {
  const { id } = parent
  const { prisma } = ctx

  return await prisma.comment.findUnique({ where: { id } }).author()
}

export async function getComments(_, args, ctx: Context) {
  const { refId, type } = args
  const { prisma } = ctx

  switch (type) {
    case CommentType.Bookmark: {
      const results = await prisma.bookmark
        .findUnique({ where: { id: refId } })
        .comments()

      return results || []
    }
    default: {
      return []
    }
  }
}
