import { ApolloServer } from 'apollo-server-micro'
import typeDefs from '~/graphql/typeDefs'
import resolvers from '~/graphql/resolvers'
import context from '~/graphql/context'
import withCookies from '~/graphql/helpers/withCookies'

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  uploads: false,
  subscriptions: false,
})

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = apolloServer.createHandler({ path: '/api/graphql' })

// attach cookie helpers to all response
export default withCookies(handler)
