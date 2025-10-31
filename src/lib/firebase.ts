"use client";

// Firebase configuration and initialization
import { initializeApp, getApps, FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { 
  getAuth, 
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
};

// Initialize Firebase (only once)
let app: FirebaseApp;
let auth: Auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} else {
  app = getApps()[0];
  auth = getAuth(app);
}

// Export Firebase services
export { auth };

// Authentication helper functions
export const firebaseAuth = {
  // Register a new user
  register: async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      return { user: userCredential.user, token };
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      console.error('Firebase registration error:', err);
      
      // Provide user-friendly error messages
      if (e?.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please login instead.');
      } else if (e?.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      } else if (e?.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use at least 6 characters.');
      }
      
      throw new Error(e?.message || 'Registration failed');
    }
  },

  // Sign in existing user
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      return { user: userCredential.user, token };
    } catch (err: unknown) {
      const e = err as { message?: string };
      console.error('Firebase login error:', err);
      throw new Error(e?.message || 'Login failed');
    }
  },

  // Sign out current user
  logout: async () => {
    try {
      await signOut(auth);
      // Clear any stored tokens
      localStorage.removeItem('firebaseToken');
      sessionStorage.removeItem('firebaseToken');
    } catch (err: unknown) {
      const e = err as { message?: string };
      console.error('Firebase logout error:', err);
      throw new Error(e?.message || 'Logout failed');
    }
  },

  // Get current user's ID token
  getToken: async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Force refresh token
  refreshToken: async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken(true); // true forces refresh
    }
    return null;
  },
};

export default firebaseAuth;
