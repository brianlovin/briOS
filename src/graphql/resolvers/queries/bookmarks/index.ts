import firebase from '~/graphql/services/firebase'
import { PAGINATION_AMOUNT } from '~/graphql/constants'

export async function getBookmarks(_, { skip = 0, category = undefined }) {
  const data = []
  const ref = firebase.collection('bookmarks')
  if (category) {
    await ref
      .where('category', '==', category)
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
  } else {
    await ref
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
  }

  return data
}
