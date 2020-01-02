import admin from 'firebase-admin'
let serviceAccount = require('../../service-account.json');

const { apps } = admin

if (!apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

let db = admin.firestore();

export default db