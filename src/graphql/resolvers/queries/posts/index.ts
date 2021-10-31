import { Context } from '~/graphql/context'
import { GetPostQueryVariables } from '~/graphql/types.generated'

export async function getPosts(_, __, ctx: Context) {
  const { prisma } = ctx
  return await prisma.post.findMany({
    orderBy: { publishedAt: 'desc' },
  })
}

export async function getPost(
  _,
  { slug }: GetPostQueryVariables,
  ctx: Context
) {
  const { prisma } = ctx
  return await prisma.post.findUnique({
    where: { slug },
  })
}
