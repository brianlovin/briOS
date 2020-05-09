import * as React from 'react'
import { ApolloProvider } from '@apollo/client'
import { initApolloClient } from '~/graphql/services/apollo'

/*
  This wrapper helps to provide Apollo functionality during SSR, while rehydrating
  on the client with a pre-populated cache of the query results.

  Refer to https://github.com/zeit/next.js/blob/canary/examples/api-routes-apollo-server-and-client/apollo/client.js
  for more source.
*/

export function withApollo(PageComponent) {
  // eslint-disable-next-line
  const WithApollo = ({ apolloStaticCache, ...pageProps }) => {
    // apolloStaticCache prop gets set in getStaticProps on page views
    const client = initApolloClient(apolloStaticCache)
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
