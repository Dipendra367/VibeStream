import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { usePlayerStore } from '../store/usePlayerStore';
import { loadQueueFromFirestore, saveQueueToFirestore } from '../lib/firestoreQueue';

type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });

        // Load queue from firestore
        const savedQueue = await loadQueueFromFirestore(firebaseUser.uid);
        if (savedQueue && savedQueue.length > 0) {
          usePlayerStore.getState().setQueue(savedQueue);
        }
      } else {
        setUser(null);
        // Do not clear local queue, so users can still preview the app while logged out.
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to queue changes to push to DB
  useEffect(() => {
    if (!user) return; // Only sync if user exists
    
    const unsubscribe = usePlayerStore.subscribe((state) => {
      saveQueueToFirestore(user.uid, state.queue);
    });
    
    return () => unsubscribe();
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
