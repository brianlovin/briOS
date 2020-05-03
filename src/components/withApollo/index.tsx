import * as React from 'react'
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client'
import { endpoint } from '~/graphql/api'

// ensure that queries can run on the server during SSR and SSG
// @ts-ignore
global.fetch = require('node-fetch')

let globalApolloClient

function initApolloClient(initialState) {
  if (!globalApolloClient) {
    globalApolloClient = new ApolloClient({
      link: new HttpLink({
        uri: endpoint,
      }),
      cache: new InMemoryCache().restore(initialState || {}),
    })
  }
  // client side page transition to an SSG page => update Apollo cache
  else if (initialState) {
    globalApolloClient.cache.restore({
      ...globalApolloClient.cache.extract(),
      ...initialState,
    })
  }

  return globalApolloClient
}

export function withApollo(PageComponent) {
  // eslint-disable-next-line
  const WithApollo = ({ apolloStaticCache, ...pageProps }) => {
    // HERE WE USE THE PASSED CACHE
    const client = initApolloClient(apolloStaticCache)
    // and here we have the initialized client 🙂
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    )
  }

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName =
      PageComponent.displayName || PageComponent.name || 'Component'

    WithApollo.displayName = `withApollo(${displayName})`
  }

  return WithApollo
}
