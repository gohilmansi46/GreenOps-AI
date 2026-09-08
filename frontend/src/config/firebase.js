import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAf8Z4H3GdBJp6EGkDtY9BCF64TqrLWJgM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "greenops-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "greenops-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "greenops-ai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "190813077794",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:190813077794:web:22a50adb285f7a8e6e257b",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { app, db };