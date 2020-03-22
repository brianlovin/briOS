import { ApolloServer } from 'apollo-server-micro'
import typeDefs from '~/graphql/typedefs'
import resolvers from '~/graphql/resolvers'

const apolloServer = new ApolloServer({ 
  typeDefs, 
  resolvers,
})

const handler = apolloServer.createHandler({ path: '/api/graphql' })

export const config = {
  api: {
    bodyParser: false,
  }
}

export default handler