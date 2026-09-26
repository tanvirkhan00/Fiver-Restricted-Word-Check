import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  Shield,
  Menu
} from "lucide-react";
import { CommandPalette } from "./components/CommandPalette";
import { Sidebar } from "./components/Sidebar";
import { ConfirmDialog, ToastStack } from "./components/primitives";
import { APP_VERSION, CATEGORIES } from "./data/constants";
import { SEED_TEMPLATES } from "./data/seedTemplates";
import { consumeRedirectResult, ensureSignedIn, signInWithGoogle, signOutToAnonymous } from "./firebase/authHelpers";
import { auth } from "./firebase/config";
import { loadState, saveState } from "./firebase/store";
import { uid } from "./lib/format";
import { buildWordList, scanMessage } from "./lib/scan";
import { CategoriesPage } from "./pages/CategoriesPage";
import { Dashboard } from "./pages/Dashboard";
import { MessageChecker, SaveMessageModal } from "./pages/MessageChecker";
import { RestrictedWordsPage } from "./pages/RestrictedWordsPage";
import { EditMessageModal, SavedMessages } from "./pages/SavedMessages";
import { SettingsPage } from "./pages/SettingsPage";
import { InsertTemplateModal, TemplateModal, TemplatesPage } from "./pages/TemplatesPage";
import { CSS } from "./styles/appStyles";

