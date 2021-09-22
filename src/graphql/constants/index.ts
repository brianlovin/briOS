import { baseUrl } from '~/config/seo'

export const IS_PROD = process.env.NODE_ENV === 'production'
export const CLIENT_URL = IS_PROD ? baseUrl : 'http://localhost:3000'
export const PAGINATION_AMOUNT = 16

export const RATE_LIMIT_REQUEST_AMOUNT = 24
export const RATE_LIMIT_REQUEST_DURATION = 60 * 1000 // 1 minute

export const AUDIO_STORAGE_BUCKET = IS_PROD ? 'audio-ama' : 'audio-ama-dev'
export const AMA_QUESTIONS_COLLECTION = IS_PROD ? 'questions' : 'questions-dev'
export const BOOKMARKS_COLLECTION = IS_PROD ? 'bookmarks' : 'bookmarks-dev'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'
