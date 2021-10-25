import { Context } from '~/graphql/context'
import { GetStackQueryVariables, Stack } from '~/graphql/types.generated'

import { viewer } from '../viewer'

export async function getStacks(_, __, ctx: Context) {
  const { prisma } = ctx

  try {
    return await prisma.stack.findMany({
      orderBy: { name: 'asc' },
    })
  } catch (e) {
    return []
  }
}

export async function getStack(
  _,
  { id }: GetStackQueryVariables,
  ctx: Context
) {
  const { prisma, viewer } = ctx

  try {
    const data = await prisma.stack.findUnique({
      where: { id },
      include: {
        users: true,
        tags: true,
      },
    })

    const usedBy = data.users
    const usedByViewer =
      viewer?.id && data.users.some((s) => s.id === viewer.id)

    return {
      ...data,
      usedBy,
      usedByViewer,
    }
  } catch (e) {
    return null
  }
}
