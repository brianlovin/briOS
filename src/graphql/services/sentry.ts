import * as Sentry from '@sentry/node'
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
})

export function sentryAPIHandler(apiHandler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await apiHandler(req, res)
    } catch (error) {
      console.error({ error })
      Sentry.captureException(error)
      await Sentry.flush(2000)
      return res.status(500).end()
    }
  }
}
