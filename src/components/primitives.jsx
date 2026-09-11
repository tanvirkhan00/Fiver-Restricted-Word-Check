import React from "react";
import {
  Plus,
  Trash2,
  X,
  Check,
  AlertTriangle,
  FileText
} from "lucide-react";
import { statusMeta } from "../lib/format";

export function Badge({ children, tone = "muted" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function IconButton({ icon: Icon, label, onClick, tone = "ghost", size = 16 }) {
  return (
    <button className={`icon-btn icon-btn-${tone}`} onClick={onClick} aria-label={label} title={label} type="button">
      <Icon size={size} />
    </button>
  );
}

export function Button({ children, icon: Icon, tone = "secondary", onClick, type = "button", disabled, full }) {
  return (
    <button
      type={type}
      className={`btn btn-${tone}${full ? " btn-full" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon size={15} />}
      <span>{children}</span>
    </button>
  );
}

export function EmptyState({ icon: Icon = FileText, title, subtitle, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon size={26} /></div>
      <h4>{title}</h4>
      {subtitle && <p>{subtitle}</p>}
      {actionLabel && <Button icon={Plus} tone="primary" onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: width }} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h3>{title}</h3>
          <IconButton icon={X} label="Close" onClick={onClose} />
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({ config, onClose }) {
  if (!config) return null;
  return (
    <Modal open onClose={onClose} title={config.title} width={420}>
      <p className="confirm-message">{config.message}</p>
      <div className="modal-actions">
        <Button tone="ghost" onClick={onClose}>Cancel</Button>
        <Button tone="danger" icon={Trash2} onClick={() => { config.onConfirm(); onClose(); }}>
          {config.confirmLabel || "Delete"}
        </Button>
      </div>
    </Modal>
  );
}

export function ToastStack({ toasts }) {
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.tone}`}>
          {t.tone === "danger" ? <AlertTriangle size={15} /> : <Check size={15} />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export function RiskGauge({ score, status }) {
  const meta = statusMeta(status);
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, score);
  const offset = c - (pct / 100) * c;
  return (
    <div className="gauge">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--surface3)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r} fill="none" stroke={meta.color} strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 70 70)" style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(.4,0,.2,1), stroke .3s" }}
        />
      </svg>
      <div className="gauge-center">
        <span className="gauge-score">{score}</span>
        <span className="gauge-label" style={{ color: meta.color }}>{meta.label}</span>
      </div>
    </div>
  );
}

export function CategoryPill({ value }) {
  return <span className="cat-pill">{value}</span>;
}

/* Type-or-pick category input. Backed by a native <datalist> so people get
   autocomplete suggestions from existing categories but can freely type
   a brand-new one — saving a message with it is what "creates" it. */
export function CategoryField({ id, value, onChange, categories, label = "Category" }) {
  const listId = `${id}-catlist`;
  return (
    <label className="field-label" htmlFor={id}>
      {label} <span className="field-hint">(pick one or type a new category)</span>
      <input
        id={id}
        list={listId}
        className="text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. General"
      />
      <datalist id={listId}>
        {categories.map((c) => <option key={c} value={c} />)}
      </datalist>
    </label>
  );
}
