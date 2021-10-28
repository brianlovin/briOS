import { UserInputError } from 'apollo-server-micro'

import { IS_PROD } from '~/graphql/constants'
import { Context } from '~/graphql/context'
import {
  MutationAddBookmarkArgs,
  MutationDeleteBookmarkArgs,
  MutationEditBookmarkArgs,
} from '~/graphql/types.generated'
import { revue } from '~/lib/revue'
import { validUrl } from '~/lib/validators'

import getBookmarkMetaData from './getBookmarkMetaData'

export async function editBookmark(
  _,
  args: MutationEditBookmarkArgs,
  ctx: Context
) {
  const { id, data } = args
  const { title, description, tag, faviconUrl } = data
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
      faviconUrl,
      tags: {
        connectOrCreate: {
          where: { name: tag },
          create: { name: tag },
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

  if (!validUrl(url)) throw new UserInputError('URL was invalid')

  const metadata = await getBookmarkMetaData(url)
  const { host, title, image, description, faviconUrl } = metadata

  /*
    Preemptively add bookmarks to Revue, assuming I want to share them
    more broadly in the newsletter
  */
  if (IS_PROD) {
    try {
      const { id } = await revue.getCurrentIssue()
      await revue.addItemToIssue({ id, url })
    } catch (err) {
      console.error({ err })
    }
  } else {
    console.log('Adding bookmark to newsletter', { url })
  }

  try {
    return await prisma.bookmark.create({
      data: {
        url,
        host,
        title,
        image,
        description,
        faviconUrl,
        tags: {
          connectOrCreate: {
            where: { name: tag },
            create: { name: tag },
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
