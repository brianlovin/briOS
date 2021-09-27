import { Context } from '~/graphql/context'
export async function getBookmarks(_, __, ctx: Context) {
  const { prisma } = ctx

  try {
    return await prisma.bookmark.findMany()
  } catch (e) {
    return []
  }
}

export async function getBookmark(_, { id }, ctx: Context) {
  const { prisma } = ctx

  try {
    return await prisma.bookmark.findUnique({
      where: {
        id,
      },
    })
  } catch (e) {
    return null
  }
}
