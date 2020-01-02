import admin from 'firebase-admin'
import serviceAccount from '../../service-account'

const { apps } = admin

if (!apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

let db = admin.firestore();

export default db