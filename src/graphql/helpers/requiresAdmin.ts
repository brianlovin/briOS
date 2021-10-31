import { AuthenticationError } from 'apollo-server-micro'

import { UserRole } from '../types.generated'

export function requiresAdmin(fn) {
  return function resolve(parent, args, context) {
    if (context?.viewer?.role === UserRole.Admin) {
      return fn(parent, args, context)
    }

    throw new AuthenticationError('You can’t do that!')
  }
}
