import { CLIENT_URL } from '../constants'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { request } from 'graphql-request'

// ensure that queries can run on the server during SSR and SSG
// @ts-ignore
global.fetch = require('node-fetch')

export const endpoint =
  process.env.NODE_ENV === 'production'
    ? `${CLIENT_URL}/api/graphql`
    : `${CLIENT_URL}/api/graphql`

export async function getStaticApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: endpoint,
    }),
    cache: new InMemoryCache(),
  })
}

export const fetcher = async ({ query, variables = {} }) => {
  try {
    return await request(endpoint, query, variables)
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
    return null
  }
}
