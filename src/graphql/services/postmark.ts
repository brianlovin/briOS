import * as postmark from 'postmark'
import { baseEmail } from '~/config/seo'
import { HNPost } from '~/pages/hn'

export const client = new postmark.ServerClient(process.env.POSTMARK_CLIENT_ID)

interface HNDigestProps {
  email: string
  date: string
  posts: HNPost[]
  unsubscribe_url: string
}

interface EmailMeProps {
  subject: string
  body: string
}

export function emailMe({ subject, body }: EmailMeProps) {
  return client.sendEmail({
    From: baseEmail,
    To: baseEmail,
    Subject: subject,
    TextBody: body,
  })
}
