import { storage } from '~/graphql/services/firebase'
import {
  Ama,
  QueryAmaQuestionArgs,
  QueryAmaQuestionsArgs,
  QuerySignedPlaybackUrlArgs,
  QuerySignedUploadUrlArgs,
  QueryTranscriptionArgs,
} from '~/graphql/types.generated'
import { AUDIO_STORAGE_BUCKET } from '~/graphql/constants'
import { sanitizeAmaDocument } from '~/graphql/helpers/sanitizeAmaDocument'
import { Context } from '~/graphql/context'

async function fetchAudioPlaybackUrl(id) {
  const bucket = storage.bucket(AUDIO_STORAGE_BUCKET)
  const url = await bucket
    .file(id)
    .getSignedUrl({
      expires: Date.now() + 60 * 60 * 1000, // one hour
      action: 'read',
    })
    .then((r) => r[0])
    .catch((e) => {
      console.error({ e })
      return null
    })
  return await Promise.resolve(url)
}

export async function getAMAQuestion(
  _,
  { id }: QueryAmaQuestionArgs,
  ctx: Context
) {
  const { prisma } = ctx
  return await prisma.question.findUnique({ where: { id } })
}

export async function getAMAQuestions(
  _,
  args: QueryAmaQuestionsArgs,
  ctx: Context
) {
  const { skip, status } = args
  const { viewer, prisma } = ctx
  return await prisma.question.findMany()
}

export async function getSignedUploadUrl(
  _,
  { id }: QuerySignedUploadUrlArgs,
  { isMe }
) {
  if (!isMe) return null

  const bucket = storage.bucket(AUDIO_STORAGE_BUCKET)
  const file = bucket.file(id)
  const options = {
    expires: Date.now() + 1 * 60 * 1000, // 1 minute
    fields: { 'x-goog-meta-test': 'data' },
  }

  const [response] = await file.generateSignedPostPolicyV4(options)
  return JSON.stringify(response)
}

export async function getSignedPlaybackUrl(
  _,
  { id }: QuerySignedPlaybackUrlArgs
) {
  return await fetchAudioPlaybackUrl(id)
}

export async function getTranscription(
  _,
  { transcriptionId }: QueryTranscriptionArgs,
  { isMe }
) {
  if (!isMe) return null

  const baseUrl = `https://api.assemblyai.com/v2/transcript/${transcriptionId}`
  const headers = {
    authorization: process.env.ASSEMBLY_API_KEY,
    'Content-Type': 'application/json',
  }

  const transcript = await fetch(baseUrl, {
    method: 'GET',
    headers,
  }).then((t) => t.json())

  if (transcript.error) {
    return `Error generating transcription: ${transcript.error}`
  }

  if (transcript.status !== 'completed') {
    return null
  }

  const paragraphTranscript = await fetch(`${baseUrl}/paragraphs`, {
    method: 'GET',
    headers,
  }).then((t) => t.json())

  const cleanedText = paragraphTranscript.paragraphs
    .reduce((acc, cur) => {
      return (acc += cur.text += '\n\n')
    }, '')
    .trim()

  return cleanedText
}

export async function getQuestionAuthor(parent: Ama, _, ctx: Context) {
  const { id } = parent
  const { prisma } = ctx

  return await prisma.question.findUnique({ where: { id } }).author()
}

export async function getQuestionComments(parent: Ama, _, ctx: Context) {
  const { id } = parent
  const { prisma } = ctx

  return await prisma.question.findUnique({ where: { id } }).comments()
}
