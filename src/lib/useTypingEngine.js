import { useState, useRef, useEffect, useCallback, useMemo } from "react";

/**
 * Standard Typing Speed Engine
 * ----------------------------
 * 1 Standard Word = 5 keystrokes (standard international typing metric).
 * Excludes pasted text and templates from typing speed calculations.
 * Ignores idle pause time so thinking between words does not distort WPM.
 */
export function useTypingEngine() {
  const [activeMs, setActiveMs] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [typedKeystrokes, setTypedKeystrokes] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [pastedChars, setPastedChars] = useState(0);
  const [backspacesCount, setBackspacesCount] = useState(0);

  const [liveWpm, setLiveWpm] = useState(0);
  const [peakWpm, setPeakWpm] = useState(0);
  const [recentPasteNotice, setRecentPasteNotice] = useState(null);

  // Refs for precise time tracking without state-delay
  const lastKeyTimeRef = useRef(0);
  const activeMsRef = useRef(0);
  const isPausedRef = useRef(false);
  const hasStartedRef = useRef(false);
  const keystrokeHistoryRef = useRef([]); // timestamps of recent keys for rolling WPM
  const pasteNoticeTimerRef = useRef(null);

  isPausedRef.current = isPaused;
  hasStartedRef.current = hasStarted;
  activeMsRef.current = activeMs;

  // Record a physical keyboard press
  const recordKeyDown = useCallback((e) => {
    const key = e.key;

    // Detect backspace / deletion
    if (key === "Backspace" || key === "Delete") {
      setBackspacesCount((prev) => prev + 1);
      return;
    }

    // Ignore standalone modifier keys
    if (["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab", "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
      return;
    }

    // Ignore hotkey combinations like Ctrl+C, Ctrl+A, Ctrl+V
    if (e.ctrlKey || e.metaKey) {
      return;
    }

    const now = Date.now();
    const prevKeyTime = lastKeyTimeRef.current;
    lastKeyTimeRef.current = now;

    if (!hasStartedRef.current) {
      setHasStarted(true);
      hasStartedRef.current = true;
    }

    if (isPausedRef.current) {
      setIsPaused(false);
      isPausedRef.current = false;
    }

    // Calculate time between keystrokes (cap max inter-key interval to 1.5s)
    if (prevKeyTime > 0) {
      const timeDiff = now - prevKeyTime;
      if (timeDiff <= 1500) {
        // Continuous typing
        setActiveMs((prev) => prev + timeDiff);
      } else if (timeDiff <= 3000) {
        // Brief pause to think: credit only standard nominal key actuation time (250ms)
        setActiveMs((prev) => prev + 250);
      }
      // If timeDiff > 3000: long pause; do not add dead time!
    }

    setIsTyping(true);
    setTypedKeystrokes((prev) => prev + 1);
    setTypedChars((prev) => prev + (key.length === 1 ? 1 : 0));

    // Append to rolling history
    keystrokeHistoryRef.current.push(now);
    // Keep only last 5 seconds of keystrokes in buffer
    keystrokeHistoryRef.current = keystrokeHistoryRef.current.filter((t) => now - t <= 5000);
  }, []);

  // Record explicit paste event
  const recordPaste = useCallback((charsCount) => {
    if (charsCount <= 0) return;
    setPastedChars((prev) => prev + charsCount);
    setRecentPasteNotice(`${charsCount} chars pasted (excluded from WPM)`);

    if (pasteNoticeTimerRef.current) clearTimeout(pasteNoticeTimerRef.current);
    pasteNoticeTimerRef.current = setTimeout(() => {
      setRecentPasteNotice(null);
    }, 4000);
  }, []);

  // Text change diff handler (catches pastes, deletions, and typing if keydown wasn't caught)
  const recordTextChange = useCallback((prevText, nextText) => {
    const diff = nextText.length - prevText.length;
    if (diff > 4) {
      // Detected paste of multi-character block
      recordPaste(diff);
    }
  }, [recordPaste]);

  // Periodic ticker: updates live WPM, checks typing idle, updates peak WPM
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const timeSinceLastKey = now - lastKeyTimeRef.current;

      // Clean old history
      keystrokeHistoryRef.current = keystrokeHistoryRef.current.filter((t) => now - t <= 4000);
      const recentKeys = keystrokeHistoryRef.current;

      if (timeSinceLastKey > 1500) {
        setIsTyping(false);
      }

      // Calculate Rolling Instant WPM
      if (recentKeys.length >= 4 && timeSinceLastKey <= 2000) {
        const oldest = recentKeys[0];
        const spanMs = Math.max(1000, now - oldest);
        const spanMinutes = spanMs / 60000;
        // Standard formula: (keys / 5) / minutes
        const instant = Math.min(220, Math.round((recentKeys.length / 5) / spanMinutes));
        setLiveWpm(instant);

        // Update peak WPM only if sustained and validated
        if (activeMsRef.current >= 3000 && instant > 0) {
          setPeakWpm((currentPeak) => Math.max(currentPeak, instant));
        }
      } else {
        // Smoothly decay live WPM when not pressing keys
        setLiveWpm((prev) => (prev > 0 ? Math.max(0, Math.floor(prev * 0.6)) : 0));
      }
    }, 250);

    return () => clearInterval(timer);
  }, []);

  // Session Average WPM & CPM
  const { avgWpm, avgCpm } = useMemo(() => {
    if (!hasStarted || typedKeystrokes < 5 || activeMs < 1500) {
      return { avgWpm: 0, avgCpm: 0 };
    }
    const minutes = Math.max(activeMs, 1000) / 60000;
    // Standard Gross WPM = (Keystrokes / 5) / Minutes
    const calcWpm = Math.min(220, Math.round((typedKeystrokes / 5) / minutes));
    const calcCpm = Math.min(1100, Math.round(typedKeystrokes / minutes));
    return { avgWpm: calcWpm, avgCpm: calcCpm };
  }, [hasStarted, typedKeystrokes, activeMs]);

  // Overall Typing Accuracy %
  const accuracy = useMemo(() => {
    if (typedKeystrokes === 0) return 100;
    const totalOps = typedKeystrokes + backspacesCount;
    if (totalOps === 0) return 100;
    return Math.max(0, Math.min(100, Math.round(((typedKeystrokes) / totalOps) * 100)));
  }, [typedKeystrokes, backspacesCount]);

  const togglePause = useCallback(() => {
    if (!hasStartedRef.current) return;
    setIsPaused((prev) => {
      const next = !prev;
      if (!next) {
        lastKeyTimeRef.current = Date.now();
        setIsTyping(true);
      }
      return next;
    });
  }, []);

  const resetTimer = useCallback(() => {
    setActiveMs(0);
    setIsTyping(false);
    setIsPaused(false);
    setHasStarted(false);
    setTypedKeystrokes(0);
    setTypedChars(0);
    setPastedChars(0);
    setBackspacesCount(0);
    setLiveWpm(0);
    setPeakWpm(0);
    setRecentPasteNotice(null);
    lastKeyTimeRef.current = 0;
    activeMsRef.current = 0;
    keystrokeHistoryRef.current = [];
  }, []);

  const typingStats = useMemo(() => ({
    activeMs,
    wpm: liveWpm > 0 ? liveWpm : avgWpm, // Display live when typing actively, session avg when idle
    liveWpm,
    avgWpm,
    cpm: avgCpm,
    peakWpm,
    typedKeystrokes,
    typedChars,
    pastedChars,
    backspacesCount,
    accuracy,
    isTyping,
    isPaused,
    hasStarted,
    recentPasteNotice,
  }), [
    activeMs,
    liveWpm,
    avgWpm,
    avgCpm,
    peakWpm,
    typedKeystrokes,
    typedChars,
    pastedChars,
    backspacesCount,
    accuracy,
    isTyping,
    isPaused,
    hasStarted,
    recentPasteNotice,
  ]);

  return {
    typingStats,
    recordKeyDown,
    recordPaste,
    recordTextChange,
    togglePause,
    resetTimer,
  };
}
