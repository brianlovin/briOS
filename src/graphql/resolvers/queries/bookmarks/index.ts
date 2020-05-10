import firebase from '~/graphql/services/firebase'
import { PAGINATION_AMOUNT } from '~/graphql/constants'

export async function getBookmarks(_, { skip = 0 }) {
  const data = []

  await firebase
    .collection('bookmarks')
    .orderBy('createdAt', 'desc')
    .limit(PAGINATION_AMOUNT)
    .offset(skip)
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
