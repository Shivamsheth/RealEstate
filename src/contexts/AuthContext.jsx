// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signOut as fbSignOut,
  sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (fbUser) => {
      if (fbUser) {
        // enforce email verification
        if (!fbUser.emailVerified) {
          await sendEmailVerification(fbUser);
          await fbSignOut(getAuth());
          setUser(null);
          setLoading(false);
          return;
        }

        // ensure Firestore profile exists
        const userRef = doc(db, 'users', fbUser.uid);
        const snap    = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            email: fbUser.email,
            role: 'client',      // default
            approved: true,
            createdAt: Date.now()
          });
        }

        const profile = snap.exists() ? snap.data() : { role: 'client', approved: true };
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          role: profile.role,
          approved: profile.approved
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = () => fbSignOut(getAuth());

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}