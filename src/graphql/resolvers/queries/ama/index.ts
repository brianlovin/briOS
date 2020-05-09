import db from '~/graphql/services/firebase'
import { Ama } from '~/graphql/types.generated'

export async function getAMAQuestions(_, __, { isMe }) {
  const data = []

  await db
    .collection('questions')
    .orderBy('updatedAt', 'desc')
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const d = doc.data()
        const id = doc.id
        const createdAt = d.createdAt.toDate()
        const updatedAt = d.updatedAt.toDate()
        const record = { ...d, id, createdAt, updatedAt } as Ama

        if (record.status === 'ANSWERED') {
          data.push(record)
        } else if (isMe) {
          data.push(record)
        }
      })
    })

  return data
}
