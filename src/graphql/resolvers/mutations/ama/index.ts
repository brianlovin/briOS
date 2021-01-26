import db from '~/graphql/services/firebase'
import { emailMe } from '~/graphql/services/postmark'

const COLLECTION = 'questions'

export async function editAMAQuestion(_, { id, question, answer, status }) {
  const docRef = db.collection(COLLECTION).doc(id)
  await docRef.update({ question, answer, status, updatedAt: new Date() })

  const res = await docRef.get().then((doc) => doc.data())
  const createdAt = res.createdAt.toDate()
  const updatedAt = res.updatedAt.toDate()
  return { ...res, createdAt, updatedAt, id }
}

export async function addAMAQuestion(_, { question }) {
  emailMe({
    subject: `AMA: ${question}`,
    body: `${question}\n\nhttps://paulowe.com/ama`,
  })

  return await db
    .collection(COLLECTION)
    .add({
      question,
      answer: null,
      status: 'PENDING',
      updatedAt: new Date(),
      createdAt: new Date(),
      reactions: 0,
    })
    .then(() => true)
}

export async function deleteAMAQuestion(_, { id }) {
  const docRef = db.collection(COLLECTION).doc(id)
  return await docRef.delete().then(() => true)
}

export async function addAMAReaction(_, { id }) {
  const docRef = db.collection(COLLECTION).doc(id)
  const doc = await docRef.get().then((doc) => doc.data())

  const count = doc.reactions ? doc.reactions + 1 : 1

  await docRef.update({
    reactions: count,
  })

  const res = await docRef.get().then((doc) => doc.data())
  const createdAt = res.createdAt.toDate()
  const updatedAt = res.updatedAt.toDate()
  return { ...res, createdAt, updatedAt, id }
}
