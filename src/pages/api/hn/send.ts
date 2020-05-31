import format from 'date-fns/format'
import Cryptr from 'cryptr'
import { NextApiRequest, NextApiResponse } from 'next'
import { getHNPostsForDigest } from '~/graphql/services/hn'
import { client as postmark } from '~/graphql/services/postmark'
import db from '~/graphql/services/firebase'
import { validEmail } from './unsubscribe'
import { sentryAPIHandler } from '~/graphql/services/sentry'

export default sentryAPIHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const COLLECTION = 'hnsubscribers'
    const { token, test, warmup } = req.query

    /*
      This API route is triggered from a GitHub action. Sometimes the function
      can take a while to warm up though, and will time out. If it times out,
      the action fails. So instead, in the action we actually send 2 requests - 
      the first warms up the route, the second actually processes the digest.
    */
    if (warmup) {
      return res.status(200).json({ status: 'Warmed up!' })
    }

    const secret = process.env.HN_TOKEN
    const cryptr = new Cryptr(secret)

    if (!token || token !== secret) {
      return res.status(500).json({ error: 'Invalid token' })
    }

    const posts = await getHNPostsForDigest('top')

    if (!posts || posts.length === 0) {
      return res.status(500).json({ error: 'No posts found for digest' })
    }

    const date = format(new Date(), 'LLLL do, yyyy')

    /* 
      Allow a &test=true query parameter to be sent in order to only trigger emails
      to myself. This is useful for debugging the API route in production. Alternatively,
      make sure to never send production emails to everyone when testing things locally.
    */
    const ref =
      test || process.env.NODE_ENV !== 'production'
        ? db.collection(COLLECTION).where('email', '==', 'hi@brianlovin.com')
        : db.collection(COLLECTION)

    let count = 0
    const usersSnapshot = await ref.get()

    for (const doc of usersSnapshot.docs) {
      const user = doc.data()

      if (validEmail(user.email)) {
        const unsubscribeToken = cryptr.encrypt(user.email)
        const unsubscribe_url = `https://brianlovin.com/api/hn/unsubscribe?token=${unsubscribeToken}`

        count = count + 1
        await postmark.sendEmailWithTemplate({
          From: 'hi@brianlovin.com',
          To: user.email,
          TemplateId: 18037634,
          TemplateModel: {
            date,
            posts,
            unsubscribe_url,
          },
        })
      }
    }

    return res.status(200).json({ status: 'done', emailsSent: count })
  }
)
