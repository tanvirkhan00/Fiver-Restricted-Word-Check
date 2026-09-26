import {
  signInAnonymously, signInWithPopup, linkWithPopup,
  signInWithRedirect, linkWithRedirect, getRedirectResult, signOut,
} from "firebase/auth";
import { auth, googleProvider } from "./config";

/* ---- Auth helpers --------------------------------------------------- */
export async function ensureSignedIn() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
}

export async function signInWithGoogle() {
  try {
    if (auth.currentUser?.isAnonymous) {
      const result = await linkWithPopup(auth.currentUser, googleProvider);
      return { user: result.user, merged: false };
    }
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, merged: false };
  } catch (e) {
    if (e.code === "auth/credential-already-in-use") {
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user, merged: true };
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
    const result = await getRedirectResult(auth);
    if (result?.user) return { user: result.user, merged: false };
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
  await signInAnonymously(auth);
}
