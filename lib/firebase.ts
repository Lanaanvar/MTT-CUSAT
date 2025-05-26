import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, enableIndexedDbPersistence, Firestore } from 'firebase/firestore'
import { getAuth, Auth, signInAnonymously } from 'firebase/auth'
import { configureDomainAuth } from './firebaseConfig'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase with fallback handling
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

// Basic mobile detection for UI adjustments only
const isMobile = typeof window !== 'undefined' ? 
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) : false;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
  
  // Sign in anonymously for Firestore access
  if (typeof window !== 'undefined') {
    signInAnonymously(auth)
      .then(() => {
        console.log("Signed in anonymously for Firestore access");
      })
      .catch((error) => {
        console.error("Anonymous auth error:", error);
      });
  }
  
  // Configure domain authorization
  if (typeof window !== 'undefined') {
    configureDomainAuth();
  }
  
  // Enable offline persistence for Firestore
  if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db)
      .then(() => {
        console.log("Persistence enabled");
      })
      .catch((err) => {
        console.warn("Persistence could not be enabled:", err.code);
      });
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // Attempt to initialize again if failed
  if (!app) app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  if (!db) db = getFirestore(app);
  if (!auth) auth = getAuth(app);
}

export { db, auth, isMobile } 
