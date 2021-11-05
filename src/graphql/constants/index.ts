import { baseUrl } from '~/config/seo'

export const IS_PROD = process.env.NODE_ENV === 'production'
export const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export const GRAPHCDN_ENDPOINT = 'https://brios.graphcdn.app'
export const GRAPHCDN_PURGE_ENDPOINT = 'https://admin.graphcdn.io/brios'
export const CLIENT_URL = IS_PROD ? baseUrl : 'http://localhost:3000'
export const PAGINATION_AMOUNT = 24

export const RATE_LIMIT_REQUEST_AMOUNT = 1024
export const RATE_LIMIT_REQUEST_DURATION = 10 * 1000 // 10 seconds

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'
