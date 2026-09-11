import { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  Pencil,
  ShieldCheck,
  ListChecks,
  Save,
  ToggleLeft,
  ToggleRight,
  PlusCircle,
  ShieldOff
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Button, CategoryField, CategoryPill, EmptyState, IconButton, Modal } from "../components/primitives";
import { CATEGORIES } from "../data/constants";
import { RESTRICTED_WORDS } from "../data/restrictedWords";

export function WordFormModal({ open, onClose, initial, categories, onConfirm }) {
  const [word, setWord] = useState("");
  const [level, setLevel] = useState("high");
  const [category, setCategory] = useState("Custom");
  const [reason, setReason] = useState("");
  const [fix, setFix] = useState("");

  useEffect(() => {
    if (open) {
      setWord(initial?.word || "");
      setLevel(initial?.level || "high");
      setCategory(initial?.category || "Custom");
      setReason(initial?.reason || "");
      setFix(initial?.fix || "");
    }
  }, [open, initial]);

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Word" : "Add Restricted Word"} width={520}>
      <div className="form-grid">
        <label className="field-label">Word or phrase
          <input className="text-input" value={word} onChange={(e) => setWord(e.target.value)} placeholder="e.g. bkash number" autoFocus />
        </label>
        <label className="field-label">Risk level
          <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
        <CategoryField id="word-category" value={category} onChange={setCategory} categories={categories} />
        <label className="field-label">Reason <span className="field-hint">(shown when this word is flagged)</span>
          <textarea className="text-input textarea-sm" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why is this risky to send on Fiverr?" />
        </label>
        <label className="field-label">Suggested safe rewrite <span className="field-hint">(optional — leave blank to suggest removing it)</span>
          <input className="text-input" value={fix} onChange={(e) => setFix(e.target.value)} placeholder="e.g. Fiverr's secure checkout" />
        </label>
      </div>
      <div className="modal-actions">
        <Button tone="ghost" onClick={onClose}>Cancel</Button>
        <Button
          tone="primary"
          icon={Save}
          disabled={!word.trim() || !reason.trim()}
          onClick={() => onConfirm({ word: word.trim().toLowerCase(), level, category: category.trim() || "Custom", reason: reason.trim(), fix: fix.trim() })}
        >
          {initial ? "Save Changes" : "Add Word"}
        </Button>
      </div>
    </Modal>
  );
}

export function WordRow({ item, onToggle, onEdit, onDelete }) {
  const levelColor = item.level === "high" ? "var(--high)" : item.level === "medium" ? "var(--medium)" : "var(--low)";
  return (
    <div className={`word-row${item.enabled ? "" : " word-row-disabled"}`}>
      <button
        type="button"
        className="word-toggle"
        onClick={() => onToggle(item)}
        title={item.enabled ? "Disable — stop flagging this" : "Enable — start flagging this again"}
      >
        {item.enabled ? <ToggleRight size={20} color="var(--accent)" /> : <ToggleLeft size={20} color="var(--muted)" />}
      </button>
      <div className="word-row-main">
        <div className="word-row-top">
          <span className="word-row-text">{item.word}</span>
          <span className="issue-badge" style={{ background: levelColor, color: item.level === "medium" ? "#1a1200" : item.level === "low" ? "#04231b" : "#fff" }}>{item.level}</span>
          <CategoryPill value={item.category} />
          {item.source === "custom" && <span className="custom-tag">Custom</span>}
        </div>
        <p className="word-row-reason">{item.reason}</p>
        {item.fix && <p className="word-row-fix">Suggested rewrite: &ldquo;{item.fix}&rdquo;</p>}
      </div>
      {item.source === "custom" && (
        <div className="word-row-actions">
          <IconButton icon={Pencil} label="Edit" onClick={() => onEdit(item)} />
          <IconButton icon={Trash2} label="Delete" tone="danger" onClick={() => onDelete(item)} />
        </div>
      )}
    </div>
  );
}