const IDLE_TIMEOUT_MS = 4500;

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

  const [text, setText] = useState("");
  const [category, setCategory] = useState("General");
  const textareaRef = useRef(null);

  /* ---- Live Typing Clock Counter & WPM State ---- */
  const [activeMs, setActiveMs] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [peakWpm, setPeakWpm] = useState(0);
  const lastKeystrokeRef = useRef(0);
  const lastTickRef = useRef(0);

  const handleTextTyped = useCallback((nextText) => {
    const now = Date.now();
    if (!nextText.trim()) {
      setIsTyping(false);
      return;
    }
    lastKeystrokeRef.current = now;
    if (!hasStarted) {
      setHasStarted(true);
      lastTickRef.current = now;
    }
    if (isPaused) {
      setIsPaused(false);
      lastTickRef.current = now;
    }
    if (!isTyping) {
      setIsTyping(true);
      lastTickRef.current = now;
    }
  }, [hasStarted, isPaused, isTyping]);

  useEffect(() => {
    if (!hasStarted || isPaused) return;
    lastTickRef.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastKey = now - lastKeystrokeRef.current;
      if (timeSinceLastKey <= IDLE_TIMEOUT_MS) {
        const delta = Math.max(0, now - lastTickRef.current);
        setActiveMs((prev) => prev + delta);
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }
      lastTickRef.current = now;
    }, 250);
    return () => clearInterval(interval);
  }, [hasStarted, isPaused]);

  const wordsCount = useMemo(
    () => (text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0),
    [text]
  );

  const { wpm, cpm } = useMemo(() => {
    if (!hasStarted || wordsCount === 0) return { wpm: 0, cpm: 0 };
    // Use at least 2.5 seconds denominator so the very first word doesn't spike artificially
    const effectiveMinutes = Math.max(activeMs, 2500) / 60000;
    const calcWpm = Math.round(wordsCount / effectiveMinutes);
    const calcCpm = Math.round(text.length / effectiveMinutes);
    return { wpm: calcWpm, cpm: calcCpm };
  }, [hasStarted, wordsCount, activeMs, text.length]);

  useEffect(() => {
    if (activeMs >= 1500 && wpm > peakWpm) {
      setPeakWpm(wpm);
    }
  }, [wpm, activeMs, peakWpm]);

  const handleTogglePause = useCallback(() => {
    if (!hasStarted) return;
    setIsPaused((prev) => {
      const next = !prev;
      if (!next) {
        const now = Date.now();
        lastKeystrokeRef.current = now;
        lastTickRef.current = now;
        setIsTyping(true);
      }
      return next;
    });
  }, [hasStarted]);

  const handleResetTimer = useCallback(() => {
    setActiveMs(0);
    setIsTyping(false);
    setIsPaused(false);
    setHasStarted(false);
    setPeakWpm(0);
    lastKeystrokeRef.current = 0;
    lastTickRef.current = 0;
  }, []);

  const typingStats = useMemo(() => ({
    activeMs,
    wpm,
    cpm,
    peakWpm,
    isTyping,
    isPaused,
    hasStarted,
  }), [activeMs, wpm, cpm, peakWpm, isTyping, isPaused, hasStarted]);

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

  /* ---- Auth with graceful fallback so preview never hangs ---- */
  useEffect(() => {
    let cancelled = false;
    const fallbackTimer = setTimeout(() => {
      if (!cancelled) {
        setUser((prev) => prev || { uid: "local-guest", isAnonymous: true });
        setAuthReady(true);
      }
    }, 2200);

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (cancelled) return;
      if (!u) {
        try {
          await ensureSignedIn();
        } catch (err) {
          console.warn("Anonymous auth fallback to local guest:", err);
          if (!cancelled) {
            clearTimeout(fallbackTimer);
            setUser({ uid: "local-guest", isAnonymous: true });
            setAuthReady(true);
          }
        }
        return;
      }
      clearTimeout(fallbackTimer);
      setUser(u);
      setAuthReady(true);
    });

    consumeRedirectResult()
      .then((res) => {
        if (cancelled || !res) return;
        addToast(res.merged ? "Signed in — loaded your existing account" : "Signed in with Google");
      })
      .catch((e) => {
        console.error("Google sign-in failed:", e);
        if (!cancelled) addToast("Sign-in failed, try again", "danger");
      });

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
      unsub();
    };
  }, [addToast]);

  /* ---- Load this uid's data whenever the signed-in user changes ---- */
  useEffect(() => {
    if (!authReady || !user) return;
    setLoaded(false);
    (async () => {
      const saved = await loadState(user.uid);
      setMessages(saved?.messages || []);
      setTemplates(saved?.templates || SEED_TEMPLATES);
      setActivity(saved?.activity || []);
      setSettings(saved?.settings || { defaultCategory: "General" });
      if (saved?.theme) setTheme(saved.theme);
      setCustomWords(saved?.customWords || []);
      setDisabledBuiltinWords(saved?.disabledBuiltinWords || []);
      setLoaded(true);
    })();
  }, [authReady, user?.uid]);

  /* ---- Persist on change, scoped to the current uid ---- */
  useEffect(() => {
    if (!loaded || !user) return;
    saveState(user.uid, { messages, templates, activity, settings, theme, customWords, disabledBuiltinWords });
  }, [loaded, user, messages, templates, activity, settings, theme, customWords, disabledBuiltinWords]);

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
      if (res) addToast(res.merged ? "Signed in — loaded your existing account" : "Signed in with Google");
    } catch (e) {
      settled = true;
      clearTimeout(hintTimer);
      console.error("Google sign-in failed:", e);
      addToast(
        "Sign-in failed. If you use Brave Shields, an ad-blocker, or block third-party cookies, please allow this site and try again.",
        "danger"
      );
    }
  }, [addToast]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOutToAnonymous();
      addToast("Signed out");
    } catch (e) {
      console.error("Sign-out failed:", e);
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

  const startNewCheck = () => {
    setPage("checker");
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleSaveMessage = (data) => {
    const now = Date.now();
    const s = scanMessage(data.content, wordList);
    const newMsg = {
      id: uid(), title: data.title, category: data.category, content: data.content,
      tags: data.tags, createdAt: now, updatedAt: now, riskStatus: s.status, riskScore: s.score, usageCount: 0,
    };
    setMessages((m) => [newMsg, ...m]);
    addActivity(`Message saved — "${data.title}"`);
    addToast("Message saved successfully.");
    setSaveModalOpen(false);
  };

  const handleEditMessage = (data) => {
    const s = scanMessage(data.content, wordList);
    setMessages((list) => list.map((m) => m.id === editMessage.id ? { ...m, ...data, riskStatus: s.status, riskScore: s.score, updatedAt: Date.now() } : m));
    addActivity(`Message updated — "${data.title}"`);
    addToast("Message updated.");
    setEditMessage(null);
  };

  const handleDeleteMessage = (m) => {
    setConfirmDialog({
      title: "Delete message",
      message: `Delete "${m.title}"? This can't be undone.`,
      confirmLabel: "Delete message",
      onConfirm: () => {
        setMessages((list) => list.filter((x) => x.id !== m.id));
        addActivity(`Message deleted — "${m.title}"`);
        addToast("Message deleted.", "danger");
      },
    });
  };

  const handleDuplicateMessage = (m) => {
    const now = Date.now();
    setMessages((list) => [{ ...m, id: uid(), title: `${m.title} (copy)`, createdAt: now, updatedAt: now }, ...list]);
    addToast("Message duplicated.");
  };

  const handleCopyMessage = (m) => {
    navigator.clipboard.writeText(m.content).then(() => addToast("Message copied to clipboard."));
  };

  const handleUseMessage = (m) => {
    setText(m.content);
    setCategory(m.category);
    setPage("checker");
    setMessages((list) => list.map((x) => x.id === m.id ? { ...x, usageCount: (x.usageCount || 0) + 1 } : x));
    addActivity(`Message loaded into checker — "${m.title}"`);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  /* ---- Template actions ---- */
  const handleCreateTemplate = (data) => {
    const now = Date.now();
    setTemplates((t) => [{ id: uid(), pinned: false, usageCount: 0, ...data, createdAt: now, updatedAt: now }, ...t]);
    addActivity(`Template saved — "${data.name}"`);
    addToast("Template created.");
    setTemplateModal({ open: false, initial: null });
  };

  const handleUpdateTemplate = (data) => {
    setTemplates((list) => list.map((t) => t.id === templateModal.initial.id ? { ...t, ...data, updatedAt: Date.now() } : t));
    addActivity(`Template updated — "${data.name}"`);
    addToast("Template updated.");
    setTemplateModal({ open: false, initial: null });
  };

  const handleDeleteTemplate = (t) => {
    setConfirmDialog({
      title: "Delete template",
      message: `Delete "${t.name}"? This can't be undone.`,
      confirmLabel: "Delete template",
      onConfirm: () => {
        setTemplates((list) => list.filter((x) => x.id !== t.id));
        addActivity(`Template deleted — "${t.name}"`);
        addToast("Template deleted.", "danger");
      },
    });
  };

  const handleDuplicateTemplate = (t) => {
    const now = Date.now();
    setTemplates((list) => [{ ...t, id: uid(), name: `${t.name} (copy)`, pinned: false, usageCount: 0, createdAt: now, updatedAt: now }, ...list]);
    addToast("Template duplicated.");
  };

  const handleCopyTemplate = (t) => {
    navigator.clipboard.writeText(t.content).then(() => addToast("Template content copied."));
  };

  const handleTogglePin = (t) => {
    setTemplates((list) => list.map((x) => x.id === t.id ? { ...x, pinned: !x.pinned } : x));
    addToast(t.pinned ? "Unpinned template." : "Pinned to top.");
  };

  const handleUseTemplate = (t) => {
    setText(t.content);
    setCategory(t.category);
    setPage("checker");
    setTemplates((list) => list.map((x) => x.id === t.id ? { ...x, usageCount: (x.usageCount || 0) + 1 } : x));
    addActivity(`Template inserted — "${t.name}"`);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleInsertTemplate = (t) => {
    setText((prev) => (prev ? `${prev}\n${t.content}` : t.content));
    setCategory(t.category);
    setTemplates((list) => list.map((x) => x.id === t.id ? { ...x, usageCount: (x.usageCount || 0) + 1 } : x));
    setInsertOpen(false);
    addToast("Template inserted.");
  };

  const clearMessages = () => setConfirmDialog({
    title: "Clear saved messages", message: "This removes every saved message. This can't be undone.", confirmLabel: "Clear all",
    onConfirm: () => { setMessages([]); addActivity("Saved messages cleared"); addToast("Saved messages cleared.", "danger"); },
  });
  const clearTemplates = () => setConfirmDialog({
    title: "Clear templates", message: "This removes every template. This can't be undone.", confirmLabel: "Clear all",
    onConfirm: () => { setTemplates([]); addActivity("Templates cleared"); addToast("Templates cleared.", "danger"); },
  });
  const clearActivity = () => setConfirmDialog({
    title: "Clear activity log", message: "This resets your recent activity history.", confirmLabel: "Clear all",
    onConfirm: () => { setActivity([]); addToast("Activity log cleared.", "danger"); },
  });

  /* ---- Restricted word management ---- */
  const handleToggleBuiltinWord = (word) => {
    setDisabledBuiltinWords((list) => {
      const w = word.toLowerCase();
      const isDisabled = list.includes(w);
      addToast(isDisabled ? `"${word}" is being scanned again.` : `"${word}" will no longer be flagged.`);
      return isDisabled ? list.filter((x) => x !== w) : [...list, w];
    });
  };

  const handleAddCustomWord = (data) => {
    setCustomWords((list) => [{ id: uid(), ...data, enabled: true }, ...list]);
    addActivity(`Custom word added — "${data.word}"`);
    addToast("Word added to the scanner.");
  };

  const handleUpdateCustomWord = (id, data) => {
    setCustomWords((list) => list.map((w) => w.id === id ? { ...w, ...data } : w));
    addToast("Word updated.");
  };

  const handleToggleCustomWord = (w) => {
    setCustomWords((list) => list.map((x) => x.id === w.id ? { ...x, enabled: !x.enabled } : x));
    addToast(w.enabled ? `"${w.word}" disabled.` : `"${w.word}" enabled.`);
  };

  const handleDeleteCustomWord = (w) => {
    setConfirmDialog({
      title: "Delete custom word",
      message: `Remove "${w.word}" from your custom word list? This can't be undone.`,
      confirmLabel: "Delete word",
      onConfirm: () => {
        setCustomWords((list) => list.filter((x) => x.id !== w.id));
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
      messages, templates, activity, settings, theme, customWords, disabledBuiltinWords,
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
    reader.onload = () => {
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
        onConfirm: () => {
          if (Array.isArray(parsed.messages)) setMessages(parsed.messages);
          if (Array.isArray(parsed.templates)) setTemplates(parsed.templates);
          if (Array.isArray(parsed.activity)) setActivity(parsed.activity);
          if (parsed.settings) setSettings(parsed.settings);
          if (parsed.theme) setTheme(parsed.theme);
          if (Array.isArray(parsed.customWords)) setCustomWords(parsed.customWords);
          if (Array.isArray(parsed.disabledBuiltinWords)) setDisabledBuiltinWords(parsed.disabledBuiltinWords);
          addActivity("Data restored from backup file");
          addToast("Backup restored successfully.");
        },
      });
    };
    reader.onerror = () => addToast("Couldn't read that file.", "danger");
    reader.readAsText(file);
  };

  if (!authReady || !loaded) {
    return (
      <div className={`app-root theme-${theme}`} data-theme={theme}>
        <style>{CSS}</style>
        <div className="auth-loading">
          <Shield size={22} />
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
        typingStats={typingStats}
      />

      <main className="main-area">
        <div className="mobile-topbar">
          <button className="menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={18} /></button>
          <div className="mobile-brand"><Shield size={16} /> Fiverr Safety Checker</div>
        </div>

        {page === "dashboard" && (
          <Dashboard
            messages={messages}
            templates={templates}
            activity={activity}
            setPage={setPage}
            startNewCheck={startNewCheck}
            typingStats={typingStats}
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
            onTextTyped={handleTextTyped}
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
