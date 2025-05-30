'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, signOut as firebaseSignOut, onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  uid: string;
  email: string | null;
  isAdmin: boolean;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Set up token refresh
  useEffect(() => {
    const auth = getAuth();
    
    // Listen for auth state changes
    const unsubscribeAuthState = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          // Create user object with Firebase auth data and Firestore data
          const user = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            isAdmin: userDoc.exists() ? userDoc.data()?.isAdmin || false : false,
            name: userDoc.exists() ? userDoc.data()?.name || '' : '',
            ...userDoc.exists() ? userDoc.data() : {}
          };
          
          setUser(user);
          setLoading(false);
        } else {
          // User is signed out
          setUser(null);
          // If on a protected route and no user, clear cookie and redirect
          if (pathname?.startsWith('/admin')) {
            Cookies.remove('session');
            router.push('/login');
          }
          setLoading(false);
        }
      } catch (error) {
        // Handle error silently
        setUser(null);
        setLoading(false);
      }
    });

    // Handle token changes (refresh)
    const unsubscribeIdToken = onIdTokenChanged(auth, async (user) => {
      if (user) {
        // Get the new token and update the cookie
        const token = await user.getIdToken();
        Cookies.set('session', token, { expires: 7 });
      } else {
        Cookies.remove('session');
      }
    });

    // Set up periodic token refresh (every 55 minutes - Firebase tokens last 60 minutes)
    let tokenRefreshInterval: NodeJS.Timeout;
    
    const setupTokenRefresh = () => {
      tokenRefreshInterval = setInterval(async () => {
        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            await currentUser.getIdToken(true);
          }
        } catch (error) {
          // Silently handle token refresh errors
        }
      }, 55 * 60 * 1000); // 55 minutes
    };
    
    setupTokenRefresh();

    // Cleanup function
    return () => {
      unsubscribeAuthState();
      unsubscribeIdToken();
      if (tokenRefreshInterval) clearInterval(tokenRefreshInterval);
    };
  }, [router, pathname]);

  const signOut = async () => {
    try {
      const auth = getAuth();
      await firebaseSignOut(auth);
      Cookies.remove('session');
      setUser(null);
      router.push('/login');
    } catch (error) {
      // Silently handle sign out errors
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 