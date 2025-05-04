import { AuthenticationError } from 'apollo-server-micro'

export function requiresAdmin(fn) {
  return function resolve() {
    throw new AuthenticationError('You can’t do that!')
  }
}
