import { Authik } from '@authik/next/server'

export const authik = new Authik(
  process.env.AUTHIK_SECRET_KEY,
  process.env.AUTHIK_AUTH_DOMAIN
)
