import { baseUrl } from '~/config/seo'

export const IS_PROD = process.env.NODE_ENV === 'production'
export const CLIENT_URL = IS_PROD ? baseUrl : 'http://localhost:3000'
export const PAGINATION_AMOUNT = 24

export const RATE_LIMIT_REQUEST_AMOUNT = 256
export const RATE_LIMIT_REQUEST_DURATION = 10 * 1000 // 10 seconds

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'
