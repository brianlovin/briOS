import twilio from 'twilio'
const MessagingResponse = twilio.twiml.MessagingResponse
import { URL } from 'url'

import db from '~/graphql/services/firebase'

const stringIsAValidUrl = (s) => {
  try {
    new URL(s)
    return true
  } catch (err) {
    return false
  }
}

export default async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    const twilioSignature = req.headers['x-twilio-signature']
    const params = req.body
    const webhookUrl = 'https://paulowe.com/api/bookmarks/add'

    const requestIsValid = twilio.validateRequest(
      process.env.TWILIO_AUTH_TOKEN,
      twilioSignature,
      webhookUrl,
      params
    )

    if (!requestIsValid) {
      return res.status(500).json({ error: '🙅‍♂️' })
    }
  }

  const twiml = new MessagingResponse()
  const { Body, From } = req.body

  if (!Body || !From) {
    return res.status(500).json({ error: 'Accessed without SMS' })
  }

  if (From !== `+${process.env.MY_PHONE_NUMBER}`) {
    return res.status(500).json({ error: 'Wrong number, nice try!' })
  }

  if (!stringIsAValidUrl(Body)) {
    twiml.message('Invalid url 🙅‍♂️')
    res.writeHead(200, { 'Content-Type': 'text/xml' })
    return res.end(twiml.toString())
  }

  const url = Body
  const existingRef = await db
    .collection('bookmarks')
    .where('url', '==', url)
    .get()
    .then((snapshot) => !snapshot.empty)

  if (existingRef) {
    twiml.message('🧠 Already bookmarked')
    res.writeHead(200, { 'Content-Type': 'text/xml' })
    return res.end(twiml.toString())
  }

  await db.collection('bookmarks').add({ url, createdAt: new Date() })
  res.writeHead(200, { 'Content-Type': 'text/xml' })
  return res.end()
}
