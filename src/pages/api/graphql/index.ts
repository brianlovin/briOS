import { ApolloServer } from 'apollo-server-micro'

import context from '~/graphql/context'
import withRateLimit from '~/graphql/helpers/withRateLimit'
import resolvers from '~/graphql/resolvers'
import typeDefs from '~/graphql/typeDefs'

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  uploads: false,
  subscriptions: false,
  introspection: true,
})

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = apolloServer.createHandler({ path: '/api/graphql' })

export default withRateLimit(handler)
