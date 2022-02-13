import { NextApiRequest, NextApiResponse } from 'next'

import { authik } from '~/lib/authik/server'
import { syncUser } from '~/lib/authik/syncUser'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await authik.handleCallback(req, res)
  if (result.ok) {
    const login = result.login
    if (login.status === 'failed') {
      res.redirect(`/?error_code=${login.failure.code}`)
    } else if (login.status === 'succeeded') {
      await syncUser(login.user)
      res.redirect((req.query['return_to'] as string) || '/')
    }
  } else {
    res.redirect(`/?error_code=${result.error.code}`)
  }
}
