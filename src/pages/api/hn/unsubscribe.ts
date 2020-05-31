import { NextApiRequest, NextApiResponse } from 'next'
import Cryptr from 'cryptr'
import db from '~/graphql/services/firebase'
import { sentryAPIHandler } from '~/graphql/services/sentry'

export function validEmail(email) {
  // eslint-disable-next-line
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export default sentryAPIHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { token } = req.query

    function done() {
      res.writeHead(301, { Location: 'https://brianlovin.com/hn' })
      res.end()
    }

    if (!token) {
      return done()
    }

    const secret = process.env.HN_TOKEN
    const cryptr = new Cryptr(secret)
    const decrypted = cryptr.decrypt(token)

    if (!validEmail(decrypted)) {
      return done()
    }

    await db
      .collection('hnsubscribers')
      .where('email', '==', decrypted)
      .get()
      .then((snapshot) => {
        snapshot.forEach(async (doc) => {
          const id = doc.id
          await db.collection('hnsubscribers').doc(id).delete()
        })
      })

    return done()
  }
)
