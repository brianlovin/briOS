import { Context } from '~/graphql/context'
import { GetStackQueryVariables, Stack } from '~/graphql/types.generated'

export async function getStacks(_, __, ctx: Context) {
  const { prisma } = ctx

  try {
    return await prisma.stack.findMany({ orderBy: { name: 'asc' } })
  } catch (e) {
    return []
  }
}

export async function getStack(
  _,
  { id }: GetStackQueryVariables,
  ctx: Context
) {
  const { prisma } = ctx

  try {
    return await prisma.stack.findUnique({
      where: {
        id,
      },
    })
  } catch (e) {
    return null
  }
}

export async function getStackComments(parent: Stack, _, ctx: Context) {
  const { id } = parent
  const { prisma } = ctx

  return await prisma.stack.findUnique({ where: { id } }).comments()
}
