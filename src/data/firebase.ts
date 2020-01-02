import admin from 'firebase-admin'

const { apps } = admin

if (!apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('./service-account'))
  });
}

let db = admin.firestore();

export default db