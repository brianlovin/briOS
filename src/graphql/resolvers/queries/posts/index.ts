import { Context } from '~/graphql/context'
import { GetPostQueryVariables, UserRole } from '~/graphql/types.generated'

export async function getPosts(_, __, ctx: Context) {
  const { prisma } = ctx
  return await prisma.post.findMany({
    orderBy: { publishedAt: 'desc' },
    where: { publishedAt: { not: null } },
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
  const isAdmin = viewer?.role === UserRole.Admin
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

  if (!post?.publishedAt && !isAdmin) {
    return null
  }

  return post
}
