import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, enableIndexedDbPersistence, Firestore } from 'firebase/firestore'
import { getAuth, Auth } from 'firebase/auth'
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

// Check if browser is mobile
const isMobile = typeof window !== 'undefined' ? 
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) : false;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
  
  // Configure domain authorization for auth
  if (typeof window !== 'undefined') {
    configureDomainAuth();
  }
  
  // Enable offline persistence for Firestore with error handling
  if (typeof window !== 'undefined') {
    // Only enable persistence in browser environment
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
