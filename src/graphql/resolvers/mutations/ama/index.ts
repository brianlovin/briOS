import { baseUrl } from '~/config/seo'
import { AMA_QUESTIONS_COLLECTION, IS_PROD } from '~/graphql/constants'
import { db } from '~/graphql/services/firebase'
import { emailMe } from '~/graphql/services/postmark'
import fetch from 'node-fetch'
import {
  MutationAddAmaQuestionArgs,
  MutationDeleteAmaQuestionArgs,
  MutationEditAmaQuestionArgs,
  MutationTranscribeAudioArgs,
} from '~/graphql/types.generated'
import { sanitizeAmaDocument } from '~/graphql/helpers/sanitizeAmaDocument'
import { Context } from '~/graphql/context'

export async function editAMAQuestion(_, args: MutationEditAmaQuestionArgs) {
  const { id, question, answer, status, audioWaveform } = args
  const docRef = db.collection(AMA_QUESTIONS_COLLECTION).doc(id)
  await docRef.update({
    question,
    answer,
    status,
    audioWaveform,
    updatedAt: new Date(),
  })

  const res = await docRef.get().then((doc) => doc.data())
  const createdAt = res.createdAt.toDate()
  const updatedAt = res.updatedAt.toDate()
  return { ...res, createdAt, updatedAt, id }
}

export async function addAMAQuestion(
  _,
  args: MutationAddAmaQuestionArgs,
  ctx: Context
) {
  const { text } = args
  const { viewer, prisma } = ctx

  emailMe({
    subject: `AMA: ${text}`,
    body: `${text}\n\n${baseUrl}/ama`,
  })

  return await prisma.question
    .create({
      data: {
        text,
        userId: viewer.id,
      },
    })
    .then(() => true)
}

export async function deleteAMAQuestion(
  _,
  { id }: MutationDeleteAmaQuestionArgs
) {
  const docRef = db.collection(AMA_QUESTIONS_COLLECTION).doc(id)
  return await docRef.delete().then(() => true)
}

export async function addAMAReaction(_, { id }) {
  const docRef = db.collection(AMA_QUESTIONS_COLLECTION).doc(id)
  const doc = await docRef.get().then((doc) => doc.data())

  const count = doc.reactions ? doc.reactions + 1 : 1

  await docRef.update({
    reactions: count,
  })

  const res = await docRef.get().then((doc) => doc.data())
  const sanitizedAmaDocument = await sanitizeAmaDocument(doc, id)
  return { ...res, id, ...sanitizedAmaDocument }
}

export async function addAMAAudioPlay(_, { id }) {
  const docRef = db.collection(AMA_QUESTIONS_COLLECTION).doc(id)
  const doc = await docRef.get().then((doc) => doc.data())
  const count = doc.playCount ? doc.playCount + 1 : 1

  await docRef.update({
    playCount: count,
  })

  return true
}

export async function transcribeAudio(_, { url }: MutationTranscribeAudioArgs) {
  const baseUrl = `https://api.assemblyai.com/v2/transcript`
  const headers = {
    authorization: process.env.ASSEMBLY_API_KEY,
    'Content-Type': 'application/json',
  }
  const body = { audio_url: url }

  return await fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  })
    .then((t) => t.json())
    .then((t) => {
      if (t.error) return null
      return t.id
    })
}
