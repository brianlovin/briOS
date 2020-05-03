import { ApolloServer } from 'apollo-server-micro'
import typeDefs from '~/graphql/schema'
import resolvers from '~/graphql/resolvers'
import context from '~/graphql/context'
import withCookies from '~/graphql/api/withCookies'

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
})

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = apolloServer.createHandler({ path: '/api/graphql' })

// attach cookie helpers to all response
export default withCookies(handler)
