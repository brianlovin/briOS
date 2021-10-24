import { URL } from 'url'
import { UserInputError } from 'apollo-server-micro'
import getBookmarkMetaData from './getBookmarkMetaData'
import {
  MutationAddBookmarkArgs,
  MutationDeleteBookmarkArgs,
  MutationEditBookmarkArgs,
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

export async function editBookmark(
  _,
  args: MutationEditBookmarkArgs,
  ctx: Context
) {
  const { id, data } = args
  const { title, description, tag } = data
  const { prisma } = ctx

  if (!title || title.length === 0)
    throw new UserInputError('Bookmark must have a title')

  // reset tags
  await prisma.bookmark.update({
    where: { id },
    data: {
      tags: {
        set: [],
      },
    },
    include: { tags: true },
  })

  // update data
  return await prisma.bookmark.update({
    where: { id },
    data: {
      title,
      description,
      tags: {
        connect: {
          name: tag,
        },
      },
    },
    include: { tags: true },
  })
}

export async function addBookmark(
  _,
  args: MutationAddBookmarkArgs,
  ctx: Context
) {
  const { data } = args
  const { url, tag } = data
  const { prisma } = ctx

  if (!isValidUrl(url)) throw new UserInputError('URL was invalid')

  const metadata = await getBookmarkMetaData(url)
  const { host, title, image, description } = metadata

  try {
    return await prisma.bookmark.create({
      data: {
        url,
        host,
        title,
        image,
        description,
        tags: {
          connectOrCreate: {
            create: {
              name: tag,
            },
            where: {
              name: tag,
            },
          },
        },
      },
      include: { tags: true },
    })
  } catch (err) {
    throw new UserInputError('Unable to create bookmark')
  }
}

export async function deleteBookmark(
  _,
  args: MutationDeleteBookmarkArgs,
  ctx: Context
) {
  const { id } = args
  const { prisma } = ctx

  await prisma.bookmark.delete({
    where: { id },
  })

  return true
}
