import db from '~/graphql/bookmarks/firebase'

export const getBookmarks = async () => {
  const data = []

  await db
    .collection('bookmarks')
    .orderBy('createdAt', 'desc')
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const d = doc.data()
        const id = doc.id
        data.push({
          ...d,
          id,
        })
      })
    })

  return data
}
