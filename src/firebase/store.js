import { getFirestore, doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db, INACTIVITY_DAYS } from "./config";

export function userDoc(uid) {
  return doc(db, "users", uid);
}

export function storeKeyFor(uid) {
  // Per-uid local cache so switching accounts on the same device never
  // shows a flash of the previous user's data.
  return `fiverr-safety-checker:state:${uid}`;
}

export async function loadState(uid) {
  if (!uid) return null;
  try {
    const snap = await getDoc(userDoc(uid));
    if (snap.exists() && snap.data()?.json) {
      const parsed = JSON.parse(snap.data().json);
      try { window.localStorage.setItem(storeKeyFor(uid), snap.data().json); } catch {}
      return parsed;
    }
  } catch (e) {
    console.error("Firestore load failed, falling back to local cache:", e);
  }
  try {
    const raw = window.localStorage.getItem(storeKeyFor(uid));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveState(uid, state) {
  if (!uid) return;
  const json = JSON.stringify(state);
  try {
    window.localStorage.setItem(storeKeyFor(uid), json);
  } catch (e) {
    console.error("Local cache save error:", e);
  }
  try {
    const expiresAt = Timestamp.fromMillis(Date.now() + INACTIVITY_DAYS * 24 * 60 * 60 * 1000);
    await setDoc(userDoc(uid), { json, updatedAt: serverTimestamp(), expiresAt }, { merge: true });
  } catch (e) {
    console.error("Firestore save error (data is still safe in the local cache):", e);
  }
}
