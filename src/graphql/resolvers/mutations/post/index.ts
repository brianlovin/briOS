import { UserInputError } from 'apollo-server-errors'

import { Context } from '~/graphql/context'
import {
  MutationAddPostArgs,
  MutationDeletePostArgs,
  MutationEditPostArgs,
} from '~/graphql/types.generated'
import { graphcdn } from '~/lib/graphcdn'

export async function editPost(_, args: MutationEditPostArgs, ctx: Context) {
  const { id, data } = args
  const {
    title = '',
    text = '',
    slug = '',
    excerpt = '',
    published = false,
  } = data
  const { prisma } = ctx

  const existing = await prisma.post.findUnique({ where: { slug } })
  if (existing?.id !== id) throw new UserInputError('Slug already exists')

  return await prisma.post
    .update({
      where: { id },
      data: {
        title,
        text,
        slug,
        excerpt,
        publishedAt:
          // as long as the current post isn't published, and the user is trying to hit publish
          // then it's save to publish. but if the post is _already_ published, we don't want
          // to override the publishedAt date
          !existing.publishedAt && published
            ? new Date()
            : existing.publishedAt
            ? existing.publishedAt
            : null,
      },
    })
    .then((post) => {
      if (post.publishedAt) graphcdn.purgeList('posts')
      return post
    })
    .catch((err) => {
      console.error({ err })
      throw new UserInputError('Unable to edit post')
    })
}

export async function addPost(_, args: MutationAddPostArgs, ctx: Context) {
  const { data } = args
  const { title, text, slug, excerpt = '' } = data
  const { prisma, viewer } = ctx

  return await prisma.post
    .create({
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
    .then((post) => {
      graphcdn.purgeList('posts')
      return post
    })
    .catch((err) => {
      console.error({ err })
      throw new UserInputError('Unable to add post')
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
