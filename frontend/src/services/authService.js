import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import { app } from "../config/firebase";

const auth = getAuth(app);

// Register User with optional Display Name
export const registerUser = async (email, password, displayName = "") => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && userCredential.user) {
    try {
      await updateProfile(userCredential.user, { displayName });
    } catch (err) {
      console.warn("Could not set display name:", err);
    }
  }
  return userCredential;
};

// Login User
export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Send Password Reset Email
export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

// Change User Password (for currently logged-in user)
export const changePassword = async (newPassword) => {
  if (!auth.currentUser) {
    throw new Error("No authenticated user found. Please sign in again.");
  }
  return await updatePassword(auth.currentUser, newPassword);
};

// Sign Out User
export const signOutUser = async () => {
  return await signOut(auth);
};

// Helper function to format raw Firebase Auth errors into friendly user text
export const formatAuthError = (error) => {
  const code = error?.code || "";
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email address already exists. Please sign in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please try again.";
    case "auth/too-many-requests":
      return "Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/requires-recent-login":
      return "This operation is sensitive. Please sign out and sign in again before changing your password.";
    default:
      return error?.message || "An authentication error occurred. Please try again.";
  }
};

export { auth };