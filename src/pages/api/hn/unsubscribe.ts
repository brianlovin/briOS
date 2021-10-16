import { NextApiRequest, NextApiResponse } from 'next'
import Cryptr from 'cryptr'
import { db } from '~/graphql/services/firebase'
import { baseUrl } from '~/config/seo'
import { validEmail } from '~/lib/validators'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query

  function done() {
    res.writeHead(301, { Location: `${baseUrl}/hn` })
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
