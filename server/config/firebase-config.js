import admin from 'firebase-admin';

const base64 = process.env.FIREBASE_ADMIN_SDK;
const decoded = Buffer.from(base64, 'base64').toString('utf8');
const serviceAccount = JSON.parse(decoded);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin; 