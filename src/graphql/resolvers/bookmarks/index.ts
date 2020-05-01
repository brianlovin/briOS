import firebase from '~/graphql/api/firebase'

export const getBookmarks = async () => {
  const data = []

  await firebase
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
