import firebase from '~/graphql/api/firebase'
import getBookmarkMetaData from './getBookmarkMetaData'

export async function editBookmark(_, { id, title }, { isMe }) {
  if (!isMe) return null
  if (!title) return null

  await firebase.collection('bookmarks').doc(id).update({ title })

  return await firebase
    .collection('bookmarks')
    .doc(id)
    .get()
    .then((doc) => doc.data())
}

export async function addBookmark(_, { url }, { isMe }) {
  if (!isMe) return null
  if (!url) return null

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
  if (!isMe) return false
  if (!id) return false

  return await firebase
    .collection('bookmarks')
    .doc(id)
    .delete()
    .then(() => true)
}
