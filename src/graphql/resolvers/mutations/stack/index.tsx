import { UserInputError } from 'apollo-server-micro'
import fetch from 'isomorphic-unfetch'
import slugify from 'slugify'

import { Context } from '~/graphql/context'
import {
  MutationAddStackArgs,
  MutationDeleteStackArgs,
  MutationEditStackArgs,
  MutationToggleStackUserArgs,
} from '~/graphql/types.generated'
import { graphcdn } from '~/lib/graphcdn'
import { validUrl } from '~/lib/validators'

export async function editStack(_, args: MutationEditStackArgs, ctx: Context) {
  const { id, data } = args
  const { name, url, tag, description, image } = data
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
      if (validUrl(url)) {
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

  await prisma.stack.update({
    where: { id },
    data: {
      tags: {
        set: [],
      },
    },
  })

  const tags = tag
    ? {
        connectOrCreate: {
          where: { name: tag },
          create: { name: tag },
        },
      }
    : undefined

  return await prisma.stack
    .update({
      where: { id },
      data: {
        name,
        url,
        description,
        image,
        tags,
      },
      include: { tags: true },
    })
    .then((stack) => {
      graphcdn.purgeList('stacks')
      return stack
    })
    .catch((err) => {
      console.error({ err })
      throw new UserInputError('Unable to edit stack')
    })
}

export async function addStack(_, args: MutationAddStackArgs, ctx: Context) {
  const { data } = args
  const { url, name, description, image, tag } = data
  const { prisma } = ctx

  if (!validUrl(url)) throw new UserInputError('URL was invalid')

  const tags = tag
    ? {
        connectOrCreate: {
          where: { name: tag },
          create: { name: tag },
        },
      }
    : undefined

  return await prisma.stack
    .create({
      data: {
        name,
        url,
        description,
        image,
        tags,
        slug: slugify(name, { lower: true }),
      },
      include: { tags: true },
    })
    .then((stack) => {
      graphcdn.purgeList('stacks')
      return stack
    })
    .catch((err) => {
      console.error({ err })
      throw new UserInputError('Unable to add stack')
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
    if (validUrl(url)) {
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

  return await prisma.stack
    .delete({
      where: { id },
    })
    .then(() => {
      graphcdn.purgeList('stacks')
      return true
    })
    .catch((err) => {
      console.error({ err })
      throw new UserInputError('Unable to delete stack')
    })
}

export async function toggleStackUser(
  _,
  args: MutationToggleStackUserArgs,
  ctx: Context
) {
  const { id } = args
  const { prisma, viewer } = ctx

  const stackUsers = await prisma.stack.findUnique({
    where: { id },
    include: { users: true },
  })

  if (stackUsers.users.find((s) => s.id === viewer.id)) {
    const data = await prisma.stack.update({
      where: { id },
      data: {
        users: {
          disconnect: { id: viewer.id },
        },
      },
      include: { users: true },
    })

    const usedBy = data.users
    const usedByViewer =
      viewer?.id && data.users.some((s) => s.id === viewer.id)

    return {
      ...data,
      usedBy,
      usedByViewer,
    }
  } else {
    const data = await prisma.stack.update({
      where: { id },
      data: {
        users: {
          connect: { id: viewer.id },
        },
      },
      include: { users: true },
    })

    const usedBy = data.users
    const usedByViewer =
      viewer?.id && data.users.some((s) => s.id === viewer.id)

    return {
      ...data,
      usedBy,
      usedByViewer,
    }
  }
}
