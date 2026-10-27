import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  Shield,
  Menu
} from "lucide-react";
import { CommandPalette } from "./components/CommandPalette";
import { Sidebar } from "./components/Sidebar";
import { BrandLogo } from "./components/BrandLogo";
import { ConfirmDialog, ToastStack } from "./components/primitives";
import { APP_VERSION, CATEGORIES } from "./data/constants";
import { SEED_TEMPLATES } from "./data/seedTemplates";
import { consumeRedirectResult, ensureSignedIn, signInWithGoogle, signOutToAnonymous } from "./firebase/authHelpers";
import { auth } from "./firebase/config";
import { loadState, saveState, DEFAULT_METRICS } from "./firebase/store";
import { uid } from "./lib/format";
import { buildWordList, scanMessage } from "./lib/scan";
import { useTypingEngine } from "./lib/useTypingEngine";
import { CategoriesPage } from "./pages/CategoriesPage";
import { Dashboard } from "./pages/Dashboard";
import { MessageChecker, SaveMessageModal } from "./pages/MessageChecker";
import { RestrictedWordsPage } from "./pages/RestrictedWordsPage";
import { EditMessageModal, SavedMessages } from "./pages/SavedMessages";
import { SettingsPage } from "./pages/SettingsPage";
import { SpeedTrainerPage } from "./pages/SpeedTrainerPage";
import { InsertTemplateModal, TemplateModal, TemplatesPage } from "./pages/TemplatesPage";
import { CSS } from "./styles/appStyles";

