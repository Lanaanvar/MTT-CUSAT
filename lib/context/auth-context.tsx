'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

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

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          
          // Update session token
          const token = await firebaseUser.getIdToken();
          Cookies.set('session', token, { expires: 7 });
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            isAdmin: userData?.isAdmin || false,
          });
        } else {
          setUser(null);
          Cookies.remove('session');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
        Cookies.remove('session');
      } finally {
        setLoading(false);
      }
    });
  }, [router]);

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