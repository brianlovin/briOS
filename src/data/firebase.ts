import admin from 'firebase-admin'
import creds from './service-account'

const { apps } = admin

if (!apps.length) {
  admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(creds)
  });
}

let db = admin.firestore();

export default db