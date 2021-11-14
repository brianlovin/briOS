import { Context } from '~/graphql/context'
import {
  GetPostQueryVariables,
  GetPostsQueryVariables,
} from '~/graphql/types.generated'

export async function getPosts(_, args: GetPostsQueryVariables, ctx: Context) {
  const { filter } = args
  const { prisma, viewer } = ctx
  const published = filter?.published

  return await prisma.post.findMany({
    orderBy: published ? { publishedAt: 'desc' } : { createdAt: 'desc' },
    where: {
      publishedAt:
        !published && viewer?.isAdmin ? { equals: null } : { not: null },
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
  const { prisma, viewer } = ctx
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

  if (!post?.publishedAt && !viewer?.isAdmin) {
    return null
  }

  return post
}
