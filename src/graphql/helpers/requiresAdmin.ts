import { AuthenticationError } from 'apollo-server-micro'

export function requiresAdmin(fn) {
  return function resolve(parent, args, context) {
    if (context?.viewer?.role === 'ADMIN') return fn(parent, args, context)
    throw new AuthenticationError('You can’t do that!')
  }
}
