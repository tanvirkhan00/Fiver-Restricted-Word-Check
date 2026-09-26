import { useState, useEffect } from "react";
import { Clock, Play, Pause, RotateCcw, Gauge, Zap, Timer, Globe } from "lucide-react";
import { formatDuration } from "../lib/format";

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

const TIMEZONES = [
  { id: "local", label: "Local Time", tz: undefined },
  { id: "est", label: "US East (NY)", tz: "America/New_York" },
  { id: "pst", label: "US West (LA)", tz: "America/Los_Angeles" },
  { id: "gmt", label: "UK (London)", tz: "Europe/London" },
  { id: "cet", label: "EU (Berlin)", tz: "Europe/Berlin" },
  { id: "aud", label: "AU (Sydney)", tz: "Australia/Sydney" },
];

export function LiveClockPill() {
  const now = useNow(1000);
  const [use24h, setUse24h] = useState(false);
  const [tzIndex, setTzIndex] = useState(0);

  const activeTz = TIMEZONES[tzIndex] || TIMEZONES[0];

  const timeOpts = {
    hour12: !use24h,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    ...(activeTz.tz ? { timeZone: activeTz.tz } : {}),
  };

  const dateOpts = {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...(activeTz.tz ? { timeZone: activeTz.tz } : {}),
  };

  const timeStr = now.toLocaleTimeString("en-US", timeOpts);
  const dateStr = now.toLocaleDateString("en-US", dateOpts);

  return (
    <div className="clock-cluster">
      <button
        type="button"
        className="clock-tz-btn"
        onClick={() => setTzIndex((i) => (i + 1) % TIMEZONES.length)}
        title="Click to cycle client timezones (Local, US, UK, EU, AU)"
      >
        <Globe size={12} />
        <span>{activeTz.label}</span>
      </button>
      <button
        type="button"
        className="live-clock-pill"
        onClick={() => setUse24h((v) => !v)}
        title="Click to toggle 12h / 24h clock format"
      >
        <Clock size={13} className="live-clock-icon" />
        <span className="live-clock-time mono">{timeStr}</span>
        <span className="live-clock-sep">·</span>
        <span className="live-clock-date">{dateStr}</span>
      </button>
    </div>
  );
}

export function getWpmTier(wpm) {
  if (wpm <= 0) return { label: "Standby", tone: "muted" };
  if (wpm < 30) return { label: "Warming Up", tone: "accent" };
  if (wpm < 55) return { label: "Steady", tone: "low" };
  if (wpm < 80) return { label: "Fast", tone: "medium" };
  return { label: "Pro", tone: "high" };
}

export function TypingTelemetryBar({
  words,
  chars,
  typingStats,
  onTogglePause,
  onResetTimer,
}) {
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

  let statusLabel = "Standby";
  let statusDotClass = "timer-dot-idle";
  if (hasStarted) {
    if (isPaused) {
      statusLabel = "Paused";
      statusDotClass = "timer-dot-paused";
    } else if (isTyping) {
      statusLabel = "Recording";
      statusDotClass = "timer-dot-active";
    } else {
      statusLabel = "Idle";
      statusDotClass = "timer-dot-paused";
    }
  }

  return (
    <div className="telemetry-strip">
      {/* 1. Live Typing Stopwatch / Clock Counter */}
      <div className="t-segment">
        <div className="t-segment-icon t-icon-accent">
          <Timer size={15} />
        </div>
        <div className="t-segment-main">
          <div className="t-label-row">
            <span className="t-label">Session Timer</span>
            <span className="t-state-pill">
              <span className={`timer-dot ${statusDotClass}`} />
              {statusLabel}
            </span>
          </div>
          <div className="t-value-row">
            <span className="t-value mono">{formatDuration(activeMs)}</span>
            <div className="t-controls">
              <button
                type="button"
                className="t-ctrl-btn"
                onClick={onTogglePause}
                disabled={!hasStarted}
                title={isPaused ? "Resume timer" : "Pause timer"}
              >
                {isPaused ? <Play size={11} /> : <Pause size={11} />}
              </button>
              <button
                type="button"
                className="t-ctrl-btn"
                onClick={onResetTimer}
                disabled={!hasStarted && activeMs === 0 && wpm === 0}
                title="Reset timer & WPM"
              >
                <RotateCcw size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="t-divider" />

      {/* 2. Words Per Minute (WPM) */}
      <div className="t-segment">
        <div className="t-segment-icon t-icon-low">
          <Gauge size={15} />
        </div>
        <div className="t-segment-main">
          <div className="t-label-row">
            <span className="t-label">Typing Speed</span>
            <span className={`t-tier t-tier-${tier.tone}`}>{tier.label}</span>
          </div>
          <div className="t-value-row">
            <span className="t-value mono">{wpm} <small>WPM</small></span>
            <span className="t-sub mono">Peak {peakWpm}</span>
          </div>
          <div className="t-meter">
            <div
              className="t-meter-fill"
              style={{ width: `${Math.min(100, Math.round((wpm / 100) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      <div className="t-divider" />

      {/* 3. Characters Per Minute & Volume */}
      <div className="t-segment">
        <div className="t-segment-icon t-icon-medium">
          <Zap size={15} />
        </div>
        <div className="t-segment-main">
          <div className="t-label-row">
            <span className="t-label">Keystroke Rate</span>
            <span className="t-sub mono">{readTimeSec > 0 ? `~${readTimeSec}s read` : "0s read"}</span>
          </div>
          <div className="t-value-row">
            <span className="t-value mono">{cpm} <small>CPM</small></span>
            <span className="t-sub mono">{words}w · {chars}c</span>
          </div>
        </div>
      </div>
    </div>
  );
}
