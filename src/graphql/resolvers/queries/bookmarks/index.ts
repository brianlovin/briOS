import firebase from '~/graphql/services/firebase'

export async function getBookmarks() {
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
          reactions: d.reactions || 0,
          id,
        })
      })
    })

  return data
}
