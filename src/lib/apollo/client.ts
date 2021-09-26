import { useMemo } from 'react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  ServerError,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import toast from 'react-hot-toast'
import { CLIENT_URL, APOLLO_STATE_PROP_NAME } from '~/graphql/constants'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'

const GRAPHQL_ENDPOINT = `${CLIENT_URL}/api/graphql`

global.fetch = require('node-fetch')
let apolloClient

function createIsomorphLink() {
  if (typeof window === 'undefined') {
    // These have to imported dynamically, instead of at the root of the page,
    // in order to make sure that we're not shipping server-side code to the client
    // eslint-disable-next-line
    const { SchemaLink } = require('@apollo/link-schema')
    // eslint-disable-next-line
    const { schema } = require('~/graphql/schema')
    return new SchemaLink({ schema, context: { isMe: false } })
  } else {
    return new HttpLink({
      uri: GRAPHQL_ENDPOINT,
      credentials: 'same-origin',
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
        keyFields: ['id', 'url'],
        fields: {
          id: {
            merge: false,
          },
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

export function initApolloClient(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initApolloClient(state), [state])
  return store
}
