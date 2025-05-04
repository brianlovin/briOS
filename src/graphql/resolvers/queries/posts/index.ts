import { Context } from '~/graphql/context'
import {
  GetPostQueryVariables,
  GetPostsQueryVariables,
} from '~/graphql/types.generated'

export async function getPosts(_, args: GetPostsQueryVariables, ctx: Context) {
  const { prisma } = ctx

  return await prisma.post.findMany({
    orderBy: { publishedAt: 'desc' },
    where: {
      publishedAt: { not: null },
    },
    include: {
      _count: {
        select: {
          reactions: true,
        },
      },
    },
  })
}

export async function getPost(
  _,
  { slug }: GetPostQueryVariables,
  ctx: Context
) {
  const { prisma } = ctx
  const [postBySlug, postById] = await Promise.all([
    prisma.post.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            reactions: true,
          },
        },
      },
    }),
    prisma.post.findUnique({
      where: { id: slug },
      include: {
        _count: {
          select: {
            reactions: true,
          },
        },
      },
    }),
  ])

  const post = postBySlug || postById

  if (!post?.publishedAt) {
    return null
  }

  return post
}
