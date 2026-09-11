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
  Save,
  TrendingUp,
  Wand2
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/primitives";
import { statusMeta, timeAgo } from "../lib/format";

export function Dashboard({ messages, templates, activity, setPage, startNewCheck }) {
  const safeCount = messages.filter((m) => m.riskStatus === "safe").length;
  const attentionCount = messages.filter((m) => m.riskStatus !== "safe").length;

  const stats = [
    { label: "Messages Checked", value: messages.length, icon: MessageSquareText, tone: "accent" },
    { label: "Safe Messages", value: safeCount, icon: ShieldCheck, tone: "low" },
    { label: "Needing Attention", value: attentionCount, icon: ShieldAlert, tone: "high" },
    { label: "Saved Templates", value: templates.length, icon: Files, tone: "medium" },
  ];

  const now = Date.now();
  const oneWeek = 7 * 86400000;
  const thisWeek = messages.filter((m) => now - m.createdAt < oneWeek);
  const lastWeek = messages.filter((m) => now - m.createdAt >= oneWeek && now - m.createdAt < oneWeek * 2);
  const thisWeekSafe = thisWeek.filter((m) => m.riskStatus === "safe").length;
  const thisWeekAttention = thisWeek.length - thisWeekSafe;
  const weekDelta = thisWeek.length - lastWeek.length;
  const safePct = thisWeek.length ? Math.round((thisWeekSafe / thisWeek.length) * 100) : 0;

  const topTemplates = [...templates].filter((t) => t.usageCount > 0).sort((a, b) => b.usageCount - a.usageCount).slice(0, 3);

  return (
    <div className="page-body">
      <PageHeader title="Dashboard" subtitle="Your Fiverr message safety, at a glance." onMenu={() => {}} />

      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon stat-icon-${s.tone}`}><s.icon size={18} /></div>
            <div>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <button className="qa-card" onClick={() => setPage("checker")}>
          <MessageSquareText size={18} />
          <span>Check New Message</span>
          <ArrowRight size={14} className="qa-arrow" />
        </button>
        <button className="qa-card" onClick={() => setPage("templates")}>
          <Plus size={18} />
          <span>Create Template</span>
          <ArrowRight size={14} className="qa-arrow" />
        </button>
        <button className="qa-card" onClick={() => setPage("saved")}>
          <BookmarkCheck size={18} />
          <span>View Saved Messages</span>
          <ArrowRight size={14} className="qa-arrow" />
        </button>
      </div>

      <div className="week-card card">
        <div className="card-head">
          <span className="card-label">This Week</span>
          {lastWeek.length > 0 && (
            <span className={`week-delta ${weekDelta >= 0 ? "week-delta-up" : "week-delta-down"}`}>
              <TrendingUp size={12} /> {weekDelta >= 0 ? "+" : ""}{weekDelta} vs last week
            </span>
          )}
        </div>
        <div className="week-body">
          <div className="week-stat">
            <span className="week-stat-value">{thisWeek.length}</span>
            <span className="week-stat-label">Messages checked</span>
          </div>
          <div className="week-bar-wrap">
            <div className="week-bar">
              <div className="week-bar-fill" style={{ width: `${safePct}%` }} />
            </div>
            <div className="week-bar-legend">
              <span><span className="dot dot-safe" /> {thisWeekSafe} safe</span>
              <span><span className="dot dot-high" /> {thisWeekAttention} needed attention</span>
            </div>
          </div>
          {topTemplates.length > 0 && (
            <div className="week-top-templates">
              <span className="week-stat-label">Most used templates</span>
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
            <span className="card-label">Recent Messages</span>
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
          <div className="card-head"><span className="card-label">Recent Activity</span></div>
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

/* ======================================================================
   MESSAGE CHECKER
====================================================================== */
export function IssueCard({ item, onFix }) {
  return (
    <div className={`issue-card issue-${item.level}`}>
      <div className="issue-top">
        <span className={`issue-dot issue-dot-${item.level}`} />
        <span className="issue-keyword">&ldquo;{item.word}&rdquo;</span>
        <span className={`issue-badge issue-badge-${item.level}`}>{item.level}</span>
      </div>
      <div className="flag-notice">
        <AlertTriangle size={12} className="flag-icon" />
        <span>{item.reason}</span>
      </div>
      <div className="issue-suggestion">
        {item.fix
          ? <>Suggested fix: replace with <strong>&ldquo;{item.fix}&rdquo;</strong>.</>
          : "Suggested fix: remove this phrase and keep the conversation inside Fiverr's messaging and payment system."}
      </div>
      <div className="issue-bottom-row">
        <div className="issue-cat">Category: {item.category}</div>
        {onFix && (
          <button type="button" className="fix-btn" onClick={() => onFix(item)}>
            <Wand2 size={12} /> Apply fix
          </button>
        )}
      </div>
    </div>
  );
}

