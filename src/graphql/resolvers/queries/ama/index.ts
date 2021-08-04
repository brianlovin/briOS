import { db, storage } from '~/graphql/services/firebase'
import {
  Ama,
  QueryAmaQuestionsArgs,
  QuerySignedPlaybackUrlArgs,
  QuerySignedUploadUrlArgs,
  QueryTranscriptionArgs,
} from '~/graphql/types.generated'
import {
  AUDIO_STORAGE_BUCKET,
  IS_PROD,
  PAGINATION_AMOUNT,
} from '~/graphql/constants'

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

export async function getAMAQuestions(
  _,
  args: QueryAmaQuestionsArgs,
  { isMe }
) {
  const COLLECTION = IS_PROD ? 'questions' : 'questions-dev'
  const { skip = 0, status = 'ANSWERED' } = args

  if (status === 'PENDING' && !isMe) return []

  const data = []

  async function processQuestions() {
    let collection = db.collection(COLLECTION)
    let questionsRef = await collection
      .where('status', '==', status)
      .orderBy('updatedAt', 'desc')
      .limit(PAGINATION_AMOUNT)
      .offset(skip)
      .get()
    for (let question of questionsRef.docs) {
      const d = question.data()
      const id = question.id
      const createdAt = d.createdAt.toDate()
      const updatedAt = d.updatedAt.toDate()
      const audioUrl =
        d.audioWaveform?.length > 0 ? await fetchAudioPlaybackUrl(id) : null
      const audioPlayCount = d.audioPlayCount || 0
      const audioWaveform = d.audioWaveform || []
      const record = {
        ...d,
        id,
        createdAt,
        updatedAt,
        audioUrl,
        audioPlayCount,
        audioWaveform,
      } as Ama

      data.push(record)
    }
  }

  await processQuestions()
  return data
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
