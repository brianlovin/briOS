import { getSession } from '@auth0/nextjs-auth0'

function isAuthenticated(req, res) {
  const session = getSession(req, res)
  return session?.user
}

export default async function context(ctx) {
  const user = isAuthenticated(ctx.req, ctx.res)
  let viewer = null
  if (user) {
    viewer = await prisma.user.findUnique({ where: { twitterId: user.sub } })
  }
  return {
    viewer,
  }
}
