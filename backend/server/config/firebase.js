import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();
let firebaseApp;

try {
    if (process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY) {

        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            })
        });

        console.log('Firebase initialized from environment variables');
    }
    else {
        const serviceAccount = await import('./serviceAccountKey.json', {
            assert: { type: 'json' }
        });

        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount.default)
        });

        console.log('Firebase initialized from service account file');
    }
} catch (error) {
    console.error('Firebase initialization failed:', error.message);
}

export default firebaseApp;
