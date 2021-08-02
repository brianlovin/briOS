import { baseUrl } from '~/config/seo'

export const IS_PROD = process.env.NODE_ENV === 'production'
export const CLIENT_URL = IS_PROD ? baseUrl : 'http://localhost:3000'
export const AUDIO_STORAGE_BUCKET = IS_PROD ? 'audio-ama' : 'audio-ama-dev'
export const PAGINATION_AMOUNT = 16
