import React from "react";
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
  Minus
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/primitives";
import { formatDuration, statusMeta, timeAgo } from "../lib/format";
import { hyphenatePhrase } from "../lib/scan";

export function Dashboard({ messages, templates, activity, setPage, startNewCheck, typingStats }) {
  const safeCount = messages.filter((m) => m.riskStatus === "safe").length;
  const attentionCount = messages.filter((m) => m.riskStatus !== "safe").length;

  const stats = [
    { label: "Messages Checked", value: messages.length, icon: MessageSquareText, tone: "accent" },
    { label: "Compliant Messages", value: safeCount, icon: ShieldCheck, tone: "low" },
    { label: "Flagged Drafts", value: attentionCount, icon: ShieldAlert, tone: "high" },
    { label: "Saved Templates", value: templates.length, icon: Files, tone: "medium" },
  ];

  const now = Date.now();
  const oneWeek = 7 * 86400000;
  const thisWeek = messages.filter((m) => now - m.createdAt < oneWeek);
  const lastWeek = messages.filter((m) => now - m.createdAt >= oneWeek && now - m.createdAt < oneWeek * 2);
  const thisWeekSafe = thisWeek.filter((m) => m.riskStatus === "safe").length;
  const thisWeekAttention = thisWeek.length - thisWeekSafe;
  const weekDelta = thisWeek.length - lastWeek.length;
  const safePct = thisWeek.length ? Math.round((thisWeekSafe / thisWeek.length) * 100) : 100;

  const topTemplates = [...templates].filter((t) => t.usageCount > 0).sort((a, b) => b.usageCount - a.usageCount).slice(0, 3);

  return (
    <div className="page-body">
      <PageHeader title="Workspace Overview" subtitle="Monitor message compliance, templates, and live typing performance." onMenu={() => {}} />

      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon stat-icon-${s.tone}`}><s.icon size={18} /></div>
            <div>
              <span className="stat-value mono">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </div>
        ))}
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

      <div className="dash-columns">
        <div className="card">
          <div className="card-head">
            <span className="card-label">Recent Saved Messages</span>
            <button className="link-btn" onClick={() => setPage("saved")}>View all</button>
          </div>
          <div className="list-body">
            {messages.length === 0 ? (
              <EmptyState icon={BookmarkCheck} title="No saved messages yet" subtitle="Save messages from the checker to see them here." actionLabel="Check a message" onAction={() => setPage("checker")} />
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
                      <span className="status-chip" style={{ color: meta.color, borderColor: meta.color }}>{meta.label}</span>
                      <span className="recent-time"><Clock size={11} /> {timeAgo(m.updatedAt)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-label">Activity Log</span></div>
          <div className="list-body">
            {activity.length === 0 ? (
              <EmptyState icon={ListChecks} title="No activity yet" subtitle="Actions you take will show up here." />
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
