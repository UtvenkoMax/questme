import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

function getPublicEnv(name: string) {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  return env?.[name]?.trim() ?? '';
}

const firebaseConfig = {
  apiKey: getPublicEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
  appId: getPublicEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),
  authDomain: getPublicEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  messagingSenderId: getPublicEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  projectId: getPublicEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getPublicEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
} satisfies FirebaseOptions;

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

function createFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const firebaseApp = createFirebaseApp();
export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const db: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;
