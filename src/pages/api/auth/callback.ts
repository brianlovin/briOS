import { NextApiRequest, NextApiResponse } from 'next'

import { authik } from '~/lib/authik/server'
import { syncUser } from '~/lib/authik/syncUser'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { login, error } = await authik.handleCallback(req, res)
  if (error) {
    res.redirect(`/?errorCode=${error.code}`)
  } else if (login) {
    if (login.status === 'failed') {
      res.redirect(`/?errorCode=${login.failure.code}`)
    } else if (login.status === 'succeeded') {
      await syncUser(login.user)
      res.redirect(login.external_account.redirect_url || '/')
    }
  }
}
