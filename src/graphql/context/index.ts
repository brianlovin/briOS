import { getSession } from '@auth0/nextjs-auth0'

function isAuthenticated(req, res) {
  const session = getSession(req, res)
  return session?.user
}

function isMe(user) {
  return user.sub === 'twitter|465068802'
}

export default function context(ctx) {
  const user = isAuthenticated(ctx.req, ctx.res)

  return {
    isMe: user && isMe(user),
  }
}
