import { AuthenticationError } from 'apollo-server-micro'

export function requiresAdmin(fn) {
  return function resolve(parent, args, context) {
    if (context?.viewer?.isAdmin) {
      return fn(parent, args, context)
    }

    throw new AuthenticationError('You can’t do that!')
  }
}
