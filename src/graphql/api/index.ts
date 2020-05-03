import { CLIENT_URL } from '../constants'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

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
