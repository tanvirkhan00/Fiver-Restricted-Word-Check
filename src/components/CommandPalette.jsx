import { useState, useEffect, useRef } from "react";
import {
  Search,
  Files,
  ChevronRight,
  Command
} from "lucide-react";
import { NAV_ITEMS } from "../data/navItems";

export function CommandPalette({ open, onClose, onNavigate, templates, onUseTemplate }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const pages = NAV_ITEMS.filter((p) => !q || p.label.toLowerCase().includes(q));
  const tpls = q ? templates.filter((t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)).slice(0, 6) : [];

  return (
    <div className="modal-overlay palette-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="palette-card" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette-search">
          <Search size={16} />
          <input
            ref={inputRef}
            placeholder="Jump to a page or template..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
          />
          <span className="palette-kbd">Esc</span>
        </div>
        <div className="palette-results">
          {pages.length > 0 && (
            <div className="palette-group">
              <span className="palette-group-title">Pages</span>
              {pages.map((p) => (
                <button key={p.id} className="palette-item" onClick={() => { onNavigate(p.id); onClose(); }}>
                  <p.icon size={15} />
                  <span>{p.label}</span>
                  <ChevronRight size={13} className="palette-item-arrow" />
                </button>
              ))}
            </div>
          )}
          {tpls.length > 0 && (
            <div className="palette-group">
              <span className="palette-group-title">Templates</span>
              {tpls.map((t) => (
                <button key={t.id} className="palette-item" onClick={() => { onUseTemplate(t); onClose(); }}>
                  <Files size={15} />
                  <span>{t.name}</span>
                  <span className="palette-item-cat">{t.category}</span>
                </button>
              ))}
            </div>
          )}
          {pages.length === 0 && tpls.length === 0 && (
            <div className="palette-empty">No matches for &ldquo;{query}&rdquo;.</div>
          )}
        </div>
      </div>
    </div>
  );
}
