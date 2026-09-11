import {
  signInAnonymously, signInWithPopup, linkWithPopup,
  signInWithRedirect, linkWithRedirect, getRedirectResult, signOut,
} from "firebase/auth";
import { auth, googleProvider } from "./config";

/* ---- Auth helpers --------------------------------------------------- */
export async function ensureSignedIn() {
  // Called only from inside the onAuthStateChanged listener below, and only
  // once Firebase has told us "nobody is signed in" (u === null). Calling
  // this eagerly on mount (outside the listener) is what used to cause the
  // "login disappears on refresh" bug: on page load auth.currentUser is
  // briefly null WHILE Firebase is still restoring a persisted Google
  // session from IndexedDB, so an eager call here would create a brand new
  // anonymous user and stomp on the session that was about to be restored.
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
}

export async function signInWithGoogle() {
  // Popup first, redirect as a fallback.
  //
  // Popup is tried first because it doesn't send the browser through a
  // full top-level navigation to the authDomain and back. Chrome's "bounce
  // tracking" protection treats that kind of unattended cross-domain
  // round trip as suspicious and can wipe the authDomain's storage before
  // the sign-in completes, which is what was silently breaking the
  // redirect-only flow (page appeared to just "refresh" with no Google
  // screen and no error). A popup keeps the user directly interacting
  // with the Google account picker, so it isn't flagged the same way.
  //
  // Redirect is kept as a fallback for the (rarer) case where the browser
  // itself won't allow a popup — its result is picked up by
  // consumeRedirectResult() below after the user is sent back.
  try {
    if (auth.currentUser?.isAnonymous) {
      // Anonymous session -> LINK it to the Google account so any
      // templates/words already made stay attached to this user.
      const result = await linkWithPopup(auth.currentUser, googleProvider);
      return { user: result.user, merged: false };
    }
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, merged: false };
  } catch (e) {
    if (e.code === "auth/credential-already-in-use") {
      // That Google account already has its own saved data elsewhere —
      // sign into the existing account instead of losing it.
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
      return null; // page is navigating away; result arrives via consumeRedirectResult()
    }
    throw e;
  }
}

export async function consumeRedirectResult() {
  // Call once on boot to finish a signInWithGoogle() redirect fallback, if
  // the user is arriving back from one. Returns null when there was no
  // pending redirect to resolve.
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) return { user: result.user, merged: false };
    return null;
  } catch (e) {
    if (e.code === "auth/credential-already-in-use") {
      // The Google account being linked already has its own saved data
      // elsewhere — sign into that existing account instead of losing it.
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
