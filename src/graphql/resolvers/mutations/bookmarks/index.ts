import { URL } from 'url'
import { UserInputError } from 'apollo-server-micro'
import { db } from '~/graphql/services/firebase'
import getBookmarkMetaData from './getBookmarkMetaData'
import { BOOKMARKS_COLLECTION } from '~/graphql/constants'
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
  const { id, title } = args
  const { prisma } = ctx

  if (!title || title.length === 0)
    throw new UserInputError('Bookmark must have a title')

  return await prisma.bookmark.update({
    where: { id },
    data: { title },
    include: { tags: true },
  })
}

export async function addBookmark(
  _,
  args: MutationAddBookmarkArgs,
  ctx: Context
) {
  const { url } = args
  const { prisma } = ctx

  if (!isValidUrl(url)) throw new UserInputError('URL was invalid')

  const metadata = await getBookmarkMetaData(url)
  const { host, title, image, description } = metadata
  return await prisma.bookmark.create({
    data: {
      url,
      host,
      title,
      image,
      description,
    },
    include: { tags: true },
  })
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
