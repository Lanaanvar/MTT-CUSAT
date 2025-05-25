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
    
    // Handle auth state changes
    const unsubscribeAuthState = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            isAdmin: userData?.isAdmin || false,
          });
        } else {
          setUser(null);
          // If on a protected route and no user, clear cookie and redirect
          if (pathname?.startsWith('/admin')) {
            Cookies.remove('session');
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
      } finally {
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
    const refreshInterval = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken(true); // Force refresh
          Cookies.set('session', token, { expires: 7 });
        } catch (error) {
          console.error('Token refresh error:', error);
        }
      }
    }, 55 * 60 * 1000);

    return () => {
      unsubscribeAuthState();
      unsubscribeIdToken();
      clearInterval(refreshInterval);
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
      console.error('Sign out error:', error);
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