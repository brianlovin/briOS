import admin from 'firebase-admin'

const { apps } = admin

if (!apps.length) {
  admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIALS))
  });
}

let db = admin.firestore();

export default db