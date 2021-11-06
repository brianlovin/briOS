import { baseUrl } from '~/config/seo'

export const IS_PROD = process.env.NODE_ENV === 'production'
export const IS_DEV = process.env.NODE_ENV === 'development'
export const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export const GRAPHCDN_PURGE_ENDPOINT = process.env.GRAPHCDN_PURGE_ENDPOINT
export const CLIENT_URL = IS_PROD ? baseUrl : 'http://localhost:3000'

export const GRAPHQL_ENDPOINT = IS_DEV
  ? '/api/graphql'
  : IS_PREVIEW
  ? `https://${process.env.VERCEL_URL}/api/graphql`
  : 'https://brios.brianlovin.com'

console.log({
  endpiont: GRAPHQL_ENDPOINT,
  isPreview: IS_PREVIEW,
  isProd: IS_PROD,
  env: process.env.GRAPHQL_ENDPOINT,
})

export const PAGINATION_AMOUNT = 24

export const RATE_LIMIT_REQUEST_AMOUNT = 1024
export const RATE_LIMIT_REQUEST_DURATION = 10 * 1000 // 10 seconds

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'
