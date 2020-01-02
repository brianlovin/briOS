const MessagingResponse = require('twilio').twiml.MessagingResponse;
const URL = require("url").URL;

import db from '~/data/firebase'

const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

export default async (req, res) => {
  const twiml = new MessagingResponse();
  const { Body, From } = req.body

  if (!Body || !From) {
    return res.status(500).json({ error: 'Accessed without SMS' })
  }

  if (From !== `+${process.env.MY_PHONE_NUMBER}`) {
    return res.status(500).json({ error: 'Wrong number, nice try!' })
  }

  if (!stringIsAValidUrl(Body)) {
    twiml.message('Invalid url 🙅‍♂️')
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    return res.end(twiml.toString());
  }


  const url = Body
  const existingRef = await db.collection('bookmarks').where('url', '==', url).get()
    .then(snapshot => !snapshot.empty)

  if (existingRef) {
    twiml.message('🧠 Already bookmarked');
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    return res.end(twiml.toString());
  }

  await db.collection('bookmarks').add({ url, createdAt: new Date() })
  twiml.message('✅ Saved');
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  return res.end(twiml.toString());
};