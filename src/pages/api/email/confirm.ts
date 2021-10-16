import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { prisma } from '~/lib/prisma/client'
import { baseUrl } from '~/config/seo'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query

  function done(path = '/settings') {
    res.writeHead(301, { Location: `${baseUrl}${path}` })
    res.end()
  }

  function error(error) {
    res.status(200).json({ error })
  }

  if (!token) {
    error('No token found in the request.')
  }

  try {
    // @ts-ignore
    const decoded = jwt.verify(token, process.env.JWT_SIGNING_KEY)
    const { userId, pendingEmail } = decoded

    if (!userId || !pendingEmail) {
      error('Invalid token')
    }

    const [user, userByEmail] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: userId,
        },
      }),
      await prisma.user.findUnique({
        where: {
          email: pendingEmail,
        },
      }),
    ])

    if (!user) {
      done('/')
    }

    if (userByEmail && userByEmail.id !== user.id) {
      // user is trying to change their email to an email that another user
      // already uses
      error('Email already in use, try using a different email')
    }

    if (!user.pendingEmail || user.pendingEmail !== pendingEmail) {
      // user didn't have a pending email, or pending email doesn't match the token
      // so they might be clicking an expired link
      error('Email is no longer pending, this link may be expired')
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: pendingEmail,
        pendingEmail: null,
      },
    })

    done()
  } catch (err) {
    error(err.message)
  }
}
