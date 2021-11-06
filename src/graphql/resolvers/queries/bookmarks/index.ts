import { PAGINATION_AMOUNT } from '~/graphql/constants'
import { Context } from '~/graphql/context'
import { GetBookmarksQueryVariables } from '~/graphql/types.generated'

export async function getBookmarks(
  _,
  args: GetBookmarksQueryVariables,
  ctx: Context
) {
  const { first = PAGINATION_AMOUNT, after = undefined, filter = null } = args
  const { prisma } = ctx

  /*
    When we are paginating after a cursor, we need to skip the cursor object itself. 
    Ref https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination
  */
  const skip = after ? 1 : 0
  const cursor = after ? { id: after } : undefined

  /*
    Not sure how to handle combined filters, but for now we can essentially 
    switch-case the filter argument and replace the `where` object in our
    findMany call.
  */
  let where = undefined
  if (filter?.tag) {
    where = {
      tags: {
        some: {
          name: { equals: filter.tag },
        },
      },
    }
  }
  if (filter?.host) {
    where = {
      host: {
        equals: filter.host,
      },
    }
  }

  /*
    In order to know if there are more results in the database for the `hasNextPage`
    field, we overfetch by one. If we return more than the amount we requested,
    then we know there are more results.
  */
  const take = first + 1

  try {
    const edges = await prisma.bookmark.findMany({
      take,
      skip,
      cursor,
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        tags: true,
        _count: {
          select: { reactions: true },
        },
      },
    })

    // If we overfetched, then we know there are more results
    const hasNextPage = edges.length > first
    // Remove the last item so we only return the requested `first` amount
    const trimmedEdges = hasNextPage ? edges.slice(0, -1) : edges
    const edgesWithNodes = trimmedEdges.map((edge) => ({
      cursor: edge.id,
      node: edge,
    }))

    return {
      pageInfo: {
        hasNextPage,
        totalCount: await prisma.bookmark.count({ where }),
        endCursor: edgesWithNodes[edgesWithNodes.length - 1].cursor,
      },
      edges: edgesWithNodes,
    }
  } catch (e) {
    console.error({ error: e })
    return {
      pageInfo: {
        hasNextPage: false,
        totalCount: 0,
        endCursor: null,
      },
      edges: [],
    }
  }
}

export async function getBookmark(_, { id }, ctx: Context) {
  const { prisma } = ctx

  try {
    return await prisma.bookmark.findUnique({
      where: { id },
      include: {
        tags: true,
        _count: {
          select: { reactions: true },
        },
      },
    })
  } catch (e) {
    return null
  }
}
