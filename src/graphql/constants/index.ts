import { baseUrl } from '~/config/seo'

export const CLIENT_URL =
  process.env.NODE_ENV === 'production' ? baseUrl : 'http://localhost:3000'

export const GRAPHQL_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://graphcdn.brianlovin.com'
    : 'http://localhost:3000/api/graphql'

export const PAGINATION_AMOUNT = 16
