import * as postmark from 'postmark'
import { HNPost } from '~/pages/hn'

const client = new postmark.ServerClient(process.env.POSTMARK_CLIENT_ID)

interface HNDigestProps {
  email: string
  date: string
  posts: HNPost[]
  unsubscribe_url: string
}

export function sendHNDigest(props: HNDigestProps) {
  const { email, ...rest } = props
  return client.sendEmailWithTemplate({
    From: 'hi@brianlovin.com',
    To: email,
    TemplateId: 18037634,
    TemplateModel: {
      ...rest,
    },
  })
}

interface EmailMeProps {
  subject: string
  body: string
}

export function emailMe({ subject, body }: EmailMeProps) {
  return client.sendEmail({
    From: 'hi@brianlovin.com',
    To: 'hi@brianlovin.com',
    Subject: subject,
    TextBody: body,
  })
}
