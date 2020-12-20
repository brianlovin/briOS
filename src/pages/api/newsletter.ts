import fetch from 'isomorphic-unfetch'
import { sentryAPIHandler } from '~/graphql/services/sentry'
import { NextApiRequest, NextApiResponse } from 'next'

export default sentryAPIHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const LIST_ID = process.env.MAILCHIMP_LIST_ID
    const API_KEY = process.env.MAILCHIMP_API_KEY
    const DATACENTER = API_KEY.split('-')[1]

    const data = {
      email_address: email,
      status: 'subscribed',
    }

    const response = await fetch(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
      {
        body: JSON.stringify(data),
        headers: {
          Authorization: `apikey ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }
    ).then((res) => res.json())

    if (response.status === 400 && response.title === 'Member Exists') {
      return res.status(400).json({
        error: null,
      })
    }

    if (response.status >= 400) {
      return res.status(400).json({
        error:
          'Hm, couldn’t add you to the newsletter - ping me directly at hi@brianlovin.com and I’ll add you to this list!',
      })
    }

    return res.status(201).json({ error: '' })
  }
)
