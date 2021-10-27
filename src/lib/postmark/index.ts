import * as postmark from 'postmark'

import { baseEmail } from '~/config/seo'
import { IS_PROD } from '~/graphql/constants'

export const client = new postmark.ServerClient(process.env.POSTMARK_CLIENT_ID)

interface EmailMeProps {
  subject: string
  body: string
}

export function emailMe({ subject, body }: EmailMeProps) {
  if (!IS_PROD) {
    return console.log('Sending Postmark email: ', {
      From: baseEmail,
      To: baseEmail,
      Subject: subject,
      TextBody: body,
    })
  }

  return client.sendEmail({
    From: baseEmail,
    To: baseEmail,
    Subject: subject,
    TextBody: body,
  })
}
