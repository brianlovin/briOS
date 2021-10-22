import fetch from 'isomorphic-unfetch'
import { URL } from 'url'
import { UserInputError } from 'apollo-server-micro'
import {
  MutationAddStackArgs,
  MutationDeleteStackArgs,
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

  /*
    Keep our image storage somewhat clean by deleting unused images
  */
  const old = await prisma.stack.findUnique({ where: { id } })
  if (old.image !== data.image) {
    try {
      const url = new URL(old.image)
      if (isValidUrl(url)) {
        const [, , imageId] = url.pathname.split('/')

        await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_KEY}`,
            },
          }
        )
      }
    } catch (err) {
      console.error({ err })
    }
  }

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

  const old = await prisma.stack.findUnique({ where: { id } })
  try {
    const url = new URL(old.image)
    const [, , imageId] = url.pathname.split('/')
    if (isValidUrl(url)) {
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_KEY}`,
          },
        }
      )
    }
  } catch (err) {
    console.error({ err })
  }

  await prisma.stack.delete({
    where: {
      id,
    },
  })

  return true
}
