import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { prisma } from '~/lib/prisma'
import { baseUrl } from '~/config/seo'
import { validEmail } from '~/lib/validators'
import { EmailSubscriptionType } from '.prisma/client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query

  function done() {
    res.writeHead(301, { Location: `${baseUrl}/hn` })
    res.end()
  }

  function error(error) {
    res.status(200).json({ error })
  }

  if (!token) {
    return done()
  }

  try {
    // @ts-ignore
    const decoded = jwt.verify(token, process.env.JWT_SIGNING_KEY)
    const { email } = decoded

    if (!email) {
      error('Invalid token')
    }

    if (!validEmail(email)) {
      error('Invalid email')
    }

    await prisma.emailSubscription.delete({
      where: {
        emailAndType: {
          email,
          type: EmailSubscriptionType.HACKER_NEWS,
        },
      },
    })

    done()
  } catch (err) {
    error(err.message)
  }
}
