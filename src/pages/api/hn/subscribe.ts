import { NextApiRequest, NextApiResponse } from 'next'
import db from '~/graphql/services/firebase'
import { validEmail } from './unsubscribe'
import { sentryAPIHandler } from '~/graphql/services/sentry'

export default sentryAPIHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { email } = req.body

    if (!email || !validEmail(email)) {
      return res.status(500).json({ error: 'Valid email is required' })
    }

    const ref = db.collection('hnsubscribers')

    const exists = await ref
      .where('email', '==', email)
      .get()
      .then((snapshot) => !snapshot.empty)

    if (exists) return res.status(500).json({ error: 'Already subscribed!' })

    await ref.add({ email })
    return res.status(200).json({ error: '' })
  }
)
