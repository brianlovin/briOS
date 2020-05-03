import { URL } from 'url'
import { AuthenticationError, UserInputError } from 'apollo-server-micro'
import firebase from '~/graphql/api/firebase'
import getBookmarkMetaData from './getBookmarkMetaData'

function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (err) {
    return false
  }
}

export async function editBookmark(_, { id, title }, { isMe }) {
  if (!isMe) throw new AuthenticationError('You must be logged in')
  if (!title) throw new UserInputError('Bookmark must have a title')

  await firebase.collection('bookmarks').doc(id).update({ title })

  return await firebase
    .collection('bookmarks')
    .doc(id)
    .get()
    .then((doc) => doc.data())
}

export async function addBookmark(_, { url }, { isMe }) {
  if (!isMe) throw new AuthenticationError('You must be logged in')
  if (!url) throw new UserInputError('Bookmarks must contain a url')
  if (!isValidUrl(url)) throw new UserInputError('URL was invalid')

  const metadata = await getBookmarkMetaData(url)

  const id = await firebase
    .collection('bookmarks')
    .add({
      createdAt: new Date(),
      ...metadata,
    })
    .then(({ id }) => id)

  return await firebase
    .collection('bookmarks')
    .doc(id)
    .get()
    .then((doc) => doc.data())
    .then((res) => ({ ...res, id }))
}

export async function deleteBookmark(_, { id }, { isMe }) {
  if (!isMe) throw new AuthenticationError('You must be logged in')

  return await firebase
    .collection('bookmarks')
    .doc(id)
    .delete()
    .then(() => true)
}
