import { Context } from '~/graphql/context'
import { GetBookmarksQueryVariables } from '~/graphql/types.generated'
export async function getBookmarks(
  _,
  args: GetBookmarksQueryVariables,
  ctx: Context
) {
  const { tag } = args
  const { prisma } = ctx

  try {
    if (tag) {
      return await prisma.bookmark.findMany({
        orderBy: { createdAt: 'desc' },
        where: {
          tags: {
            some: {
              name: {
                equals: tag,
              },
            },
          },
        },
        include: { tags: true },
      })
    }
    return await prisma.bookmark.findMany({
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
    })
  } catch (e) {
    return []
  }
}

export async function getBookmark(_, { id }, ctx: Context) {
  const { prisma } = ctx

  try {
    return await prisma.bookmark.findUnique({
      where: { id },
      include: { tags: true },
    })
  } catch (e) {
    return null
  }
}
