import { request } from 'graphql-request'

const API = process.env.NODE_ENV === "production"
  ? 'https://brianlovin.com/api/graphql'
  : 'http://localhost:3000/api/graphql'

export const fetcher = query => request(API, query)