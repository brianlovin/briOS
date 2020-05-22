import format from 'date-fns/format'
import Cryptr from 'cryptr'
import { getHNPostsForDigest } from '~/graphql/services/hn'
import { sendHNDigest } from '~/graphql/services/postmark'
import db from '~/graphql/services/firebase'
import { NowRequest, NowResponse } from '@now/node'
import { validEmail } from './unsubscribe'

export default async (req: NowRequest, res: NowResponse) => {
  const posts = await getHNPostsForDigest('top')
  const date = format(new Date(), 'LLLL do, yyyy')
  const secret = process.env.HN_TOKEN
  const cryptr = new Cryptr(secret)
  const { token } = req.query

  if (!token || token !== secret) {
    return res.status(500).json({ error: 'Invalid token' })
  }

  await db
    .collection('hnsubscribers')
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const user = doc.data()

        if (!validEmail(user.email)) return

        const unsubscribeToken = cryptr.encrypt(user.email)
        const unsubscribe_url = `https://brianlovin.com/api/hn/unsubscribe?token=${unsubscribeToken}`

        return sendHNDigest({
          email: user.email,
          date,
          posts,
          unsubscribe_url,
        })
      })
    })

  return res.status(200).json({ status: 'done' })
}