export default function StandaloneApp() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [page, setPage] = useState("checker");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [messages, setMessages] = useState([]);
  const [templates, setTemplates] = useState(SEED_TEMPLATES);
  const [activity, setActivity] = useState([]);
  const [settings, setSettings] = useState({ defaultCategory: "General" });
  const [customWords, setCustomWords] = useState([]);
  const [disabledBuiltinWords, setDisabledBuiltinWords] = useState([]);
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const [recentScans, setRecentScans] = useState([]);
  const lastScannedFingerprintRef = useRef("");

  const [text, setText] = useState("");
  const [category, setCategory] = useState("General");
  const textareaRef = useRef(null);

  /* ---- Accurate Standard Typing Speed & Stopwatch Engine ---- */
  const {
    typingStats,
    recordKeyDown,
    recordPaste,
    recordTextChange,
    togglePause: handleTogglePause,
    resetTimer: handleResetTimer,
  } = useTypingEngine();

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [templateModal, setTemplateModal] = useState({ open: false, initial: null });
  const [editMessage, setEditMessage] = useState(null);
  const [insertOpen, setInsertOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  /* ---- Hide the static HTML preloader once the real app data is ready ---- */
  useEffect(() => {
    if (!authReady || !loaded) return;
    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    const providerInfo = user?.providerData?.[0] || {};
    const displayName = user?.displayName || providerInfo.displayName;
    const photoURL = user?.photoURL || providerInfo.photoURL;

    const isSignedIn = user && !user.isAnonymous && (displayName || user.email);

    const fadeOutPreloader = () => {
      preloader.classList.add("fade-out");
      setTimeout(() => preloader.remove(), 500);
    };

    if (isSignedIn) {
      const welcomeEl = document.getElementById("pl-welcome");
      const avatarEl = document.getElementById("pl-avatar");
      const name = displayName ? displayName.split(" ")[0] : user.email.split("@")[0];

      if (welcomeEl) {
        welcomeEl.textContent = `Welcome back, ${name}`;
        welcomeEl.classList.add("show");
      }
      if (avatarEl && photoURL) {
        avatarEl.src = photoURL;
        avatarEl.classList.add("show");
      }
      setTimeout(fadeOutPreloader, 900);
    } else {
      fadeOutPreloader();
    }
  }, [authReady, loaded, user]);

  /* ---- Global Ctrl/Cmd+K shortcut for the command palette ---- */
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, tone = "success") => {
    const id = uid();
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const addActivity = useCallback((label) => {
    setActivity((a) => [{ id: uid(), label, timestamp: Date.now() }, ...a].slice(0, 30));
  }, []);

  const loadingRef = useRef(false);
  const currentLoadedUidRef = useRef(null);

  /* ---- Auth with Resilient Anonymous / Cloud Fallback ---- */
  useEffect(() => {
    let cancelled = false;

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (cancelled) return;
      if (!u) {
        console.log("[Auth] Initializing anonymous session...");
        try {
          const anonUser = await ensureSignedIn();
          if (!cancelled && anonUser) {
            setUser(anonUser);
            setAuthReady(true);
          }
        } catch (err) {
          console.warn("[Auth] Anonymous sign-in failed, falling back to local workspace:", err);
          if (!cancelled) {
            setUser({ uid: "local-guest", isAnonymous: true });
            setAuthReady(true);
          }
        }
        return;
      }
      console.log(`[Auth] User authenticated: ${u.uid} (${u.isAnonymous ? "anonymous" : "google"})`);
      setUser(u);
      setAuthReady(true);
    });

    consumeRedirectResult()
      .then((res) => {
        if (cancelled || !res) return;
        addToast("Signed in with Google — workspace synced to your account!", "success");
      })
      .catch((e) => {
        console.error("[Auth] Redirect sign-in error:", e);
        if (!cancelled) addToast("Sign-in failed, please try again", "danger");
      });

    // Fallback timer: only triggers if network/auth is completely unresponsive after 6 seconds
    const fallbackTimer = setTimeout(() => {
      if (!cancelled) {
        setUser((prev) => {
          if (!prev) {
            console.warn("[Auth] Auth timed out; activating local workspace fallback.");
            return { uid: "local-guest", isAnonymous: true };
          }
          return prev;
        });
        setAuthReady(true);
      }
    }, 6000);

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
      unsub();
    };
  }, [addToast]);

  /* ---- Load this uid's data whenever the signed-in user changes ---- */
  useEffect(() => {
    if (!authReady || !user) return;
    if (currentLoadedUidRef.current === user.uid) return;

    let cancelled = false;
    loadingRef.current = true;
    setLoaded(false);

    (async () => {
      try {
        const { data: saved, isNewAccountWithLocalData } = await loadState(user.uid);
        if (cancelled) return;

        const loadedMessages = saved?.messages || [];
        const loadedTemplates = saved?.templates?.length > 0 ? saved.templates : SEED_TEMPLATES;
        const loadedActivity = saved?.activity || [];
        const loadedSettings = saved?.settings || { defaultCategory: "General" };
        const loadedTheme = saved?.theme || "dark";
        const loadedCustomWords = saved?.customWords || [];
        const loadedDisabledWords = saved?.disabledBuiltinWords || [];
        const loadedMetrics = saved?.metrics ? { ...DEFAULT_METRICS, ...saved.metrics } : DEFAULT_METRICS;
        const loadedRecentScans = Array.isArray(saved?.recentScans) ? saved.recentScans : [];

        setMessages(loadedMessages);
        setTemplates(loadedTemplates);
        setActivity(loadedActivity);
        setSettings(loadedSettings);
        setTheme(loadedTheme);
        setCustomWords(loadedCustomWords);
        setDisabledBuiltinWords(loadedDisabledWords);
        setMetrics(loadedMetrics);
        setRecentScans(loadedRecentScans);

        currentLoadedUidRef.current = user.uid;
        setLoaded(true);
        loadingRef.current = false;

        // If local device data was restored for a new Firebase UID, save it immediately to Firestore!
        if (isNewAccountWithLocalData && user.uid !== "local-guest") {
          console.log("[Persistence] Syncing restored device data to Cloud Firestore UID:", user.uid);
          saveState(user.uid, {
            messages: loadedMessages,
            templates: loadedTemplates,
            activity: loadedActivity,
            settings: loadedSettings,
            theme: loadedTheme,
            customWords: loadedCustomWords,
            disabledBuiltinWords: loadedDisabledWords,
            metrics: loadedMetrics,
            recentScans: loadedRecentScans,
          }).then((res) => {
            if (res.success) {
              console.log("[Persistence] Device data successfully synced to Firestore for:", user.uid);
            }
          });
        }
      } catch (err) {
        if (cancelled) return;
        console.error("[Persistence] Error during state initialization:", err);
        setLoaded(true);
        loadingRef.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, user?.uid]);

  /* ---- Persist Workspace Helper with True Cloud Verification ---- */
  const persistWorkspace = useCallback(async (overrides = {}) => {
    if (!user) return { success: false, error: new Error("No active user") };

    const currentState = {
      messages: overrides.messages !== undefined ? overrides.messages : messages,
      templates: overrides.templates !== undefined ? overrides.templates : templates,
      activity: overrides.activity !== undefined ? overrides.activity : activity,
      settings: overrides.settings !== undefined ? overrides.settings : settings,
      theme: overrides.theme !== undefined ? overrides.theme : theme,
      customWords: overrides.customWords !== undefined ? overrides.customWords : customWords,
      disabledBuiltinWords: overrides.disabledBuiltinWords !== undefined ? overrides.disabledBuiltinWords : disabledBuiltinWords,
      metrics: overrides.metrics !== undefined ? overrides.metrics : metrics,
      recentScans: overrides.recentScans !== undefined ? overrides.recentScans : recentScans,
    };

    const targetUid = user.uid;
    const result = await saveState(targetUid, currentState);
    return result;
  }, [user, messages, templates, activity, settings, theme, customWords, disabledBuiltinWords, metrics, recentScans]);

  /* ---- Debounced Auto-Save for Ambient Changes (Theme, Settings, Telemetry) ---- */
  useEffect(() => {
    if (!loaded || !user || loadingRef.current) return;
    const timer = setTimeout(() => {
      saveState(user.uid, {
        messages,
        templates,
        activity,
        settings,
        theme,
        customWords,
        disabledBuiltinWords,
        metrics,
        recentScans,
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [loaded, user, messages, templates, activity, settings, theme, customWords, disabledBuiltinWords, metrics, recentScans]);

  const handleSignIn = useCallback(async () => {
    let settled = false;
    const hintTimer = setTimeout(() => {
      if (!settled) {
        addToast(
          "Still waiting on Google — if you use Brave Shields, an ad-blocker, or block third-party cookies, please allow this site and try again.",
          "warning"
        );
      }
    }, 6000);
    try {
      const res = await signInWithGoogle();
      settled = true;
      clearTimeout(hintTimer);
      if (res?.user) {
        // If transitioning from an anonymous session with unsaved local data, merge cleanly into Google account
        const prevUid = res.prevUid;
        if (prevUid && prevUid !== res.user.uid) {
          console.log(`[Auth] Merging workspace from anonymous UID ${prevUid} to Google account ${res.user.uid}`);
          const currentLocal = { messages, templates, activity, settings, theme, customWords, disabledBuiltinWords, metrics, recentScans };
          const cloudCheck = await loadState(res.user.uid);
          if (cloudCheck.data) {
            const existingMsgIds = new Set((cloudCheck.data.messages || []).map((m) => m.id));
            const newLocalMsgs = (messages || []).filter((m) => !existingMsgIds.has(m.id));
            const mergedMsgs = [...newLocalMsgs, ...(cloudCheck.data.messages || [])];

            const existingTplIds = new Set((cloudCheck.data.templates || []).map((t) => t.id));
            const newLocalTpls = (templates || []).filter((t) => !existingTplIds.has(t.id));
            const mergedTpls = [...newLocalTpls, ...(cloudCheck.data.templates || [])];

            const cloudMetrics = cloudCheck.data.metrics || DEFAULT_METRICS;
            const mergedMetrics = {
              totalScans: Math.max(cloudMetrics.totalScans || 0, metrics.totalScans || 0),
              safeScans: Math.max(cloudMetrics.safeScans || 0, metrics.safeScans || 0),
              flaggedScans: Math.max(cloudMetrics.flaggedScans || 0, metrics.flaggedScans || 0),
              copiedCount: Math.max(cloudMetrics.copiedCount || 0, metrics.copiedCount || 0),
              pastedCount: Math.max(cloudMetrics.pastedCount || 0, metrics.pastedCount || 0),
              wordsChecked: Math.max(cloudMetrics.wordsChecked || 0, metrics.wordsChecked || 0),
              charsChecked: Math.max(cloudMetrics.charsChecked || 0, metrics.charsChecked || 0),
              conflictsIntercepted: Math.max(cloudMetrics.conflictsIntercepted || 0, metrics.conflictsIntercepted || 0),
              hyphenatedCount: Math.max(cloudMetrics.hyphenatedCount || 0, metrics.hyphenatedCount || 0),
              lastScanAt: Date.now(),
            };

            const existingScanIds = new Set((cloudCheck.data.recentScans || []).map((s) => s.id));
            const mergedRecentScans = [
              ...(recentScans || []).filter((s) => !existingScanIds.has(s.id)),
              ...(cloudCheck.data.recentScans || []),
            ].slice(0, 30);

            const mergedState = {
              ...cloudCheck.data,
              messages: mergedMsgs,
              templates: mergedTpls,
              metrics: mergedMetrics,
              recentScans: mergedRecentScans,
            };
            await saveState(res.user.uid, mergedState);
            setMessages(mergedMsgs);
            setTemplates(mergedTpls);
            setMetrics(mergedMetrics);
            setRecentScans(mergedRecentScans);
          } else {
            await saveState(res.user.uid, currentLocal);
          }
        }
        addToast(res.merged ? "Signed in — loaded and synced your account" : "Signed in with Google", "success");
      }
    } catch (e) {
      settled = true;
      clearTimeout(hintTimer);
      console.error("[Auth] Google sign-in failed:", e);
      addToast(
        "Sign-in failed. If you use Brave Shields, an ad-blocker, or block third-party cookies, please allow this site and try again.",
        "danger"
      );
    }
  }, [messages, templates, activity, settings, theme, customWords, disabledBuiltinWords, addToast]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOutToAnonymous();
      addToast("Signed out", "success");
    } catch (e) {
      console.error("[Auth] Sign-out failed:", e);
      addToast("Sign-out failed, try again", "danger");
    }
  }, [addToast]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const wordList = useMemo(() => buildWordList(disabledBuiltinWords, customWords), [disabledBuiltinWords, customWords]);

  const allCategories = useMemo(() => {
    const set = new Set(CATEGORIES);
    messages.forEach((m) => m.category && set.add(m.category));
    templates.forEach((t) => t.category && set.add(t.category));
    return Array.from(set);
  }, [messages, templates]);

  const scan = useMemo(() => scanMessage(text, wordList), [text, wordList]);

  /* ---- Real-Time Live Message & Telemetry Scanner Tracker ---- */
  const recordMessageScan = useCallback((content, scanResult, source = "typed") => {
    const trimmed = (content || "").trim();
    if (!trimmed || trimmed.length < 5) return;

    // Avoid duplicate rapid recordings of the exact same message
    if (lastScannedFingerprintRef.current === trimmed && source === "typed") return;
    lastScannedFingerprintRef.current = trimmed;

    const wordsCount = trimmed.split(/\s+/).filter(Boolean).length;
    const charsCount = trimmed.length;
    const isSafe = scanResult.status === "safe";
    const conflictsCount = scanResult.found?.length || 0;
    const conflictsList = (scanResult.found || []).map((f) => f.word);

    setMetrics((prev) => ({
      ...prev,
      totalScans: (prev.totalScans || 0) + 1,
      safeScans: isSafe ? (prev.safeScans || 0) + 1 : (prev.safeScans || 0),
      flaggedScans: !isSafe ? (prev.flaggedScans || 0) + 1 : (prev.flaggedScans || 0),
      wordsChecked: (prev.wordsChecked || 0) + wordsCount,
      charsChecked: (prev.charsChecked || 0) + charsCount,
      conflictsIntercepted: (prev.conflictsIntercepted || 0) + conflictsCount,
      lastScanAt: Date.now(),
    }));

    const newScanEntry = {
      id: uid(),
      textExcerpt: trimmed.length > 95 ? trimmed.slice(0, 95) + "…" : trimmed,
      fullText: trimmed,
      wordCount: wordsCount,
      charCount: charsCount,
      riskStatus: scanResult.status,
      issuesCount: conflictsCount,
      issues: conflictsList,
      source,
      timestamp: Date.now(),
    };

    setRecentScans((prev) => [newScanEntry, ...prev.filter((s) => s.fullText !== trimmed)].slice(0, 30));

    const activityLabel = isSafe
      ? `Checked message (${wordsCount} words) — 100% compliant`
      : `Scanned draft (${wordsCount} words) — ${conflictsCount} conflict keyword${conflictsCount === 1 ? "" : "s"} flagged`;
    addActivity(activityLabel);
  }, [addActivity]);

  const handleRecordPaste = useCallback((pastedText) => {
    setMetrics((prev) => ({
      ...prev,
      pastedCount: (prev.pastedCount || 0) + 1,
    }));
    const wordsCount = (pastedText || "").trim().split(/\s+/).filter(Boolean).length;
    addActivity(`Pasted draft (${wordsCount} words) into compliance composer`);
  }, [addActivity]);

  const handleRecordCopy = useCallback((copiedText, scanResult) => {
    setMetrics((prev) => ({
      ...prev,
      copiedCount: (prev.copiedCount || 0) + 1,
    }));
    if (scanResult) {
      recordMessageScan(copiedText, scanResult, "copied");
    }
    addActivity(`Copied verified message to clipboard (Ready for Fiverr)`);
  }, [recordMessageScan, addActivity]);

  const handleRecordObfuscate = useCallback((count, method = "hyphen") => {
    setMetrics((prev) => ({
      ...prev,
      hyphenatedCount: (prev.hyphenatedCount || 0) + count,
    }));
    addActivity(`Obfuscated ${count} conflict keyword${count === 1 ? "" : "s"} with ${method === "dot" ? "dot (.)" : "hyphen (-)"}`);
  }, [addActivity]);

  const handleLoadScanToChecker = useCallback((fullText) => {
    setText(fullText);
    recordPaste(fullText.length);
    setPage("checker");
    addToast("Loaded message back into composer.");
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, [recordPaste, addToast]);

  const startNewCheck = () => {
    setText("");
    handleResetTimer();
    setPage("checker");
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleSaveMessage = async (data) => {
    const now = Date.now();
    const s = scanMessage(data.content, wordList);
    const newMsg = {
      id: uid(), title: data.title, category: data.category, content: data.content,
      tags: data.tags, createdAt: now, updatedAt: now, riskStatus: s.status, riskScore: s.score, usageCount: 0,
    };
    const nextMessages = [newMsg, ...messages];
    const nextActivity = [{ id: uid(), label: `Message saved — "${data.title}"`, timestamp: now }, ...activity].slice(0, 30);
    setMessages(nextMessages);
    setActivity(nextActivity);
    setSaveModalOpen(false);

    const res = await persistWorkspace({ messages: nextMessages, activity: nextActivity });
    if (res.success) {
      if (res.source === "firestore") {
        addToast("Message saved and synced to Firebase.", "success");
      } else {
        addToast("Message saved locally.", "success");
      }
    } else {
      addToast("Saved locally (Cloud sync failed: " + (res.error?.message || "Offline") + ")", "warning");
    }
  };

  const handleEditMessage = async (data) => {
    const s = scanMessage(data.content, wordList);
    const nextMessages = messages.map((m) => m.id === editMessage.id ? { ...m, ...data, riskStatus: s.status, riskScore: s.score, updatedAt: Date.now() } : m);
    const nextActivity = [{ id: uid(), label: `Message updated — "${data.title}"`, timestamp: Date.now() }, ...activity].slice(0, 30);
    setMessages(nextMessages);
    setActivity(nextActivity);
    setEditMessage(null);

    const res = await persistWorkspace({ messages: nextMessages, activity: nextActivity });
    if (res.success) {
      if (res.source === "firestore") {
        addToast("Message updated and synced to Firebase.", "success");
      } else {
        addToast("Message updated locally.", "success");
      }
    } else {
      addToast("Updated locally (Cloud sync failed: " + (res.error?.message || "Offline") + ")", "warning");
    }
  };

  const handleDeleteMessage = (m) => {
    setConfirmDialog({
      title: "Delete message",
      message: `Delete "${m.title}"? This can't be undone.`,
      confirmLabel: "Delete message",
      onConfirm: async () => {
        const nextMessages = messages.filter((x) => x.id !== m.id);
        const nextActivity = [{ id: uid(), label: `Message deleted — "${m.title}"`, timestamp: Date.now() }, ...activity].slice(0, 30);
        setMessages(nextMessages);
        setActivity(nextActivity);

        const res = await persistWorkspace({ messages: nextMessages, activity: nextActivity });
        if (res.success && res.source === "firestore") {
          addToast("Message deleted and synced.", "danger");
        } else {
          addToast("Message deleted.", "danger");
        }
      },
    });
  };

  const handleDuplicateMessage = async (m) => {
    const now = Date.now();
    const copyMsg = { ...m, id: uid(), title: `${m.title} (copy)`, createdAt: now, updatedAt: now };
    const nextMessages = [copyMsg, ...messages];
    setMessages(nextMessages);

    const res = await persistWorkspace({ messages: nextMessages });
    if (res.success && res.source === "firestore") {
      addToast("Message duplicated and synced to Firebase.", "success");
    } else {
      addToast("Message duplicated.");
    }
  };

  const handleCopyMessage = (m) => {
    navigator.clipboard.writeText(m.content).then(() => addToast("Message copied to clipboard."));
  };

  const handleUseMessage = (m) => {
    setText(m.content);
    recordPaste(m.content.length);
    setCategory(m.category);
    setPage("checker");
    const nextMessages = messages.map((x) => x.id === m.id ? { ...x, usageCount: (x.usageCount || 0) + 1 } : x);
    const nextActivity = [{ id: uid(), label: `Message loaded into checker — "${m.title}"`, timestamp: Date.now() }, ...activity].slice(0, 30);
    setMessages(nextMessages);
    setActivity(nextActivity);
    persistWorkspace({ messages: nextMessages, activity: nextActivity });
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  /* ---- Template actions ---- */
  const handleCreateTemplate = async (data) => {
    const now = Date.now();
    const newTpl = { id: uid(), pinned: false, usageCount: 0, ...data, createdAt: now, updatedAt: now };
    const nextTemplates = [newTpl, ...templates];
    const nextActivity = [{ id: uid(), label: `Template saved — "${data.name}"`, timestamp: now }, ...activity].slice(0, 30);
    setTemplates(nextTemplates);
    setActivity(nextActivity);
    setTemplateModal({ open: false, initial: null });

    const res = await persistWorkspace({ templates: nextTemplates, activity: nextActivity });
    if (res.success) {
      if (res.source === "firestore") {
        addToast("Template created and synced to Firebase.", "success");
      } else {
        addToast("Template created locally.", "success");
      }
    } else {
      addToast("Created locally (Cloud sync failed: " + (res.error?.message || "Offline") + ")", "warning");
    }
  };

  const handleUpdateTemplate = async (data) => {
    const nextTemplates = templates.map((t) => t.id === templateModal.initial.id ? { ...t, ...data, updatedAt: Date.now() } : t);
    const nextActivity = [{ id: uid(), label: `Template updated — "${data.name}"`, timestamp: Date.now() }, ...activity].slice(0, 30);
    setTemplates(nextTemplates);
    setActivity(nextActivity);
    setTemplateModal({ open: false, initial: null });

    const res = await persistWorkspace({ templates: nextTemplates, activity: nextActivity });
    if (res.success) {
      if (res.source === "firestore") {
        addToast("Template updated and synced to Firebase.", "success");
      } else {
        addToast("Template updated locally.", "success");
      }
    } else {
      addToast("Updated locally (Cloud sync failed: " + (res.error?.message || "Offline") + ")", "warning");
    }
  };

  const handleDeleteTemplate = (t) => {
    setConfirmDialog({
      title: "Delete template",
      message: `Delete "${t.name}"? This can't be undone.`,
      confirmLabel: "Delete template",
      onConfirm: async () => {
        const nextTemplates = templates.filter((x) => x.id !== t.id);
        const nextActivity = [{ id: uid(), label: `Template deleted — "${t.name}"`, timestamp: Date.now() }, ...activity].slice(0, 30);
        setTemplates(nextTemplates);
        setActivity(nextActivity);

        const res = await persistWorkspace({ templates: nextTemplates, activity: nextActivity });
        if (res.success && res.source === "firestore") {
          addToast("Template deleted and synced.", "danger");
        } else {
          addToast("Template deleted.", "danger");
        }
      },
    });
  };

  const handleDuplicateTemplate = async (t) => {
    const now = Date.now();
    const copyTpl = { ...t, id: uid(), name: `${t.name} (copy)`, pinned: false, usageCount: 0, createdAt: now, updatedAt: now };
    const nextTemplates = [copyTpl, ...templates];
    setTemplates(nextTemplates);

    const res = await persistWorkspace({ templates: nextTemplates });
    if (res.success && res.source === "firestore") {
      addToast("Template duplicated and synced to Firebase.", "success");
    } else {
      addToast("Template duplicated.");
    }
  };

  const handleCopyTemplate = (t) => {
    navigator.clipboard.writeText(t.content).then(() => addToast("Template content copied."));
  };

  const handleTogglePin = async (t) => {
    const nextTemplates = templates.map((x) => x.id === t.id ? { ...x, pinned: !x.pinned } : x);
    setTemplates(nextTemplates);
    addToast(t.pinned ? "Unpinned template." : "Pinned to top.");
    await persistWorkspace({ templates: nextTemplates });
  };

  const handleUseTemplate = (t) => {
    setText(t.content);
    recordPaste(t.content.length);
    setCategory(t.category);
    setPage("checker");
    const nextTemplates = templates.map((x) => x.id === t.id ? { ...x, usageCount: (x.usageCount || 0) + 1 } : x);
    const nextActivity = [{ id: uid(), label: `Template inserted — "${t.name}"`, timestamp: Date.now() }, ...activity].slice(0, 30);
    setTemplates(nextTemplates);
    setActivity(nextActivity);
    persistWorkspace({ templates: nextTemplates, activity: nextActivity });
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleInsertTemplate = (t) => {
    setText((prev) => (prev ? `${prev}\n${t.content}` : t.content));
    recordPaste(t.content.length);
    setCategory(t.category);
    const nextTemplates = templates.map((x) => x.id === t.id ? { ...x, usageCount: (x.usageCount || 0) + 1 } : x);
    setTemplates(nextTemplates);
    setInsertOpen(false);
    addToast("Template inserted.");
    persistWorkspace({ templates: nextTemplates });
  };

  const clearMessages = () => setConfirmDialog({
    title: "Clear saved messages", message: "This removes every saved message. This can't be undone.", confirmLabel: "Clear all",
    onConfirm: async () => {
      setMessages([]);
      const nextActivity = [{ id: uid(), label: "Saved messages cleared", timestamp: Date.now() }, ...activity].slice(0, 30);
      setActivity(nextActivity);
      await persistWorkspace({ messages: [], activity: nextActivity });
      addToast("Saved messages cleared.", "danger");
    },
  });

  const clearTemplates = () => setConfirmDialog({
    title: "Clear templates", message: "This removes every template. This can't be undone.", confirmLabel: "Clear all",
    onConfirm: async () => {
      setTemplates([]);
      const nextActivity = [{ id: uid(), label: "Templates cleared", timestamp: Date.now() }, ...activity].slice(0, 30);
      setActivity(nextActivity);
      await persistWorkspace({ templates: [], activity: nextActivity });
      addToast("Templates cleared.", "danger");
    },
  });

  const clearActivity = () => setConfirmDialog({
    title: "Clear activity log", message: "This resets your recent activity history.", confirmLabel: "Clear all",
    onConfirm: async () => {
      setActivity([]);
      await persistWorkspace({ activity: [] });
      addToast("Activity log cleared.", "danger");
    },
  });

  /* ---- Restricted word management ---- */
  const handleToggleBuiltinWord = async (word) => {
    const w = word.toLowerCase();
    const isDisabled = disabledBuiltinWords.includes(w);
    const nextDisabled = isDisabled ? disabledBuiltinWords.filter((x) => x !== w) : [...disabledBuiltinWords, w];
    setDisabledBuiltinWords(nextDisabled);
    addToast(isDisabled ? `"${word}" is being scanned again.` : `"${word}" will no longer be flagged.`);
    await persistWorkspace({ disabledBuiltinWords: nextDisabled });
  };

  const handleAddCustomWord = async (data) => {
    const newWord = { id: uid(), ...data, enabled: true };
    const nextCustom = [newWord, ...customWords];
    const nextActivity = [{ id: uid(), label: `Custom word added — "${data.word}"`, timestamp: Date.now() }, ...activity].slice(0, 30);
    setCustomWords(nextCustom);
    setActivity(nextActivity);

    const res = await persistWorkspace({ customWords: nextCustom, activity: nextActivity });
    if (res.success && res.source === "firestore") {
      addToast("Word added and synced to Firebase.", "success");
    } else {
      addToast("Word added to scanner.");
    }
  };

  const handleUpdateCustomWord = async (id, data) => {
    const nextCustom = customWords.map((w) => w.id === id ? { ...w, ...data } : w);
    setCustomWords(nextCustom);
    const res = await persistWorkspace({ customWords: nextCustom });
    if (res.success && res.source === "firestore") {
      addToast("Word updated and synced to Firebase.", "success");
    } else {
      addToast("Word updated.");
    }
  };

  const handleToggleCustomWord = async (w) => {
    const nextCustom = customWords.map((x) => x.id === w.id ? { ...x, enabled: !x.enabled } : x);
    setCustomWords(nextCustom);
    addToast(w.enabled ? `"${w.word}" disabled.` : `"${w.word}" enabled.`);
    await persistWorkspace({ customWords: nextCustom });
  };

  const handleDeleteCustomWord = (w) => {
    setConfirmDialog({
      title: "Delete custom word",
      message: `Remove "${w.word}" from your custom word list? This can't be undone.`,
      confirmLabel: "Delete word",
      onConfirm: async () => {
        const nextCustom = customWords.filter((x) => x.id !== w.id);
        setCustomWords(nextCustom);
        await persistWorkspace({ customWords: nextCustom });
        addToast("Custom word deleted.", "danger");
      },
    });
  };

  /* ---- Backup: export / import all data as a JSON file ---- */
  const [lastBackupAt, setLastBackupAt] = useState(null);

  const handleExportData = () => {
    const payload = {
      app: "Fiverr Safety Checker",
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      messages, templates, activity, settings, theme, customWords, disabledBuiltinWords, metrics, recentScans,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `fiverr-safety-checker-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setLastBackupAt(Date.now());
    addActivity("Data exported to backup file");
    addToast("Backup file downloaded.");
  };

  const handleImportFile = (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      let parsed;
      try {
        parsed = JSON.parse(reader.result);
      } catch {
        addToast("That file isn't valid JSON.", "danger");
        return;
      }
      if (!parsed || (!Array.isArray(parsed.messages) && !Array.isArray(parsed.templates))) {
        addToast("That doesn't look like a Fiverr Safety Checker backup.", "danger");
        return;
      }
      setConfirmDialog({
        title: "Import backup",
        message: `This will replace your current data with the backup${parsed.exportedAt ? ` from ${new Date(parsed.exportedAt).toLocaleString()}` : ""}. This can't be undone.`,
        confirmLabel: "Replace with backup",
        onConfirm: async () => {
          const nextMsgs = Array.isArray(parsed.messages) ? parsed.messages : messages;
          const nextTpls = Array.isArray(parsed.templates) ? parsed.templates : templates;
          const nextActs = Array.isArray(parsed.activity) ? parsed.activity : activity;
          const nextSet = parsed.settings || settings;
          const nextThm = parsed.theme || theme;
          const nextCust = Array.isArray(parsed.customWords) ? parsed.customWords : customWords;
          const nextDis = Array.isArray(parsed.disabledBuiltinWords) ? parsed.disabledBuiltinWords : disabledBuiltinWords;
          const nextMet = parsed.metrics ? { ...DEFAULT_METRICS, ...parsed.metrics } : metrics;
          const nextScans = Array.isArray(parsed.recentScans) ? parsed.recentScans : recentScans;

          setMessages(nextMsgs);
          setTemplates(nextTpls);
          setActivity(nextActs);
          setSettings(nextSet);
          setTheme(nextThm);
          setCustomWords(nextCust);
          setDisabledBuiltinWords(nextDis);
          setMetrics(nextMet);
          setRecentScans(nextScans);

          const res = await persistWorkspace({
            messages: nextMsgs,
            templates: nextTpls,
            activity: nextActs,
            settings: nextSet,
            theme: nextThm,
            customWords: nextCust,
            disabledBuiltinWords: nextDis,
            metrics: nextMet,
            recentScans: nextScans,
          });

          if (res.success && res.source === "firestore") {
            addToast("Backup restored and synced to Firebase.", "success");
          } else {
            addToast("Backup restored successfully.", "success");
          }
        },
      });
    };
    reader.onerror = () => addToast("Couldn't read that file.", "danger");
  };

  if (!authReady || !loaded) {
    return (
      <div className={`app-root theme-${theme}`} data-theme={theme}>
        <style>{CSS}</style>
        <div className="auth-loading">
          <BrandLogo size={32} />
          <span>Loading your account…</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-root theme-${theme}`} data-theme={theme}>
      <style>{CSS}</style>

      <Sidebar
        page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
        theme={theme} toggleTheme={toggleTheme} onOpenPalette={() => setPaletteOpen(true)}
        user={user} onSignIn={handleSignIn} onSignOut={handleSignOut}
        counts={{
          templates: templates.length,
          saved: messages.length,
          words: wordList.length,
        }}
      />

      <main className="main-area">
        <div className="mobile-topbar">
          <button className="menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={18} /></button>
          <div className="mobile-brand">
            <BrandLogo size={20} />
            <span>Fiverr Safety Suite</span>
          </div>
        </div>

        {page === "dashboard" && (
          <Dashboard
            messages={messages}
            templates={templates}
            activity={activity}
            metrics={metrics}
            recentScans={recentScans}
            setPage={setPage}
            startNewCheck={startNewCheck}
            typingStats={typingStats}
            onLoadScanToChecker={handleLoadScanToChecker}
            onCopyText={handleCopyMessage}
          />
        )}

        {page === "checker" && (
          <MessageChecker
            text={text} setText={setText} category={category} setCategory={setCategory} categories={allCategories}
            scan={scan} onSave={() => setSaveModalOpen(true)} onOpenInsert={() => setInsertOpen(true)}
            addToast={addToast} textareaRef={textareaRef}
            typingStats={typingStats}
            onTogglePause={handleTogglePause}
            onResetTimer={handleResetTimer}
            recordKeyDown={recordKeyDown}
            recordPaste={recordPaste}
            recordTextChange={recordTextChange}
            onRegisterScan={recordMessageScan}
            onRecordPaste={handleRecordPaste}
            onRecordCopy={handleRecordCopy}
            onRecordObfuscate={handleRecordObfuscate}
          />
        )}

        {page === "trainer" && (
          <SpeedTrainerPage
            onTransferToChecker={(textToUse, catToUse) => {
              setText(textToUse);
              if (catToUse) setCategory(catToUse);
              recordPaste(textToUse.length);
              setPage("checker");
              addToast("Loaded drill into Message Compliance Studio.");
            }}
            addToast={addToast}
          />
        )}

        {page === "templates" && (
          <TemplatesPage
            templates={templates}
            categories={allCategories}
            onUse={handleUseTemplate}
            onCreate={() => setTemplateModal({ open: true, initial: null })}
            onEdit={(t) => setTemplateModal({ open: true, initial: t })}
            onDuplicate={handleDuplicateTemplate}
            onDelete={handleDeleteTemplate}
            onCopy={handleCopyTemplate}
            onTogglePin={handleTogglePin}
          />
        )}

        {page === "saved" && (
          <SavedMessages
            messages={messages}
            categories={allCategories}
            onUse={handleUseMessage}
            onEdit={(m) => setEditMessage(m)}
            onDelete={handleDeleteMessage}
            onDuplicate={handleDuplicateMessage}
            onCopy={handleCopyMessage}
          />
        )}

        {page === "words" && (
          <RestrictedWordsPage
            disabledBuiltinWords={disabledBuiltinWords}
            customWords={customWords}
            categories={allCategories}
            onToggleBuiltin={handleToggleBuiltinWord}
            onAddCustom={handleAddCustomWord}
            onUpdateCustom={handleUpdateCustomWord}
            onToggleCustom={handleToggleCustomWord}
            onDeleteCustom={handleDeleteCustomWord}
          />
        )}

        {page === "categories" && (
          <CategoriesPage messages={messages} templates={templates} categories={allCategories} setPage={setPage} setCheckerCategory={setCategory} />
        )}

        {page === "settings" && (
          <SettingsPage
            theme={theme} toggleTheme={toggleTheme} settings={settings} setSettings={setSettings}
            onClearMessages={clearMessages} onClearTemplates={clearTemplates} onClearActivity={clearActivity}
            onExportData={handleExportData} onImportFile={handleImportFile} lastBackupAt={lastBackupAt}
          />
        )}
      </main>

      <SaveMessageModal open={saveModalOpen} onClose={() => setSaveModalOpen(false)} defaultContent={text} defaultCategory={category} categories={allCategories} onConfirm={handleSaveMessage} />
      <TemplateModal
        open={templateModal.open}
        initial={templateModal.initial}
        categories={allCategories}
        wordList={wordList}
        onClose={() => setTemplateModal({ open: false, initial: null })}
        onConfirm={templateModal.initial ? handleUpdateTemplate : handleCreateTemplate}
      />
      <EditMessageModal open={!!editMessage} message={editMessage} categories={allCategories} onClose={() => setEditMessage(null)} onConfirm={handleEditMessage} />
      <InsertTemplateModal open={insertOpen} onClose={() => setInsertOpen(false)} templates={templates} onInsert={handleInsertTemplate} />
      <ConfirmDialog config={confirmDialog} onClose={() => setConfirmDialog(null)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onNavigate={setPage} templates={templates} onUseTemplate={handleUseTemplate} />
      <ToastStack toasts={toasts} />
    </div>
  );
}
