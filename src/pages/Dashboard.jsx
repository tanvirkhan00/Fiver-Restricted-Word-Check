import React, { useState } from "react";
import {
  MessageSquareText,
  BookmarkCheck,
  Plus,
  Files,
  Check,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  ListChecks,
  TrendingUp,
  Gauge,
  Keyboard,
  Minus,
  Copy,
  Sparkles,
  ClipboardCheck,
  FileText
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/primitives";
import { formatDuration, statusMeta, timeAgo } from "../lib/format";
import { hyphenatePhrase } from "../lib/scan";

export function Dashboard({
  messages = [],
  templates = [],
  activity = [],
  metrics = {},
  recentScans = [],
  setPage,
  startNewCheck,
  typingStats,
  onLoadScanToChecker,
  onCopyText,
}) {
  const [activeTab, setActiveTab] = useState("scans"); // "scans" | "saved"

  const safeSaved = messages.filter((m) => m.riskStatus === "safe").length;
  const attentionSaved = messages.filter((m) => m.riskStatus !== "safe").length;

  // Real live numbers that update whenever the user types, pastes, or checks messages
  const totalChecked = Math.max(messages.length, (metrics.totalScans || 0) + (messages.length ? 0 : 0)) || (metrics.totalScans || 0);
  const compliantTotal = (metrics.safeScans || 0) > 0 ? metrics.safeScans : safeSaved;
  const flaggedTotal = (metrics.flaggedScans || 0) > 0 ? metrics.flaggedScans : attentionSaved;
  const copiedTotal = metrics.copiedCount || 0;

  const stats = [
    {
      label: "Messages Checked",
      value: totalChecked,
      sub: `${metrics.wordsChecked || 0} words analyzed`,
      icon: MessageSquareText,
      tone: "accent",
    },
    {
      label: "Compliant Messages",
      value: compliantTotal,
      sub: totalChecked > 0 ? `${Math.round((compliantTotal / Math.max(1, totalChecked)) * 100)}% compliance rate` : "100% safe",
      icon: ShieldCheck,
      tone: "low",
    },
    {
      label: "Flagged Drafts",
      value: flaggedTotal,
      sub: `${metrics.conflictsIntercepted || 0} conflicts intercepted`,
      icon: ShieldAlert,
      tone: "high",
    },
    {
      label: "Copied for Fiverr",
      value: copiedTotal,
      sub: `${metrics.pastedCount || 0} pasted · ${metrics.hyphenatedCount || 0} obfuscated`,
      icon: ClipboardCheck,
      tone: "medium",
    },
  ];

  // 7-day health calculating from BOTH live scans and saved drafts
  const now = Date.now();
  const oneWeek = 7 * 86400000;

  const allRecentItems = [
    ...recentScans.map((s) => ({ id: s.id, timestamp: s.timestamp, riskStatus: s.riskStatus })),
    ...messages.map((m) => ({ id: m.id, timestamp: m.createdAt, riskStatus: m.riskStatus })),
  ];

  const thisWeek = allRecentItems.filter((m) => now - (m.timestamp || 0) < oneWeek);
  const lastWeek = allRecentItems.filter(
    (m) => now - (m.timestamp || 0) >= oneWeek && now - (m.timestamp || 0) < oneWeek * 2
  );
  const thisWeekSafe = thisWeek.filter((m) => m.riskStatus === "safe").length;
  const thisWeekAttention = thisWeek.length - thisWeekSafe;
  const weekDelta = thisWeek.length - lastWeek.length;
  const safePct = thisWeek.length ? Math.round((thisWeekSafe / thisWeek.length) * 100) : 100;

  const topTemplates = [...templates]
    .filter((t) => t.usageCount > 0)
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 3);

  return (
    <div className="page-body">
      <PageHeader
        title="Workspace Overview"
        subtitle="Monitor live message compliance, typing telemetry, and Fiverr safety audits."
        onMenu={() => {}}
      />

      {/* PRIMARY 4 STAT CARDS */}
      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon stat-icon-${s.tone}`}>
              <s.icon size={18} />
            </div>
            <div>
              <span className="stat-value mono">{s.value}</span>
              <span className="stat-label">{s.label}</span>
              {s.sub && <span className="stat-sub">{s.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* SECONDARY REAL-TIME TELEMETRY STRIP */}
      <div className="dash-secondary-grid">
        <div className="sec-card">
          <div className="sec-card-left">
            <span className="sec-card-label">Pastes Checked</span>
            <span className="sec-card-sub">Multi-char clipboard inputs</span>
          </div>
          <span className="sec-card-val">{metrics.pastedCount || 0}</span>
        </div>
        <div className="sec-card">
          <div className="sec-card-left">
            <span className="sec-card-label">Conflict Words Fixed</span>
            <span className="sec-card-sub">Hyphen (-) &amp; Dot (.) terms</span>
          </div>
          <span className="sec-card-val">{metrics.hyphenatedCount || 0}</span>
        </div>
        <div className="sec-card">
          <div className="sec-card-left">
            <span className="sec-card-label">Saved Drafts</span>
            <span className="sec-card-sub">Permanent messages archive</span>
          </div>
          <span className="sec-card-val">{messages.length}</span>
        </div>
        <div className="sec-card">
          <div className="sec-card-left">
            <span className="sec-card-label">Compliance Templates</span>
            <span className="sec-card-sub">Reusable fast responses</span>
          </div>
          <span className="sec-card-val">{templates.length}</span>
        </div>
      </div>

      <div className="quick-actions">
        <button className="qa-card" onClick={startNewCheck || (() => setPage("checker"))}>
          <MessageSquareText size={18} />
          <span>Open Message Checker</span>
          <ArrowRight size={14} className="qa-arrow" />
        </button>
        <button className="qa-card" onClick={() => setPage("templates")}>
          <Plus size={18} />
          <span>Manage Templates</span>
          <ArrowRight size={14} className="qa-arrow" />
        </button>
        <button className="qa-card" onClick={() => setPage("saved")}>
          <BookmarkCheck size={18} />
          <span>Saved Drafts Archive</span>
          <ArrowRight size={14} className="qa-arrow" />
        </button>
      </div>

      {typingStats && (
        <div className="card dash-typing-card">
          <div className="card-head">
            <span className="card-label">Live Typing &amp; Session Telemetry</span>
            <button className="link-btn" onClick={startNewCheck || (() => setPage("checker"))}>
              Go to Composer <ArrowRight size={12} />
            </button>
          </div>
          <div className="dash-typing-body">
            <div className="dash-typing-metric">
              <div className="stat-icon stat-icon-low"><Gauge size={18} /></div>
              <div>
                <span className="stat-value mono">{typingStats.wpm} <small className="dash-unit">WPM</small></span>
                <span className="stat-label">Words Per Minute</span>
              </div>
            </div>
            <div className="dash-typing-metric">
              <div className="stat-icon stat-icon-accent"><Clock size={18} /></div>
              <div>
                <span className="stat-value mono">{formatDuration(typingStats.activeMs)}</span>
                <span className="stat-label">Active Session Clock</span>
              </div>
            </div>
            <div className="dash-typing-metric">
              <div className="stat-icon stat-icon-medium"><Keyboard size={18} /></div>
              <div>
                <span className="stat-value mono">{typingStats.peakWpm} <small className="dash-unit">WPM</small></span>
                <span className="stat-label">Peak Speed</span>
              </div>
            </div>
            <div className="dash-typing-metric">
              <div className="stat-icon stat-icon-accent"><TrendingUp size={18} /></div>
              <div>
                <span className="stat-value mono">{typingStats.cpm} <small className="dash-unit">CPM</small></span>
                <span className="stat-label">Characters / Min</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7-DAY COMPLIANCE HEALTH */}
      <div className="week-card card">
        <div className="card-head">
          <span className="card-label">7-Day Compliance Health</span>
          {lastWeek.length > 0 && (
            <span className={`week-delta ${weekDelta >= 0 ? "week-delta-up" : "week-delta-down"}`}>
              <TrendingUp size={12} /> {weekDelta >= 0 ? "+" : ""}{weekDelta} vs last week
            </span>
          )}
        </div>
        <div className="week-body">
          <div className="week-stat">
            <span className="week-stat-value">{thisWeek.length}</span>
            <span className="week-stat-label">Checked this week</span>
          </div>
          <div className="week-bar-wrap">
            <div className="week-bar">
              <div className="week-bar-fill" style={{ width: `${safePct}%` }} />
            </div>
            <div className="week-bar-legend">
              <span><span className="dot dot-safe" /> {thisWeekSafe} compliant</span>
              <span><span className="dot dot-high" /> {thisWeekAttention} flagged</span>
            </div>
          </div>
          {topTemplates.length > 0 && (
            <div className="week-top-templates">
              <span className="week-stat-label">Top templates</span>
              {topTemplates.map((t) => (
                <div className="week-top-row" key={t.id}>
                  <span>{t.name}</span>
                  <span className="usage-badge"><TrendingUp size={10} /> {t.usageCount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RECENT SCANNED MESSAGES & SAVED DRAFTS + ACTIVITY LOG */}
      <div className="dash-columns">
        <div className="card">
          <div className="card-head">
            <div className="dash-tab-group">
              <button
                type="button"
                className={`dash-tab-btn ${activeTab === "scans" ? "dash-tab-btn-active" : ""}`}
                onClick={() => setActiveTab("scans")}
              >
                Live Scanned ({recentScans.length})
              </button>
              <button
                type="button"
                className={`dash-tab-btn ${activeTab === "saved" ? "dash-tab-btn-active" : ""}`}
                onClick={() => setActiveTab("saved")}
              >
                Saved Drafts ({messages.length})
              </button>
            </div>
            {activeTab === "saved" ? (
              <button className="link-btn" onClick={() => setPage("saved")}>View all</button>
            ) : (
              <button className="link-btn" onClick={startNewCheck || (() => setPage("checker"))}>
                Composer <ArrowRight size={12} />
              </button>
            )}
          </div>

          <div className="list-body">
            {activeTab === "scans" ? (
              recentScans.length === 0 ? (
                <EmptyState
                  icon={MessageSquareText}
                  title="No scanned messages yet"
                  subtitle="Type or paste any message in Message Checker to see live audits here."
                  actionLabel="Check a message"
                  onAction={startNewCheck || (() => setPage("checker"))}
                />
              ) : (
                recentScans.slice(0, 6).map((scan) => {
                  const meta = statusMeta(scan.riskStatus);
                  return (
                    <div className="recent-row" key={scan.id}>
                      <div className="recent-row-main">
                        <span className="scan-excerpt">{scan.textExcerpt}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                          <span className="scan-source-pill">{scan.source || "typed"}</span>
                          <span className="recent-cat">{scan.wordCount} words</span>
                          {scan.issuesCount > 0 && (
                            <span style={{ fontSize: "10.5px", color: "var(--high)", fontWeight: 600 }}>
                              · {scan.issuesCount} conflict{scan.issuesCount === 1 ? "" : "s"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="recent-row-meta">
                        <span className="status-chip" style={{ color: meta.color, borderColor: meta.color }}>
                          {meta.label}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          {onLoadScanToChecker && (
                            <button
                              type="button"
                              className="link-btn"
                              style={{ fontSize: "11px" }}
                              onClick={() => onLoadScanToChecker(scan.fullText || scan.textExcerpt)}
                              title="Load back into Composer"
                            >
                              Load
                            </button>
                          )}
                          <span className="recent-time"><Clock size={11} /> {timeAgo(scan.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              messages.length === 0 ? (
                <EmptyState
                  icon={BookmarkCheck}
                  title="No saved messages yet"
                  subtitle="Save messages from the checker to see them here."
                  actionLabel="Check a message"
                  onAction={() => setPage("checker")}
                />
              ) : (
                messages.slice(0, 5).map((m) => {
                  const meta = statusMeta(m.riskStatus);
                  return (
                    <div className="recent-row" key={m.id}>
                      <div className="recent-row-main">
                        <span className="recent-title">{m.title}</span>
                        <span className="recent-cat">{m.category}</span>
                      </div>
                      <div className="recent-row-meta">
                        <span className="status-chip" style={{ color: meta.color, borderColor: meta.color }}>
                          {meta.label}
                        </span>
                        <span className="recent-time"><Clock size={11} /> {timeAgo(m.updatedAt)}</span>
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* ACTIVITY LOG */}
        <div className="card">
          <div className="card-head">
            <span className="card-label">Activity Log</span>
          </div>
          <div className="list-body">
            {activity.length === 0 ? (
              <EmptyState
                icon={ListChecks}
                title="No activity yet"
                subtitle="Actions like typing, checking, pasting, and copying will stream here."
              />
            ) : (
              activity.slice(0, 8).map((a) => (
                <div className="activity-row" key={a.id}>
                  <Check size={13} className="activity-check" />
                  <span className="activity-label">{a.label}</span>
                  <span className="activity-time">{timeAgo(a.timestamp)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function IssueCard({ item, onHyphenate }) {
  const hyphenated = hyphenatePhrase(item.word);
  return (
    <div className={`issue-card issue-${item.level}`}>
      <div className="issue-top">
        <span className={`issue-dot issue-dot-${item.level}`} />
        <span className="issue-keyword">&ldquo;{item.word}&rdquo;</span>
        <ArrowRight size={11} className="issue-arrow" />
        <span className="issue-hyphen-preview mono">&ldquo;{hyphenated}&rdquo;</span>
        <span className={`issue-badge issue-badge-${item.level}`}>{item.level}</span>
      </div>
      <div className="flag-notice">
        <AlertTriangle size={12} className="flag-icon" />
        <span>{item.reason}</span>
      </div>
      <div className="issue-bottom-row">
        <div className="issue-cat">{item.category}</div>
        {onHyphenate && (
          <button
            type="button"
            className="hyphen-btn"
            onClick={() => onHyphenate(item)}
            title={`Insert hyphen in the middle: "${item.word}" → "${hyphenated}"`}
          >
            <Minus size={12} /> Add Hyphen ({hyphenated})
          </button>
        )}
      </div>
    </div>
  );
}
