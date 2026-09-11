import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyCoBSic6KIj5gKj5mejhodSrqbnYRs5lqY",
  authDomain: "fiverr-safety-checker.firebaseapp.com",
  projectId: "fiverr-safety-checker",
  storageBucket: "fiverr-safety-checker.firebasestorage.app",
  messagingSenderId: "283773583275",
  appId: "1:283773583275:web:3f0636024eb66020a99cee",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
// Always show Google's account chooser instead of silently reusing whichever
// Google account happens to be signed into the browser — without this,
// Chrome auto-picks that account with no way for the person to pick a
// different one or confirm.
googleProvider.setCustomParameters({ prompt: "select_account" });

export const INACTIVITY_DAYS = 30;
