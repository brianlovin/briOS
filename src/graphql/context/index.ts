import { PrismaClient } from '@prisma/client'

import { authik } from '~/lib/authik/server'
import { prisma } from '~/lib/prisma'

import { User, UserRole } from '../types.generated'

export async function isAuthenticated(req, res) {
  const { sessionToken } = await authik.verifySessionToken(req)
  return sessionToken
}

export async function getViewer(req, res) {
  const sessionToken = await isAuthenticated(req, res)

  let viewer = null
  if (sessionToken) {
    viewer = await prisma.user.findUnique({
      where: { authikId: sessionToken.userId },
    })
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
