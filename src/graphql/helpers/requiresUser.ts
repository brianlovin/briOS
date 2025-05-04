import { AuthenticationError } from 'apollo-server-micro'

export function requiresUser(fn) {
  return function resolve() {
    throw new AuthenticationError('You must be signed in to do that.')
  }
}
