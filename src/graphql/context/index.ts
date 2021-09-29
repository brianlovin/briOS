import { PrismaClient } from '@prisma/client'
import { getSession } from '@auth0/nextjs-auth0'
import { prisma } from '~/lib/prisma/client'
import { User } from '../types.generated'

export function isAuthenticated(req, res) {
  const session = getSession(req, res)
  return session?.user
}

export async function getViewer(req, res) {
  const user = isAuthenticated(req, res)

  let viewer = null
  if (user) {
    viewer = await prisma.user.findUnique({ where: { twitterId: user.sub } })
  }

  return viewer
}

export default async function context(ctx) {
  const viewer = await getViewer(ctx.req, ctx.res)
  console.log({ context: viewer })
  return {
    viewer,
    prisma,
  }
}

export type Context = {
  prisma: PrismaClient
  viewer: User | null
}
