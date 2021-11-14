import { getSession } from '@auth0/nextjs-auth0'
import { PrismaClient } from '@prisma/client'

import { prisma } from '~/lib/prisma'

import { User, UserRole } from '../types.generated'

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
    ? {
        ...viewer,
        isAdmin: viewer?.role === UserRole.Admin,
      }
    : null
}

export async function getContext(req, res) {
  const viewer = await getViewer(req, res)

  return {
    viewer,
    prisma,
  }
}

export default async function context(ctx) {
  return await getContext(ctx.req, ctx.res)
}

export type Context = {
  prisma: PrismaClient
  viewer: User | null
}
