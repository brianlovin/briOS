import { PrismaClient } from '@prisma/client'

import { prisma } from '~/lib/prisma'

export async function getContext() {
  return {
    prisma,
  }
}

export default async function context() {
  return await getContext()
}

export type Context = {
  prisma: PrismaClient
}
