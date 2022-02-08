import { Authik } from '@authik/nextjs/client'

export const authik = new Authik(process.env.NEXT_PUBLIC_AUTHIK_PUBLIC_KEY, {
  callbackUrl: '/api/auth/callback',
})
