import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBh9xOfnwEk_yqBu1L7mVytarDOeSdnPuI",
    authDomain: "newsaxe-e64a2.firebaseapp.com",
    projectId: "newsaxe-e64a2",
    storageBucket: "newsaxe-e64a2.firebasestorage.app",
    messagingSenderId: "942052774764",
    appId: "1:942052774764:web:861d81d01d3fe2c0965949",
    measurementId: "G-3WB7NSYDS0"
};

import { getAnalytics, isSupported } from "firebase/analytics";

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

if (typeof window !== "undefined") {
    isSupported().then(yes => yes && getAnalytics(app));
}

export { auth, googleProvider };
