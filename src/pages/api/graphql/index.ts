import { ApolloServer } from 'apollo-server-micro'
const cors = require('micro-cors')();
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

export default cors((req, res) => req.method === 'OPTIONS' ? res.end() : handler(req, res))