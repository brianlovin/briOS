import { baseUrl } from '~/config/seo'

export const IS_PROD = process.env.NODE_ENV === 'production'
export const VERCEL_PROD = process.env.VERCEL_ENV === 'production'
export const VERCEL_PREVIEW = process.env.VERCEL_ENV === 'preview'
export const GRAPHCDN_PURGE_ENDPOINT = process.env.GRAPHCDN_PURGE_ENDPOINT
export const CLIENT_URL = IS_PROD ? baseUrl : 'http://localhost:3000'

export const GRAPHQL_ENDPOINT = VERCEL_PREVIEW
  ? `https://${process.env.VERCEL_URL}/api/graphql`
  : VERCEL_PROD
  ? process.env.GRAPHCDN_ENDPOINT
  : '/api/graphql'

export const PAGINATION_AMOUNT = 24

export const RATE_LIMIT_REQUEST_AMOUNT = 1024
export const RATE_LIMIT_REQUEST_DURATION = 10 * 1000 // 10 seconds

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'
