import { baseUrl } from '~/config/seo'

export const IS_PROD = process.env.NODE_ENV === 'production'
export const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export const CLIENT_URL = IS_PROD ? baseUrl : 'http://localhost:3000'
export const PAGINATION_AMOUNT = 24

export const RATE_LIMIT_REQUEST_AMOUNT = 24
export const RATE_LIMIT_REQUEST_DURATION = 60 * 1000 // 1 minute

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'
