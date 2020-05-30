import Sentry from '~/sentry'
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'

export const captureException = Sentry.captureException

export function sentryAPIHandler(apiHandler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await apiHandler(req, res)
    } catch (error) {
      console.error({ error })
      Sentry.captureException(error)
      await Sentry.flush(2000)
      return res.status(500).json({ error })
    }
  }
}
