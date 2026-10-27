import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Copy as CopyIcon,
  Trash2,
  Files,
  ShieldCheck,
  Save,
  FlaskConical,
  Minus,
  Eye,
  Columns,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Dot
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { TypingTelemetryBar } from "../components/LiveClock";
import { Button, CategoryField, Modal } from "../components/primitives";
import { statusMeta } from "../lib/format";
import {
  applyAllHyphens,
  applyHyphen,
  applyAllDots,
  revertHyphensAndDots,
  auditFiverrCompliance,
  buildHighlightHtml,
  hyphenatePhrase
} from "../lib/scan";
import { IssueCard } from "./Dashboard";

const SAMPLE_RISKY_MESSAGE =
  "Hi! Thanks for reaching out. Can we jump on a quick call on WhatsApp or Skype to discuss your project? You can also email me or send payment via PayPal, and please leave a positive review afterwards!";

const DYNAMIC_VARIABLES = [
  { tag: "{ClientName}", label: "Client Name" },
  { tag: "{GigTitle}", label: "Gig Title" },
  { tag: "{DeliveryDays}", label: "Delivery Days" },
  { tag: "{OrderPrice}", label: "Order Price" },
  { tag: "{RevisionLimit}", label: "Revisions" },
];

export function MessageChecker({
  text,
  setText,
  category,
  setCategory,
  categories,
  scan,
  onSave,
  onOpenInsert,
  addToast,
  textareaRef,
  typingStats,
  onTogglePause,
  onResetTimer,
  onTextTyped,
  recordKeyDown,
  recordPaste,
  recordTextChange,
  onRegisterScan,
  onRecordPaste,
  onRecordCopy,
  onRecordObfuscate,
}) {
  const [viewMode, setViewMode] = useState("split"); // "split" | "inspector"
  const [rightTab, setRightTab] = useState("issues"); // "issues" | "audit"
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const meta = statusMeta(scan.status);
  const highlightHtml = useMemo(() => buildHighlightHtml(text, scan.found), [text, scan.found]);

  // Comprehensive Fiverr pre-send compliance audit
  const audit = useMemo(() => auditFiverrCompliance(text, scan), [text, scan]);

  // Debounce typing to register scan once user pauses or text stabilizes
  useEffect(() => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 5) return;
    const timer = setTimeout(() => {
      if (onRegisterScan) {
        onRegisterScan(trimmed, scan, "typed");
      }
    }, 1100);
    return () => clearTimeout(timer);
  }, [text, scan, onRegisterScan]);

  const handleCopy = () => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text).then(() => {
      if (onRecordCopy) onRecordCopy(text, scan);
      addToast(
        audit.isFullyCompliant
          ? "Copied! Message passed all 5 Fiverr compliance checks."
          : "Message copied to clipboard."
      );
    });
  };

  const handleClear = () => {
    setText("");
    if (onResetTimer) onResetTimer();
    addToast("Composer and timer cleared.");
  };

  const handleHyphenateOne = (item) => {
    const hyphenated = hyphenatePhrase(item.word);
    setText((prev) => applyHyphen(prev, item));
    if (onRecordObfuscate) onRecordObfuscate(1, "hyphen");
    addToast(`Hyphenated "${item.word}" → "${hyphenated}"`);
  };

  const handleHyphenateAll = () => {
    if (scan.found.length === 0) return;
    const count = scan.found.length;
    setText((prev) => applyAllHyphens(prev, scan.found));
    if (onRecordObfuscate) onRecordObfuscate(count, "hyphen");
    addToast(`Added middle hyphen (-) to ${count} conflict word${count === 1 ? "" : "s"}.`);
  };

  const handleDotSeparateAll = () => {
    if (scan.found.length === 0) return;
    const count = scan.found.length;
    setText((prev) => applyAllDots(prev, scan.found));
    if (onRecordObfuscate) onRecordObfuscate(count, "dot");
    addToast(`Obfuscated ${count} term${count === 1 ? "" : "s"} with dot (.) separation.`);
  };

  const handleRevertObfuscations = () => {
    setText((prev) => revertHyphensAndDots(prev));
    addToast("Reverted obfuscation hyphens and dots to clean text.");
  };

  const handleInsertVariable = (tag) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const before = text.slice(0, start);
      const after = text.slice(end);
      const nextText = `${before}${tag}${after}`;
      setText(nextText);
      if (recordPaste) recordPaste(tag.length); // Treat tag insert as paste so WPM isn't inflated
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + tag.length;
        textarea.focus();
      }, 20);
    } else {
      setText((prev) => (prev ? `${prev} ${tag}` : tag));
      if (recordPaste) recordPaste(tag.length);
    }
    addToast(`Inserted variable ${tag}`);
  };

  const handleLoadSample = () => {
    setText(SAMPLE_RISKY_MESSAGE);
    if (recordPaste) recordPaste(SAMPLE_RISKY_MESSAGE.length);
    if (onTextTyped) onTextTyped(SAMPLE_RISKY_MESSAGE);
    if (onRegisterScan) setTimeout(() => onRegisterScan(SAMPLE_RISKY_MESSAGE, scan, "sample"), 60);
    addToast("Sample message loaded — try Hyphenate (-) or Dot (.)!");
  };

  const safetyScore = Math.max(0, 100 - scan.score);

  return (
    <div className="page-body">
      <PageHeader
        title="Message Compliance Studio"
        subtitle="Scan Fiverr messages for restricted words, obfuscate conflict terms (- / .), and monitor live typing speed."
        onMenu={() => {}}
        right={
          <div className="badge-live">
            <span className="live-dot" /> Real-Time Scanner
          </div>
        }
      />

      {typingStats && (
        <TypingTelemetryBar
          words={words}
          chars={text.length}
          typingStats={typingStats}
          onTogglePause={onTogglePause}
          onResetTimer={onResetTimer}
        />
      )}

      <div className="checker-grid">
        {/* LEFT WORKBENCH: COMPOSER + HIGHLIGHTED INSPECTOR */}
        <div className="composer-stack">
          <div className="card composer-card">
            <div className="card-head composer-top-bar">
              <div className="toolbar-group">
                <span className="card-label">Composer</span>
                <div className="view-mode-tabs">
                  <button
                    type="button"
                    className={`view-tab${viewMode === "split" ? " view-tab-active" : ""}`}
                    onClick={() => setViewMode("split")}
                  >
                    <Columns size={12} /> Editor + Preview
                  </button>
                  <button
                    type="button"
                    className={`view-tab${viewMode === "inspector" ? " view-tab-active" : ""}`}
                    onClick={() => setViewMode("inspector")}
                  >
                    <Eye size={12} /> Editor Only
                  </button>
                </div>
              </div>

              <div className="composer-head-actions">
                <div className="toolbar-group">
                  <input
                    id="category-select"
                    list="checker-category-list"
                    className="select select-compact"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                    aria-label="Category"
                  />
                  <datalist id="checker-category-list">
                    {categories.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </div>
                <button
                  type="button"
                  className="chip-action-btn"
                  onClick={handleLoadSample}
                  title="Load a sample message with restricted words to test hyphenation"
                >
                  <FlaskConical size={12} /> Sample
                </button>
                <button
                  type="button"
                  className="chip-action-btn chip-action-accent"
                  onClick={onOpenInsert}
                >
                  <Files size={12} /> Templates
                </button>
              </div>
            </div>

            {/* DYNAMIC VARIABLE SHORTCUTS BAR */}
            <div className="var-shortcuts-bar">
              <span className="var-bar-title">Insert Variable:</span>
              <div className="var-chips">
                {DYNAMIC_VARIABLES.map((v) => (
                  <button
                    key={v.tag}
                    type="button"
                    className="var-chip-btn"
                    onClick={() => handleInsertVariable(v.tag)}
                    title={`Click to insert ${v.tag} at cursor`}
                  >
                    + {v.tag}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              ref={textareaRef}
              className="composer-textarea"
              value={text}
              onKeyDown={(e) => {
                if (recordKeyDown) recordKeyDown(e);
              }}
              onPaste={(e) => {
                const pasted = e.clipboardData?.getData("text") || "";
                if (recordPaste) recordPaste(pasted.length);
                if (onRecordPaste) onRecordPaste(pasted);
                if (onRegisterScan && pasted.trim().length >= 4) {
                  setTimeout(() => onRegisterScan(pasted, scan, "pasted"), 60);
                }
              }}
              onChange={(e) => {
                const prevVal = text;
                const nextVal = e.target.value;
                setText(nextVal);
                if (recordTextChange) recordTextChange(prevVal, nextVal);
                if (onTextTyped) onTextTyped(nextVal);
              }}
              placeholder="Write or paste your Fiverr message here... Conflict words will be detected automatically and can be hyphenated (e.g. pay-ment, em-ail, ca-ll) in one click."
              aria-label="Message content"
            />

            <div className="composer-footer">
              <div className="composer-footer-stats">
                <span className="char-meta">{words} words</span>
                <span className="char-meta-sep">·</span>
                <span className="char-meta">{text.length} / 2500 chars</span>
                <span className="char-meta-sep">·</span>
                <span className="char-meta" style={{ color: meta.color }}>
                  {scan.found.length === 0 ? "0 conflicts" : `${scan.found.length} conflict word${scan.found.length === 1 ? "" : "s"}`}
                </span>
              </div>
              <div className="composer-actions">
                <Button
                  tone="ghost"
                  icon={Trash2}
                  onClick={handleClear}
                  disabled={!text && (!typingStats || !typingStats.hasStarted)}
                >
                  Clear
                </Button>
                {scan.found.length > 0 && (
                  <>
                    <Button
                      tone="hyphen"
                      icon={Minus}
                      onClick={handleHyphenateAll}
                      title="Add a hyphen (-) to all detected conflict words"
                    >
                      Hyphenate (-)
                    </Button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-compact"
                      onClick={handleDotSeparateAll}
                      title="Obfuscate with dot (.): e.g. pay.ment"
                    >
                      <Dot size={14} /> Dot (.)
                    </button>
                  </>
                )}
                {text.includes("-") && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-compact"
                    onClick={handleRevertObfuscations}
                    title="Remove middle hyphens and dots to restore original text"
                  >
                    <RotateCcw size={12} /> Clean
                  </button>
                )}
                <Button
                  tone="secondary"
                  icon={CopyIcon}
                  onClick={handleCopy}
                  disabled={!text.trim()}
                >
                  Copy
                </Button>
                <Button
                  tone="primary"
                  icon={Save}
                  onClick={onSave}
                  disabled={!text.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>

          {viewMode === "split" && (
            <div className="card preview-card">
              <div className="card-head">
                <span className="card-label">Highlighted Conflict Preview</span>
                <span className="char-meta">
                  {scan.found.length > 0
                    ? "Hover any highlighted word to see hyphenated form & policy reason"
                    : "No restricted words highlighted"}
                </span>
              </div>
              <div className="preview-body" dangerouslySetInnerHTML={{ __html: highlightHtml || "" }} />
              {!text && (
                <div className="preview-placeholder">
                  Live highlighted preview will appear here as you type...
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT WORKBENCH: COMPLIANCE METER + AUDIT CHECKLIST + CONFLICT WORDS */}
        <div className="analysis-col">
          <div className="card status-card">
            <div className="status-compact-top">
              <div className="status-verdict-block">
                <span className="status-side-label">Compliance Status</span>
                <span className="status-side-value" style={{ color: meta.color }}>
                  <meta.Icon size={17} /> {meta.label}
                </span>
              </div>
              <div className="status-score-block">
                <span className="status-score-num mono" style={{ color: meta.color }}>{safetyScore}%</span>
                <span className="status-side-label">Safety Score</span>
              </div>
            </div>

            <div className="safety-progress-track">
              <div
                className="safety-progress-fill"
                style={{
                  width: `${safetyScore}%`,
                  background: meta.color,
                }}
              />
            </div>

            <div className="risk-pills">
              <div className={`risk-pill high${scan.highCount ? " active" : ""}`}>
                <span className="pill-count">{scan.highCount}</span>
                <span className="pill-label">High Risk</span>
              </div>
              <div className={`risk-pill med${scan.medCount ? " active" : ""}`}>
                <span className="pill-count">{scan.medCount}</span>
                <span className="pill-label">Medium</span>
              </div>
              <div className={`risk-pill low${scan.lowCount ? " active" : ""}`}>
                <span className="pill-count">{scan.lowCount}</span>
                <span className="pill-label">Low</span>
              </div>
            </div>
          </div>

          {/* TAB SWITCHER: CONFLICT WORDS vs 5-POINT PRE-SEND AUDIT */}
          <div className="card issues-card">
            <div className="card-head">
              <div className="toolbar-group">
                <button
                  type="button"
                  className={`view-tab${rightTab === "issues" ? " view-tab-active" : ""}`}
                  onClick={() => setRightTab("issues")}
                >
                  Conflict Words ({scan.found.length})
                </button>
                <button
                  type="button"
                  className={`view-tab${rightTab === "audit" ? " view-tab-active" : ""}`}
                  onClick={() => setRightTab("audit")}
                >
                  Fiverr Audit ({audit.passedChecks}/{audit.totalChecks})
                </button>
              </div>
              {rightTab === "issues" && scan.found.length > 0 && (
                <button
                  type="button"
                  className="hyphen-all-btn"
                  onClick={handleHyphenateAll}
                  title="Add a hyphen (-) in the middle of all detected conflict words"
                >
                  <Minus size={12} /> Hyphenate All
                </button>
              )}
            </div>

            {rightTab === "issues" ? (
              <div className="issues-body">
                {scan.found.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">{text ? <ShieldCheck size={28} /> : <Search size={28} />}</div>
                    <h4>{text ? "Message is Safe & Compliant" : "No Conflict Words"}</h4>
                    <p>
                      {text
                        ? "No restricted words found. You can safely copy and send this message."
                        : "Start typing in the composer to detect restricted words and hyphenate them."}
                    </p>
                  </div>
                ) : (
                  scan.found.map((item) => (
                    <IssueCard
                      key={item.word}
                      item={item}
                      onHyphenate={handleHyphenateOne}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="audit-body">
                <div className="audit-meter-banner">
                  <div className="audit-meter-info">
                    <span className="audit-meter-title">Pre-Send Compliance Audit</span>
                    <span className="audit-meter-score mono">{audit.auditScore}% Passed</span>
                  </div>
                  <div className="audit-meter-bar">
                    <div
                      className="audit-meter-fill"
                      style={{
                        width: `${audit.auditScore}%`,
                        background: audit.isFullyCompliant ? "var(--safe)" : "var(--medium)",
                      }}
                    />
                  </div>
                </div>

                <div className="audit-checklist">
                  {audit.checks.map((c) => (
                    <div key={c.id} className={`audit-item audit-item-${c.passed ? "pass" : "fail"}`}>
                      <div className="audit-icon">
                        {c.passed ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                      </div>
                      <div className="audit-content">
                        <div className="audit-label">{c.label}</div>
                        <div className="audit-desc">{c.desc}</div>
                      </div>
                      <span className={`audit-tag mono ${c.passed ? "audit-tag-pass" : "audit-tag-fail"}`}>
                        {c.passed ? "CLEAR" : "CHECK"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="audit-length-box">
                  <div className="t-label-row">
                    <span className="t-label">Fiverr Message Length</span>
                    <span className="t-sub mono">{text.length} / 2500 chars</span>
                  </div>
                  <div className="t-meter">
                    <div
                      className="t-meter-fill"
                      style={{ width: `${Math.min(100, (text.length / 2500) * 100)}%` }}
                    />
                  </div>
                  <span className="audit-hint">
                    {text.length === 0
                      ? "Fiverr maximum message length is 2,500 characters."
                      : text.length <= 800
                      ? "✓ Optimal length: concise messages have 35% higher response rate on Fiverr."
                      : "Tip: For very long messages, consider organizing into bullet points."}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SaveMessageModal({ open, onClose, defaultContent, defaultCategory, categories, onConfirm }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(defaultCategory || "General");
  const [content, setContent] = useState(defaultContent || "");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setCategory(defaultCategory || "General");
      setContent(defaultContent || "");
      setTags("");
    }
  }, [open, defaultContent, defaultCategory]);

  return (
    <Modal open={open} onClose={onClose} title="Save Message">
      <div className="form-grid">
        <label className="field-label">Title
          <input className="text-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Website Update Follow Up" autoFocus />
        </label>
        <CategoryField id="save-msg-category" value={category} onChange={setCategory} categories={categories} />
        <label className="field-label">Content
          <textarea className="text-input textarea-sm" value={content} onChange={(e) => setContent(e.target.value)} rows={5} />
        </label>
        <label className="field-label">Tags <span className="field-hint">(comma separated, optional)</span>
          <input className="text-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. intro, delivery" />
        </label>
      </div>
      <div className="modal-actions">
        <Button tone="ghost" onClick={onClose}>Cancel</Button>
        <Button
          tone="primary"
          icon={Save}
          disabled={!title.trim() || !content.trim()}
          onClick={() => {
            onConfirm({
              title: title.trim(),
              category,
              content,
              tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
            });
          }}
        >
          Save Message
        </Button>
      </div>
    </Modal>
  );
}

