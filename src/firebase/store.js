import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config.js";

export function userDoc(uid) {
  return doc(db, "users", uid);
}

export function storeKeyFor(uid) {
  return `fiverr-safety-checker:state:${uid}`;
}

export const GLOBAL_BACKUP_KEY = "fiverr-safety-checker:state:latest-device-backup";

/**
 * Saves a snapshot of workspace data to the browser's local cache.
 * Mirrors to both the user-specific slot and a global device backup slot.
 */
export function saveToLocalCache(uid, state) {
  if (!state || typeof window === "undefined" || !window.localStorage) return;
  try {
    const json = JSON.stringify(state);
    if (uid) {
      window.localStorage.setItem(storeKeyFor(uid), json);
    }
    window.localStorage.setItem(GLOBAL_BACKUP_KEY, json);
  } catch (e) {
    console.warn("[Storage] Local cache save failed:", e);
  }
}

/**
 * Loads cached workspace data from the browser storage.
 */
export function loadFromLocalCache(uid) {
  if (typeof window === "undefined" || !window.localStorage) return null;
  if (uid) {
    try {
      const raw = window.localStorage.getItem(storeKeyFor(uid));
      if (raw) return JSON.parse(raw);
    } catch {}
  }
  try {
    const globalRaw = window.localStorage.getItem(GLOBAL_BACKUP_KEY);
    if (globalRaw) return JSON.parse(globalRaw);
  } catch {}
  return null;
}

export const DEFAULT_METRICS = {
  totalScans: 0,
  safeScans: 0,
  flaggedScans: 0,
  copiedCount: 0,
  pastedCount: 0,
  wordsChecked: 0,
  charsChecked: 0,
  conflictsIntercepted: 0,
  hyphenatedCount: 0,
  lastScanAt: null,
};

/**
 * Normalizes Firestore document data whether it was stored as structured
 * Firestore fields or as a serialized legacy JSON string.
 */
function normalizeFirestoreData(docData) {
  if (!docData) return null;

  // 1. Check if structured fields exist
  if (Array.isArray(docData.messages) || Array.isArray(docData.templates)) {
    return {
      messages: docData.messages || [],
      templates: docData.templates || [],
      activity: docData.activity || [],
      settings: docData.settings || { defaultCategory: "General" },
      theme: docData.theme || "dark",
      customWords: docData.customWords || [],
      disabledBuiltinWords: docData.disabledBuiltinWords || [],
      metrics: { ...DEFAULT_METRICS, ...(docData.metrics || {}) },
      recentScans: Array.isArray(docData.recentScans) ? docData.recentScans.slice(0, 30) : [],
    };
  }

  // 2. Fallback to legacy JSON string payload
  if (docData.json && typeof docData.json === "string") {
    try {
      const parsed = JSON.parse(docData.json);
      return {
        messages: parsed.messages || [],
        templates: parsed.templates || [],
        activity: parsed.activity || [],
        settings: parsed.settings || { defaultCategory: "General" },
        theme: parsed.theme || "dark",
        customWords: parsed.customWords || [],
        disabledBuiltinWords: parsed.disabledBuiltinWords || [],
        metrics: { ...DEFAULT_METRICS, ...(parsed.metrics || {}) },
        recentScans: Array.isArray(parsed.recentScans) ? parsed.recentScans.slice(0, 30) : [],
      };
    } catch (err) {
      console.error("[Firestore] Failed to parse legacy JSON payload:", err);
    }
  }

  return null;
}

/**
 * Loads the user's workspace state with multi-tier resilience:
 * Tier 1: Cloud Firestore document (authoritative source)
 * Tier 2: User local cache (survives offline and network drops)
 * Tier 3: Global device backup (prevents data loss if Firebase anonymous UID was rotated)
 */
export async function loadState(uid) {
  if (!uid) return { data: null, source: "none", success: false };

  // If we have a valid cloud user ID (anonymous or Google authenticated)
  if (uid !== "local-guest") {
    try {
      console.log(`[Firestore] Fetching workspace for user: ${uid}...`);
      const snap = await getDoc(userDoc(uid));

      if (snap.exists()) {
        const rawData = snap.data();
        const parsed = normalizeFirestoreData(rawData);

        if (parsed) {
          console.log(`[Firestore] Successfully loaded ${parsed.messages?.length || 0} messages and ${parsed.templates?.length || 0} templates from cloud.`);
          saveToLocalCache(uid, parsed);
          return { data: parsed, source: "firestore", success: true };
        }
      } else {
        console.log(`[Firestore] No existing cloud document found for UID: ${uid}. Checking device backup...`);
        // If no cloud document exists for this UID yet, check if there is an existing local workspace
        // on this device (e.g. from a prior anonymous session or guest mode).
        const existingLocal = loadFromLocalCache(uid);
        if (existingLocal && (existingLocal.messages?.length > 0 || existingLocal.customWords?.length > 0)) {
          console.log("[Firestore] Found existing device workspace data. Will migrate to new cloud UID.");
          return { data: existingLocal, source: "device-backup", isNewAccountWithLocalData: true, success: true };
        }
        return { data: null, source: "empty", success: true };
      }
    } catch (e) {
      console.error(`[Firestore] Failed to load data for user ${uid}:`, e);
      // Fallback to local storage so the user can continue working offline
      const cached = loadFromLocalCache(uid);
      if (cached) {
        console.warn("[Firestore] Operating from local offline cache.");
        return { data: cached, source: "local-fallback", success: false, error: e };
      }
      return { data: null, source: "none", success: false, error: e };
    }
  }

  // Guest / Offline fallback
  const local = loadFromLocalCache("local-guest");
  return { data: local, source: "local", success: true };
}

/**
 * Persists workspace state to both Local Storage and Firestore.
 * Does NOT set expiresAt or any TTL timestamps, ensuring permanent storage.
 */
export async function saveState(uid, state) {
  if (!state) return { success: false, error: new Error("No state to save") };

  // 1. Always write to local storage first for instant resilience
  saveToLocalCache(uid, state);

  // 2. If unauthenticated / local-guest only
  if (!uid || uid === "local-guest") {
    return { success: true, source: "local" };
  }

  // 3. Persist to Cloud Firestore with structured fields + backward-compatible JSON
  try {
    const payload = {
      messages: state.messages || [],
      templates: state.templates || [],
      customWords: state.customWords || [],
      disabledBuiltinWords: state.disabledBuiltinWords || [],
      settings: state.settings || { defaultCategory: "General" },
      theme: state.theme || "dark",
      activity: (state.activity || []).slice(0, 30),
      metrics: state.metrics || DEFAULT_METRICS,
      recentScans: (state.recentScans || []).slice(0, 30),
      json: JSON.stringify(state),
      updatedAt: serverTimestamp(),
      clientTimestamp: Date.now(),
    };

    await setDoc(userDoc(uid), payload, { merge: true });
    console.log(`[Firestore] Successfully saved workspace to cloud for user: ${uid}`);
    return { success: true, source: "firestore" };
  } catch (e) {
    console.error(`[Firestore] Save failed for user ${uid}:`, e);
    return { success: false, source: "local-only", error: e };
  }
}
