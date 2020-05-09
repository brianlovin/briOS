import * as postmark from 'postmark'

const client = new postmark.ServerClient(process.env.POSTMARK_CLIENT_ID)

export function emailMe({ subject, body }) {
  return client.sendEmail({
    From: 'hi@brianlovin.com',
    To: 'hi@brianlovin.com',
    Subject: subject,
    TextBody: body,
  })
}
