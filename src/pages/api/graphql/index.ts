import { ApolloServer } from 'apollo-server-micro'
import typeDefs from '~/graphql/schema'
import resolvers from '~/graphql/resolvers'
import context from '~/graphql/context'
import cookies from '~/graphql/api/cookies'

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

// attach cookie helpers to all response objects
export default cookies(handler)
