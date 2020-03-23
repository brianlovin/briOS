import { request } from 'graphql-request'
import useSWR from 'swr'

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

export const swr = ({ query, variables = {}, initialData = null }) => {
  return useSWR(query, query => fetcher(query, variables), {
    initialData,
    revalidateOnFocus: false
  })
}