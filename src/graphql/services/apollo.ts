import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  ServerError,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import toast from 'react-hot-toast'
import { CLIENT_URL } from '~/graphql/constants'

// ensure that queries can run on the server during SSR and SSG
// @ts-ignore
global.fetch = require('node-fetch')
let globalApolloClient = null

export const endpoint = `${CLIENT_URL}/api/graphql`

function createIsomorphLink() {
  if (typeof window === 'undefined') {
    // These have to imported dynamically, instead of at the root of the page,
    // in order to make sure that we're not shipping server-side code to the client
    // eslint-disable-next-line
    const { SchemaLink } = require('@apollo/link-schema')
    // eslint-disable-next-line
    const { schema } = require('~/graphql/schema')
    return new SchemaLink({ schema, context: { isMe: false, cookie: null } })
  } else {
    return new HttpLink({
      uri: endpoint,
    })
  }
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      try {
        toast.error(message)
      } catch {
        console.error({ message })
      }
    })
  }

  if (networkError) {
    const err = networkError as ServerError
    try {
      toast.error(err.result.error)
    } catch {
      console.error({ err })
    }
  }
})

const link = ApolloLink.from([errorLink, createIsomorphLink()])

export function createApolloClient(initialState = {}) {
  const ssrMode = typeof window === 'undefined'
  const cache = new InMemoryCache({
    typePolicies: {
      Bookmark: {
        keyFields: ['url'],
        fields: {
          url: {
            merge: false,
          },
        },
      },
    },
  }).restore(initialState)

  return new ApolloClient({
    ssrMode,
    link,
    cache,
  })
}

export function initApolloClient(initialState = {}) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  // ref https://github.com/zeit/next.js/blob/canary/examples/api-routes-apollo-server-and-client/apollo/client.js
  if (typeof window === 'undefined') {
    return createApolloClient(initialState)
  }

  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState)
  }

  return globalApolloClient
}
