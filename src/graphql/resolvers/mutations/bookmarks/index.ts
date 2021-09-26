import { URL } from 'url'
import { UserInputError } from 'apollo-server-micro'
import { db } from '~/graphql/services/firebase'
import getBookmarkMetaData from './getBookmarkMetaData'
import { BOOKMARKS_COLLECTION } from '~/graphql/constants'
import { prisma } from '~/lib/prisma/client'

function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (err) {
    return false
  }
}

export async function editBookmark(_, { id, title }) {
  if (!title || title.length === 0)
    throw new UserInputError('Bookmark must have a title')

  return await prisma.bookmark.update({
    where: {
      id,
    },
    data: {
      title,
    },
  })
}

export async function addBookmark(_, { url }) {
  if (!isValidUrl(url)) throw new UserInputError('URL was invalid')

  const metadata = await getBookmarkMetaData(url)
  const { host, title, image, siteName, description } = metadata
  return await prisma.bookmark.create({
    data: {
      url,
      host,
      title,
      image,
      siteName,
      description,
    },
  })
}

export async function deleteBookmark(_, { id }) {
  await prisma.bookmark.delete({
    where: {
      id,
    },
  })

  return true
}

export async function addBookmarkReaction(_, { id }) {
  const docRef = db.collection(BOOKMARKS_COLLECTION).doc(id)
  const doc = await docRef.get().then((doc) => doc.data())
  const count = doc.reactions ? doc.reactions + 1 : 1

  await docRef.update({
    reactions: count,
  })

  const res = await docRef.get().then((doc) => doc.data())
  return { ...res, id }
}
