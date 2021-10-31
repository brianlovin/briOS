import { Context } from '~/graphql/context'
import { GetPostQueryVariables, UserRole } from '~/graphql/types.generated'

export async function getPosts(_, __, ctx: Context) {
  const { prisma } = ctx
  return await prisma.post.findMany({
    orderBy: { publishedAt: 'desc' },
    where: { publishedAt: { not: null } },
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
    prisma.post.findUnique({ where: { slug } }),
    prisma.post.findUnique({ where: { id: slug } }),
  ])

  const post = postBySlug || postById

  if (!post?.publishedAt && !isAdmin) {
    return null
  }

  return post
}
