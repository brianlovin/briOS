import { AuthenticationError } from 'apollo-server-micro'

export function requiresUser(fn) {
  return function resolve(parent, args, context) {
    if (context?.viewer?.id) return fn(parent, args, context)
    throw new AuthenticationError('You must be signed in to do that.')
  }
}
