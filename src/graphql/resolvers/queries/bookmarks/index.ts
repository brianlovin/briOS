import { prisma } from '~/lib/prisma/client'

export async function getBookmarks() {
  try {
    return await prisma.bookmark.findMany()
  } catch (e) {
    return []
  }
}

export async function getBookmark(_, { id }) {
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
