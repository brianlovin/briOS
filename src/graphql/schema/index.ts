import { makeExecutableSchema } from '@graphql-tools/schema'

import resolvers from '../resolvers'
import typeDefs from '../typeDefs'

export const schema = makeExecutableSchema({ typeDefs, resolvers })
