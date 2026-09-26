import { useState, useEffect } from "react";
import { Clock, Play, Pause, RotateCcw, Gauge, Zap, Keyboard } from "lucide-react";
import { formatDuration } from "../lib/format";

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function LiveClockPill({ compact = false }) {
  const now = useNow(1000);
  const [use24h, setUse24h] = useState(false);

  const timeStr = now.toLocaleTimeString("en-US", {
    hour12: !use24h,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <button
      type="button"
      className={`live-clock-pill${compact ? " live-clock-pill-compact" : ""}`}
      onClick={() => setUse24h((v) => !v)}
      title="Click to toggle 12h / 24h clock format"
    >
      <Clock size={13} className="live-clock-icon" />
      <span className="live-clock-time">{timeStr}</span>
      {!compact && (
        <>
          <span className="live-clock-sep">·</span>
          <span className="live-clock-date">{dateStr}</span>
        </>
      )}
    </button>
  );
}

export function getWpmTier(wpm) {
  if (wpm <= 0) return { label: "Ready", tone: "muted" };
  if (wpm < 30) return { label: "Warming Up", tone: "accent" };
  if (wpm < 55) return { label: "Steady Pace", tone: "low" };
  if (wpm < 80) return { label: "Fast Typing", tone: "medium" };
  return { label: "Pro Speed", tone: "high" };
}

export function TypingTelemetryBar({
  words,
  chars,
  typingStats,
  onTogglePause,
  onResetTimer,
}) {
  const now = useNow(1000);
  const [use24h, setUse24h] = useState(false);

  const timeStr = now.toLocaleTimeString("en-US", {
    hour12: !use24h,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const {
    activeMs,
    wpm,
    cpm,
    peakWpm,
    isTyping,
    isPaused,
    hasStarted,
  } = typingStats;

  const tier = getWpmTier(wpm);
  const readTimeSec = words > 0 ? Math.max(1, Math.ceil((words / 200) * 60)) : 0;

  let statusLabel = "Ready to type";
  let statusDotClass = "timer-dot-idle";
  if (hasStarted) {
    if (isPaused) {
      statusLabel = "Timer paused";
      statusDotClass = "timer-dot-paused";
    } else if (isTyping) {
      statusLabel = "Typing live";
      statusDotClass = "timer-dot-active";
    } else {
      statusLabel = "Auto-paused (idle)";
      statusDotClass = "timer-dot-paused";
    }
  }

  return (
    <div className="telemetry-bar">
      {/* 1. Live Real-Time Clock */}
      <div
        className="telemetry-card telemetry-card-clickable"
        onClick={() => setUse24h((v) => !v)}
        title="Live System Clock — click to switch between 12-hour and 24-hour format"
      >
        <div className="telemetry-icon telemetry-icon-accent">
          <Clock size={18} />
        </div>
        <div className="telemetry-content">
          <div className="telemetry-top-row">
            <span className="telemetry-label">Live Clock</span>
            <span className="telemetry-sub-tag">{use24h ? "24H" : "12H"}</span>
          </div>
          <span className="telemetry-value mono">{timeStr}</span>
          <span className="telemetry-meta">{dateStr}</span>
        </div>
      </div>

      {/* 2. Live Session Stopwatch / Clock Counter */}
      <div className="telemetry-card">
        <div className={`telemetry-icon ${isTyping && !isPaused ? "telemetry-icon-low" : "telemetry-icon-muted"}`}>
          <Keyboard size={18} />
        </div>
        <div className="telemetry-content">
          <div className="telemetry-top-row">
            <span className="telemetry-label">Typing Clock Counter</span>
            <span className="telemetry-status-inline">
              <span className={`timer-dot ${statusDotClass}`} />
              {statusLabel}
            </span>
          </div>
          <div className="telemetry-timer-row">
            <span className="telemetry-value mono">{formatDuration(activeMs)}</span>
            <div className="telemetry-timer-actions">
              <button
                type="button"
                className="timer-ctrl-btn"
                onClick={onTogglePause}
                disabled={!hasStarted}
                title={isPaused ? "Resume timer" : "Pause timer"}
                aria-label={isPaused ? "Resume timer" : "Pause timer"}
              >
                {isPaused ? <Play size={12} /> : <Pause size={12} />}
              </button>
              <button
                type="button"
                className="timer-ctrl-btn"
                onClick={onResetTimer}
                disabled={!hasStarted && activeMs === 0 && wpm === 0}
                title="Reset typing timer & WPM counter"
                aria-label="Reset typing timer"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>
          <span className="telemetry-meta">
            {readTimeSec > 0 ? `Est. client read time: ~${readTimeSec}s` : "Starts automatically when you type"}
          </span>
        </div>
      </div>

      {/* 3. Words Per Minute (WPM) Live Calculation */}
      <div className="telemetry-card">
        <div className="telemetry-icon telemetry-icon-low">
          <Gauge size={18} />
        </div>
        <div className="telemetry-content">
          <div className="telemetry-top-row">
            <span className="telemetry-label">Words Per Minute</span>
            <span className={`telemetry-tier telemetry-tier-${tier.tone}`}>{tier.label}</span>
          </div>
          <div className="telemetry-wpm-row">
            <span className="telemetry-value mono">{wpm}</span>
            <span className="telemetry-unit">WPM</span>
          </div>
          <div className="wpm-meter-track">
            <div
              className="wpm-meter-fill"
              style={{ width: `${Math.min(100, Math.round((wpm / 100) * 100))}%` }}
            />
          </div>
          <span className="telemetry-meta">
            Peak speed: <strong className="mono">{peakWpm} WPM</strong>
          </span>
        </div>
      </div>

      {/* 4. Characters Per Minute (CPM) & Word Count */}
      <div className="telemetry-card">
        <div className="telemetry-icon telemetry-icon-medium">
          <Zap size={18} />
        </div>
        <div className="telemetry-content">
          <div className="telemetry-top-row">
            <span className="telemetry-label">Typing Volume & Rate</span>
            <span className="telemetry-sub-tag mono">{cpm} CPM</span>
          </div>
          <div className="telemetry-wpm-row">
            <span className="telemetry-value mono">{words}</span>
            <span className="telemetry-unit">words</span>
          </div>
          <span className="telemetry-meta">
            <strong className="mono">{chars}</strong> characters · <strong className="mono">{cpm}</strong> chars/min
          </span>
        </div>
      </div>
    </div>
  );
}
