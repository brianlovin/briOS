import { NextApiRequest, NextApiResponse } from 'next'

import { revue } from '~/lib/revue'
import { validEmail } from '~/lib/validators'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = JSON.parse(req.body)

  if (!validEmail(email)) {
    return res.status(200).json({ error: 'Invalid email' })
  }

  const data = await revue.addSubscriber({ email, doubleOptIn: true })

  return res.status(201).json({ data, error: '' })
}
