import admin from 'firebase-admin'
import serviceAccount from '~/data/service-account'

const { apps } = admin

if (!apps.length) {
  admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(serviceAccount)
  });
}

let db = admin.firestore();

export default db