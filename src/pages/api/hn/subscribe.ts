import { NowRequest, NowResponse } from '@now/node'
import db from '~/graphql/services/firebase'
import { validEmail } from './unsubscribe'

export default async (req: NowRequest, res: NowResponse) => {
  const { email } = req.body

  if (!email || !validEmail(email)) {
    return res.status(500).json({ error: 'Valid email is required' })
  }

  const ref = db.collection('hnsubscribers')

  try {
    const exists = await ref
      .where('email', '==', email)
      .get()
      .then((snapshot) => !snapshot.empty)

    if (exists) return res.status(500).json({ error: 'Already subscribed!' })

    await ref.add({ email })
    return res.status(200).json({ error: '' })
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
