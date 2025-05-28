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
let isAnonymousAuthEnabled = false; // Default to false until we confirm it works

// Basic mobile detection for UI adjustments only
const isMobile = typeof window !== 'undefined' ? 
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) : false;

try {
  // Initialize Firebase app
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  
  // Initialize Firestore and Auth
  db = getFirestore(app);
  auth = getAuth(app);
  
  // Configure domain authorization
  if (typeof window !== 'undefined') {
    configureDomainAuth();
  }
  
  // Try to enable persistence BEFORE any other Firestore operations
  if (typeof window !== 'undefined') {
    try {
      // Only try to enable persistence if we're in a browser environment
      enableIndexedDbPersistence(db).catch((err) => {
        // Silently handle persistence errors
      });
    } catch (persistenceError) {
      // Silently handle persistence errors
    }
  }
  
  // Anonymous authentication - moved after persistence setup
  if (typeof window !== 'undefined') {
    // Don't use async IIFE which can cause timing issues
    signInAnonymously(auth).then(() => {
      isAnonymousAuthEnabled = true;
    }).catch((error) => {
      // Handle anonymous auth errors silently
      if (error.code === 'auth/admin-restricted-operation') {
        isAnonymousAuthEnabled = false;
      }
    });
  }
} catch (error) {
  // Attempt to initialize again if failed - silently
  if (!app) app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  if (!db) db = getFirestore(app);
  if (!auth) auth = getAuth(app);
}

export { db, auth, isMobile, isAnonymousAuthEnabled } 
