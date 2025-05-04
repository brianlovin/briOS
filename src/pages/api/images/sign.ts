import fetch from 'isomorphic-unfetch'
import { NextApiRequest, NextApiResponse } from 'next'

import { UserRole } from '~/graphql/types.generated'
import { prisma } from '~/lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  async function isAuthenticated(req, res) {
    // TODO: Replace with your new authentication method
    return null
  }

  async function getIsAdmin(req, res) {
    const sessionToken = await isAuthenticated(req, res)
    if (!sessionToken) return false

    const viewer = await prisma.user.findUnique({
      where: { twitterId: sessionToken.userId },
    })

    return viewer?.role === UserRole.Admin
  }

  const isAdmin = await getIsAdmin(req, res)
  if (!isAdmin) {
    return res.status(401).json({ uploadURL: null })
  }

  const CLOUDFLARE_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/direct_upload`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_KEY}`,
  }

  const data = await fetch(CLOUDFLARE_URL, { method: 'POST', headers }).then(
    (res) => res.json()
  )

  const { uploadURL } = data.result

  return res.status(200).json({ uploadURL })
}
