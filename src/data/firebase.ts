import admin from 'firebase-admin'

const { apps } = admin

let creds = JSON.parse(process.env.FIREBASE_CREDENTIALS, null)
creds.private_key = process.env.FIREBASE_PRIVATE_KEY

if (!apps.length) {
  admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(creds)
  });
}

let db = admin.firestore();

export default db