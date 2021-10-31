import { Context } from '~/graphql/context'
import {
  MutationAddPostArgs,
  MutationDeletePostArgs,
  MutationEditPostArgs,
} from '~/graphql/types.generated'

export async function editPost(_, args: MutationEditPostArgs, ctx: Context) {
  const { id, data } = args
  const { title, text, slug, excerpt } = data
  const { prisma } = ctx

  return await prisma.post.update({
    where: { id },
    data: {
      title,
      text,
      slug,
      excerpt,
    },
  })
}

export async function addPost(_, args: MutationAddPostArgs, ctx: Context) {
  const { data } = args
  const { title, text, slug, excerpt = '' } = data
  const { prisma, viewer } = ctx

  return await prisma.post.create({
    data: {
      title,
      text,
      slug,
      excerpt,
      author: {
        connect: { id: viewer.id },
      },
    },
  })
}

export async function deletePost(
  _,
  args: MutationDeletePostArgs,
  ctx: Context
) {
  const { id } = args
  const { prisma } = ctx

  return true
}
