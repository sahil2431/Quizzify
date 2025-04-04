import admin from 'firebase-admin';
import serviceAccount from '../firebase-admin-sdk.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin; 