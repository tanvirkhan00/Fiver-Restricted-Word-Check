import {
  signInAnonymously,
  signInWithPopup,
  linkWithPopup,
  signInWithRedirect,
  linkWithRedirect,
  getRedirectResult,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth, googleProvider } from "./config.js";

// Ensure local persistence is configured so sessions survive browser restarts
let persistenceConfigured = false;
async function configurePersistence() {
  if (persistenceConfigured) return;
  try {
    await setPersistence(auth, browserLocalPersistence);
    persistenceConfigured = true;
  } catch (err) {
    console.warn("[Auth] Could not set browserLocalPersistence:", err);
  }
}

/* ---- Auth helpers --------------------------------------------------- */
export async function ensureSignedIn() {
  await configurePersistence();
  if (!auth.currentUser) {
    const cred = await signInAnonymously(auth);
    console.log("[Auth] Signed in anonymously with UID:", cred.user.uid);
    return cred.user;
  }
  return auth.currentUser;
}

export async function signInWithGoogle() {
  await configurePersistence();
  const prevAnonymousUid = auth.currentUser?.isAnonymous ? auth.currentUser.uid : null;

  try {
    if (auth.currentUser?.isAnonymous) {
      const result = await linkWithPopup(auth.currentUser, googleProvider);
      return { user: result.user, merged: true, prevUid: prevAnonymousUid };
    }
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, merged: false, prevUid: prevAnonymousUid };
  } catch (e) {
    if (e.code === "auth/credential-already-in-use") {
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user, merged: true, prevUid: prevAnonymousUid };
    }
    if (
      e.code === "auth/popup-blocked" ||
      e.code === "auth/cancelled-popup-request" ||
      e.code === "auth/operation-not-supported-in-this-environment"
    ) {
      if (auth.currentUser?.isAnonymous) {
        await linkWithRedirect(auth.currentUser, googleProvider);
      } else {
        await signInWithRedirect(auth, googleProvider);
      }
      return null;
    }
    throw e;
  }
}

export async function consumeRedirectResult() {
  try {
    await configurePersistence();
    const result = await getRedirectResult(auth);
    if (result?.user) return { user: result.user, merged: true };
    return null;
  } catch (e) {
    if (e.code === "auth/credential-already-in-use") {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw e;
  }
}

export async function signOutToAnonymous() {
  await signOut(auth);
  await configurePersistence();
  return await signInAnonymously(auth);
}
