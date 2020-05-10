import db from '~/graphql/services/firebase'
import { Ama } from '~/graphql/types.generated'
import { PAGINATION_AMOUNT } from '~/graphql/constants'

export async function getAMAQuestions(_, args, { isMe }) {
  const COLLECTION = 'questions'
  const { skip = 0, status = 'ANSWERED' } = args
  const data = []

  if (status === 'PENDING' && !isMe) return []

  await db
    .collection(COLLECTION)
    .where('status', '==', status)
    .orderBy('updatedAt', 'desc')
    .limit(PAGINATION_AMOUNT)
    .offset(skip)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const d = doc.data()
        const id = doc.id
        const createdAt = d.createdAt.toDate()
        const updatedAt = d.updatedAt.toDate()
        const record = { ...d, id, createdAt, updatedAt } as Ama

        data.push(record)
      })
    })

  return data
}
