import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAf8Z4H3GdBJp6EGkDtY9BCF64TqrLWJgM",
  authDomain: "greenops-ai.firebaseapp.com",
  projectId: "greenops-ai",
  storageBucket: "greenops-ai.firebasestorage.app",
  messagingSenderId: "190813077794",
  appId: "1:190813077794:web:22a50adb285f7a8e6e257b",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { app, db };