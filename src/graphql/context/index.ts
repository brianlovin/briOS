import Cryptr from 'cryptr'

function isAuthenticated(req) {
  const { session } = req?.cookies
  if (!session || session.length < 32) {
    return false
  }

  const secret = process.env.PASSWORD_TOKEN
  const validated = process.env.PASSWORD
  const cryptr = new Cryptr(secret)
  const decrypted = cryptr.decrypt(session)
  return decrypted === validated
}

export default function context(ctx) {
  return {
    cookie: ctx.res.cookie,
    isMe: isAuthenticated(ctx.req),
  }
}
