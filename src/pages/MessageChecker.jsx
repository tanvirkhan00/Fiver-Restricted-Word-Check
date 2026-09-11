import { useState, useEffect, useMemo } from "react";
import {
  Tags,
  Search,
  Copy as CopyIcon,
  Trash2,
  Files,
  ShieldCheck,
  Save,
  Wand2
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Button, CategoryField, Modal, RiskGauge } from "../components/primitives";
import { statusMeta } from "../lib/format";
import { applyAllFixes, applyFix, buildHighlightHtml } from "../lib/scan";
import { IssueCard } from "./Dashboard";

export function MessageChecker({
  text, setText, category, setCategory, categories, scan, onSave, onOpenInsert, addToast, textareaRef,
}) {
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const meta = statusMeta(scan.status);
  const highlightHtml = useMemo(() => buildHighlightHtml(text, scan.found), [text, scan.found]);

  const handleCopy = () => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text).then(() => addToast("Message copied to clipboard."));
  };
  const handleClear = () => {
    setText("");
    addToast("Message cleared.");
  };
  const handleFixOne = (item) => {
    setText((prev) => applyFix(prev, item));
    addToast(`Rewrote "${item.word}".`);
  };
  const handleFixAll = () => {
    setText((prev) => applyAllFixes(prev, scan.found));
    addToast(`Applied ${scan.found.length} suggested fix${scan.found.length === 1 ? "" : "es"}.`);
  };

  return (
    <div className="page-body">
      <PageHeader
        title="Message Checker"
        subtitle="Analyze your Fiverr messages before sending them."
        onMenu={() => {}}
        right={
          <div className="badge-live">
            <span className="live-dot" /> Live Scanning
          </div>
        }
      />

      <div className="checker-grid">
        {/* LEFT: composer */}
        <div className="card composer-card">
          <div className="card-head">
            <span className="card-label">Message Composer</span>
            <span className="char-meta">{text.length} chars</span>
          </div>

          <div className="composer-toolbar">
            <label className="field-label field-label-inline" htmlFor="category-select">Category</label>
            <input
              id="category-select"
              list="checker-category-list"
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Choose or type a category"
            />
            <datalist id="checker-category-list">
              {categories.map((c) => <option key={c} value={c} />)}
            </datalist>
            <button className="link-btn insert-link" onClick={onOpenInsert}>
              <Files size={13} /> Insert Template
            </button>
          </div>

          <textarea
            ref={textareaRef}
            className="composer-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your Fiverr message here to scan for policy violations and risky content..."
            aria-label="Message content"
          />

          <div className="composer-footer">
            <span className="char-meta">{words} words</span>
            <div className="composer-actions">
              <Button tone="ghost" icon={Trash2} onClick={handleClear}>Clear</Button>
              <Button tone="secondary" icon={CopyIcon} onClick={handleCopy}>Copy</Button>
              <Button tone="primary" icon={Save} onClick={onSave} disabled={!text.trim()}>Save Message</Button>
            </div>
          </div>
        </div>

        {/* RIGHT: analysis */}
        <div className="analysis-col">
          <div className="card status-card">
            <div className="card-head"><span className="card-label">Safety Analysis</span></div>
            <div className="status-body">
              <RiskGauge score={scan.score} status={scan.status} />
              <div className="status-side">
                <span className="status-side-label">Overall Status</span>
                <span className="status-side-value" style={{ color: meta.color }}>
                  <meta.Icon size={16} /> {meta.label.toUpperCase()}
                </span>
              </div>
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

          <div className="card issues-card">
            <div className="card-head">
              <span className="card-label">Detected Issues</span>
              {scan.found.length > 0 ? (
                <button type="button" className="fix-all-btn" onClick={handleFixAll}>
                  <Wand2 size={12} /> Fix all ({scan.found.length})
                </button>
              ) : (
                <span className="char-meta">{scan.found.length} found</span>
              )}
            </div>
            <div className="issues-body">
              {scan.found.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">{text ? <ShieldCheck size={26} /> : <Search size={26} />}</div>
                  <h4>{text ? "Message looks safe!" : "No issues detected"}</h4>
                  <p>{text ? "No potential Fiverr policy violations detected." : "Start typing to scan your message."}</p>
                </div>
              ) : (
                scan.found.map((item) => <IssueCard key={item.word} item={item} onFix={handleFixOne} />)
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card preview-card">
        <div className="card-head"><span className="card-label">Highlighted Preview</span></div>
        <div className="preview-body" dangerouslySetInnerHTML={{ __html: highlightHtml || "" }} />
        {!text && <div className="preview-placeholder">Highlighted preview will appear here...</div>}
      </div>
    </div>
  );
}

/* ======================================================================
   SAVE MESSAGE MODAL
====================================================================== */
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

/* ======================================================================
   TEMPLATE EDITOR MODAL
====================================================================== */
