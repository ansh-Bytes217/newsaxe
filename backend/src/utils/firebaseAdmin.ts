import admin from 'firebase-admin';
import Logger from '../utils/logger';

// Check if already initialized to avoid hot-reload errors
if (!admin.apps.length) {
    try {
        let serviceAccount;

        // Try loading from file first (Robust for local dev)
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            serviceAccount = require('../../serviceAccountKey.json');
        } catch (e) {
            // If file missing, fall back to ENV (Production)
            if (process.env.FIREBASE_SERVICE_ACCOUNT) {
                serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            }
        }

        if (serviceAccount) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            Logger.info('Firebase Admin Initialized');
        } else {
            Logger.warn('FIREBASE credentials missing (serviceAccountKey.json or ENV). Auth features will fail.');
        }
    } catch (error) {
        Logger.error('Firebase Admin Init Failed:', error);
    }
}

export default admin;