export function RestrictedWordsPage({ disabledBuiltinWords, customWords, categories, onToggleBuiltin, onAddCustom, onUpdateCustom, onToggleCustom, onDeleteCustom }) {
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [modal, setModal] = useState({ open: false, initial: null });

  const disabledSet = new Set(disabledBuiltinWords.map((w) => w.toLowerCase()));
  const combined = [
    ...RESTRICTED_WORDS.map((w) => ({ ...w, source: "builtin", enabled: !disabledSet.has(w.word.toLowerCase()) })),
    ...customWords.map((w) => ({ ...w, source: "custom" })),
  ];

  const q = query.trim().toLowerCase();
  const filtered = combined.filter((w) => {
    const matchesQ = !q || w.word.toLowerCase().includes(q) || w.category.toLowerCase().includes(q);
    const matchesLevel = levelFilter === "All" || w.level === levelFilter;
    const matchesSource = sourceFilter === "All" || w.source === sourceFilter;
    return matchesQ && matchesLevel && matchesSource;
  }).sort((a, b) => a.word.localeCompare(b.word));

  const activeCount = combined.filter((w) => w.enabled).length;
  const customCount = customWords.length;

  return (
    <div className="page-body">
      <PageHeader
        title="Restricted Words"
        subtitle="The words and phrases the scanner checks for — built-in plus your own."
        onMenu={() => {}}
        right={<Button tone="primary" icon={PlusCircle} onClick={() => setModal({ open: true, initial: null })}>Add Word</Button>}
      />

      <div className="stat-grid words-stat-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-accent"><ListChecks size={18} /></div>
          <div><span className="stat-value">{combined.length}</span><span className="stat-label">Total words</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-low"><ShieldCheck size={18} /></div>
          <div><span className="stat-value">{activeCount}</span><span className="stat-label">Actively scanned</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-medium"><PlusCircle size={18} /></div>
          <div><span className="stat-value">{customCount}</span><span className="stat-label">Your custom words</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-high"><ShieldOff size={18} /></div>
          <div><span className="stat-value">{disabledBuiltinWords.length}</span><span className="stat-label">Disabled built-ins</span></div>
        </div>
      </div>

      <div className="filter-row">
        <div className="search-box">
          <Search size={15} />
          <input placeholder="Search words or categories..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="chip-row">
          {["All", "high", "medium", "low"].map((l) => (
            <button key={l} className={`chip${levelFilter === l ? " chip-active" : ""}`} onClick={() => setLevelFilter(l)}>{l === "All" ? "All levels" : l}</button>
          ))}
        </div>
        <div className="chip-row">
          {["All", "builtin", "custom"].map((s) => (
            <button key={s} className={`chip${sourceFilter === s ? " chip-active" : ""}`} onClick={() => setSourceFilter(s)}>{s === "All" ? "All sources" : s === "builtin" ? "Built-in" : "Custom"}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Search} title="No words match" subtitle="Try a different search term or filter." />
      ) : (
        <div className="card">
          <div className="word-list">
            {filtered.map((item) => (
              <WordRow
                key={`${item.source}-${item.word}-${item.id || ""}`}
                item={item}
                onToggle={(w) => w.source === "builtin" ? onToggleBuiltin(w.word) : onToggleCustom(w)}
                onEdit={(w) => setModal({ open: true, initial: w })}
                onDelete={onDeleteCustom}
              />
            ))}
          </div>
        </div>
      )}

      <WordFormModal
        open={modal.open}
        initial={modal.initial}
        categories={categories}
        onClose={() => setModal({ open: false, initial: null })}
        onConfirm={(data) => {
          if (modal.initial) onUpdateCustom(modal.initial.id, data);
          else onAddCustom(data);
          setModal({ open: false, initial: null });
        }}
      />
    </div>
  );
}

/* ======================================================================
   CATEGORIES PAGE
====================================================================== */
