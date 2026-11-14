import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined" && !firebaseConfig.apiKey) {
    return null;
  }
  try {
    if (!getApps().length) {
      if (firebaseConfig.apiKey || typeof window !== "undefined") {
        app = initializeApp(firebaseConfig);
      }
    } else {
      app = getApp();
    }
  } catch (err) {
    console.warn("[Firebase] Client initialization notice:", err);
  }
  return app;
}

export function getFirebaseDb(): Firestore | null {
  try {
    const a = getFirebaseApp();
    if (a && !db) {
      db = getFirestore(a);
    }
  } catch (err) {
    console.warn("[Firebase] Firestore initialization notice:", err);
  }
  return db;
}

export function getFirebaseAuth(): Auth | null {
  try {
    const a = getFirebaseApp();
    if (a && !auth) {
      auth = getAuth(a);
    }
  } catch (err) {
    console.warn("[Firebase] Auth initialization notice:", err);
  }
  return auth;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  try {
    const a = getFirebaseApp();
    if (a && !storage) {
      storage = getStorage(a);
    }
  } catch (err) {
    console.warn("[Firebase] Storage initialization notice:", err);
  }
  return storage;
}

export const firebase = {
  app: getFirebaseApp,
  db: getFirebaseDb,
  auth: getFirebaseAuth,
  storage: getFirebaseStorage,
};
