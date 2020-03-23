import { request } from 'graphql-request'

const API = process.env.NODE_ENV === "production"
  ? 'https://brianlovin.com/api/graphql'
  : 'http://localhost:3000/api/graphql'

export const fetcher = async (query, variables = {}) => {
  try {
    return await request(API, query, variables)
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
    return null
  }
}