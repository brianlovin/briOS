import Cryptr from 'cryptr'

export function login(_, { password }, ctx) {
  const { cookie } = ctx

  if (!password) return false

  const validator = process.env.PASSWORD
  if (password !== validator) return false

  const secret = process.env.PASSWORD_TOKEN
  const cryptr = new Cryptr(secret)
  const encrypted = cryptr.encrypt(password)

  cookie('session', encrypted, {
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? 'brianlovin.com' : undefined,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
  })

  return true
}

export function logout(_, __, ctx) {
  const { cookie } = ctx

  cookie('session', null, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
  })

  return true
}
