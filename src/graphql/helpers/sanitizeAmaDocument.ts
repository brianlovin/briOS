import { storage } from '~/graphql/services/firebase'
import { AUDIO_STORAGE_BUCKET } from '../constants'

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

export async function sanitizeAmaDocument(document, id) {
  const createdAt = document.createdAt.toDate()
  const updatedAt = document.updatedAt.toDate()
  const audioUrl =
    document.audioWaveform?.length > 0 ? await fetchAudioPlaybackUrl(id) : null
  const audioPlayCount = document.audioPlayCount || 0
  const audioWaveform = document.audioWaveform || []

  return {
    createdAt,
    updatedAt,
    audioWaveform,
    audioUrl,
    audioPlayCount,
  }
}
