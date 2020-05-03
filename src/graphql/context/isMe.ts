import Cryptr from 'cryptr'

export function isAuthenticated(req) {
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
