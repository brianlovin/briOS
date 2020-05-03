import { onError } from '@apollo/link-error'
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  DefaultOptions,
} from '@apollo/client'
import { CLIENT_URL } from '../constants'

// ensure that queries can run on the server during SSR and SSG
// @ts-ignore
global.fetch = require('node-fetch')

export const endpoint = `${CLIENT_URL}/api/graphql`

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => console.warn(message))
  }
  if (networkError) console.warn(networkError)
})

const httpLink = new HttpLink({
  uri: endpoint,
})

export const link = ApolloLink.from([errorLink, httpLink])

export const cache = new InMemoryCache()

export const defaultOptions: DefaultOptions = {
  query: {
    fetchPolicy: 'cache-first',
  },
  mutate: {
    errorPolicy: 'all',
  },
}

export async function getStaticApolloClient() {
  return new ApolloClient({
    link,
    cache,
    defaultOptions,
  })
}
