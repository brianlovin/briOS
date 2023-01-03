import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

export const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue(value: string | number | Date) {
    return new Date(value) // value from the client
  },
  serialize(value: Date) {
    return value.getTime() // value sent to the client
  },
  // @ts-ignore
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10) // ast value is always in string format
    }
    return null
  },
})
