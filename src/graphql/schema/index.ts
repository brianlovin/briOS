import { makeExecutableSchema } from '@graphql-tools/schema'
import typeDefs from '../typeDefs'
import resolvers from '../resolvers'

export const schema = makeExecutableSchema({ typeDefs, resolvers })
export default schema
