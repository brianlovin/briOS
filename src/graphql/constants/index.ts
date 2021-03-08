import { baseUrl } from '~/config/seo'

export const CLIENT_URL =
  process.env.NODE_ENV === 'production' ? baseUrl : 'http://localhost:3000'

export const PAGINATION_AMOUNT = 16
