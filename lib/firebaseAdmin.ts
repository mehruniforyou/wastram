import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;

export function getAdminApp(): App | null {
  if (adminApp) return adminApp;

  const apps = getApps();
  if (apps.length > 0) {
    adminApp = apps[0]!;
    return adminApp;
  }

  // 1. Try FIREBASE_SERVICE_ACCOUNT_KEY (JSON string in env)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      adminApp = initializeApp({
        credential: cert(creds),
      });
      return adminApp;
    } catch (err) {
      console.warn("[FirebaseAdmin] Failed parsing FIREBASE_SERVICE_ACCOUNT_KEY:", err);
    }
  }

  // 2. Try individual env variables FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    try {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
      return adminApp;
    } catch (err) {
      console.warn("[FirebaseAdmin] Failed initializing with email/key:", err);
    }
  }

  return null;
}

export function getAdminDb(): Firestore | null {
  if (adminDb) return adminDb;
  const app = getAdminApp();
  if (app) {
    adminDb = getFirestore(app);
  }
  return adminDb;
}
