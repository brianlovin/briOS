import { URL } from 'url'
import { UserInputError } from 'apollo-server-micro'
import { db } from '~/graphql/services/firebase'
import { BOOKMARKS_COLLECTION } from '~/graphql/constants'
import {
  MutationAddBookmarkArgs,
  MutationAddStackArgs,
  MutationDeleteBookmarkArgs,
  MutationDeleteStackArgs,
  MutationEditBookmarkArgs,
  MutationEditStackArgs,
} from '~/graphql/types.generated'
import { Context } from '~/graphql/context'

function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (err) {
    return false
  }
}

export async function editStack(_, args: MutationEditStackArgs, ctx: Context) {
  const { id, data } = args
  const { name, url } = data
  const { prisma } = ctx

  if (!name || name.length === 0)
    throw new UserInputError('Stack must have a name')

  if (!url || url.length === 0)
    throw new UserInputError('Stack must have a URL')

  return await prisma.stack.update({
    where: {
      id,
    },
    data,
  })
}

export async function addStack(_, args: MutationAddStackArgs, ctx: Context) {
  const { data } = args
  const { url } = data
  const { prisma } = ctx

  if (!isValidUrl(url)) throw new UserInputError('URL was invalid')

  return await prisma.stack.create({
    data,
  })
}

export async function deleteStack(
  _,
  args: MutationDeleteStackArgs,
  ctx: Context
) {
  const { id } = args
  const { prisma } = ctx

  await prisma.stack.delete({
    where: {
      id,
    },
  })

  return true
}
