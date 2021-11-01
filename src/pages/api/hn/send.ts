import format from 'date-fns/format'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

import { baseEmail } from '~/config/seo'
import { CLIENT_URL, IS_PROD } from '~/graphql/constants'
import { EmailSubscriptionType } from '~/graphql/types.generated'
import { getHNPostsForDigest } from '~/lib/hn'
import { client as postmark } from '~/lib/postmark'
import { prisma } from '~/lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token, warmup } = req.query

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

  if (!token || token !== secret) {
    return res.status(500).json({ error: 'Invalid token' })
  }

  const posts = await getHNPostsForDigest('top')

  if (!posts || posts.length === 0) {
    return res.status(500).json({ error: 'No posts found for digest' })
  }

  const date = format(new Date(), 'LLLL do, yyyy')

  const subscribers = IS_PROD
    ? await prisma.emailSubscription.findMany({
        where: { type: EmailSubscriptionType.HackerNews },
      })
    : await prisma.emailSubscription.findMany({
        where: {
          email: baseEmail,
          type: EmailSubscriptionType.HackerNews,
        },
      })

  for (const subscriber of subscribers) {
    try {
      const unsubscribeToken = jwt.sign(
        { email: subscriber.email },
        process.env.JWT_SIGNING_KEY
      )

      const unsubscribe_url = `${CLIENT_URL}/api/hn/unsubscribe?token=${unsubscribeToken}`

      if (IS_PROD) {
        await postmark.sendEmailWithTemplate({
          From: baseEmail,
          To: subscriber.email,
          TemplateId: 18037634,
          TemplateModel: {
            date,
            posts,
            unsubscribe_url,
          },
        })
      } else {
        console.log('Sending HN digest email', {
          From: baseEmail,
          To: subscriber.email,
          TemplateId: 18037634,
          TemplateModel: {
            date,
            posts,
            unsubscribe_url,
          },
        })
      }
    } catch (err) {
      console.error('Error sending HN digest email: ', { subscriber, err })
    }
  }

  return res
    .status(200)
    .json({ status: 'done', emailsSent: subscribers.length })
}
