import { useState, useEffect } from "react";
import {
  Tags,
  Search,
  Plus,
  Copy as CopyIcon,
  Trash2,
  Pencil,
  Files,
  Clock,
  Send,
  ShieldCheck,
  Save,
  ChevronRight,
  Star,
  TrendingUp
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Button, CategoryField, CategoryPill, EmptyState, IconButton, Modal } from "../components/primitives";
import { statusMeta, timeAgo } from "../lib/format";
import { scanMessage } from "../lib/scan";

export function TemplateModal({ open, onClose, initial, categories, wordList, onConfirm }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (open) {
      setName(initial?.name || "");
      setCategory(initial?.category || "General");
      setDescription(initial?.description || "");
      setContent(initial?.content || "");
      setTags((initial?.tags || []).join(", "));
      setPreview(null);
    }
  }, [open, initial]);

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Template" : "Create Template"} width={560}>
      <div className="form-grid">
        <label className="field-label">Template Name
          <input className="text-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Meeting Request" autoFocus />
        </label>
        <CategoryField id="tpl-category" value={category} onChange={setCategory} categories={categories} />
        <label className="field-label">Description
          <input className="text-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short summary of when to use this" />
        </label>
        <label className="field-label">Message Content
          <textarea className="text-input textarea-sm" value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
        </label>
        <label className="field-label">Tags <span className="field-hint">(comma separated, optional)</span>
          <input className="text-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. intro, delivery" />
        </label>

        <button
          type="button"
          className="link-btn"
          style={{ justifySelf: "start" }}
          onClick={() => setPreview(scanMessage(content, wordList))}
        >
          <ShieldCheck size={13} /> Run safety check before saving
        </button>
        {preview && (
          <div className={`inline-scan-result inline-scan-${preview.status}`}>
            {statusMeta(preview.status).label} · risk score {preview.score} · {preview.found.length} issue(s) found
          </div>
        )}
      </div>
      <div className="modal-actions">
        <Button tone="ghost" onClick={onClose}>Cancel</Button>
        <Button
          tone="primary"
          icon={Save}
          disabled={!name.trim() || !content.trim()}
          onClick={() => {
            const scan = scanMessage(content, wordList);
            onConfirm({
              name: name.trim(),
              category,
              description: description.trim(),
              content,
              tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
              riskStatus: scan.status,
              riskScore: scan.score,
            });
          }}
        >
          Save Template
        </Button>
      </div>
    </Modal>
  );
}

/* ======================================================================
   TEMPLATES PAGE
====================================================================== */
export function TemplateCard({ tpl, onUse, onEdit, onDuplicate, onDelete, onCopy, onTogglePin }) {
  const meta = statusMeta(tpl.riskStatus || "safe");
  return (
    <div className={`tpl-card${tpl.pinned ? " tpl-card-pinned" : ""}`}>
      <div className="tpl-top">
        <span className="tpl-name">{tpl.name}</span>
        <div className="tpl-top-right">
          {!!tpl.usageCount && <span className="usage-badge" title="Times used"><TrendingUp size={10} /> {tpl.usageCount}</span>}
          <span className="status-chip" style={{ color: meta.color, borderColor: meta.color }}>{meta.label}</span>
        </div>
      </div>
      <p className="tpl-desc">{tpl.description || "No description."}</p>
      <p className="tpl-preview">{tpl.content.slice(0, 110)}{tpl.content.length > 110 ? "…" : ""}</p>
      <div className="tpl-meta-row">
        <CategoryPill value={tpl.category} />
        <span className="tpl-date"><Clock size={11} /> {timeAgo(tpl.updatedAt)}</span>
      </div>
      <div className="tpl-actions">
        <Button tone="primary" icon={Send} onClick={() => onUse(tpl)}>Use</Button>
        <IconButton
          icon={Star}
          label={tpl.pinned ? "Unpin" : "Pin to top"}
          tone={tpl.pinned ? "pinned" : "ghost"}
          onClick={() => onTogglePin(tpl)}
        />
        <IconButton icon={Pencil} label="Edit" onClick={() => onEdit(tpl)} />
        <IconButton icon={Files} label="Duplicate" onClick={() => onDuplicate(tpl)} />
        <IconButton icon={CopyIcon} label="Copy" onClick={() => onCopy(tpl)} />
        <IconButton icon={Trash2} label="Delete" tone="danger" onClick={() => onDelete(tpl)} />
      </div>
    </div>
  );
}

export function TemplatesPage({ templates, categories, onUse, onCreate, onEdit, onDuplicate, onDelete, onCopy, onTogglePin }) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [pinnedOnly, setPinnedOnly] = useState(false);

  const filtered = templates.filter((t) => {
    const matchesCat = filter === "All" || t.category === filter;
    const matchesPin = !pinnedOnly || t.pinned;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || t.name.toLowerCase().includes(q) || t.content.toLowerCase().includes(q) || t.tags.join(" ").toLowerCase().includes(q);
    return matchesCat && matchesPin && matchesQuery;
  });

  const sortWithinGroup = (items) => [...items].sort((a, b) => (b.pinned - a.pinned) || (b.updatedAt - a.updatedAt));
  const grouped = categories.map((c) => ({ category: c, items: sortWithinGroup(filtered.filter((t) => t.category === c)) })).filter((g) => g.items.length > 0);
  const pinnedCount = templates.filter((t) => t.pinned).length;

  return (
    <div className="page-body">
      <PageHeader
        title="Message Templates"
        subtitle="Reusable, pre-checked messages organized by category."
        onMenu={() => {}}
        right={<Button tone="primary" icon={Plus} onClick={onCreate}>New Template</Button>}
      />

      <div className="filter-row">
        <div className="search-box">
          <Search size={15} />
          <input placeholder="Search templates..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="chip-row">
          {["All", ...categories].map((c) => (
            <button key={c} className={`chip${filter === c ? " chip-active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
          {pinnedCount > 0 && (
            <button className={`chip chip-star${pinnedOnly ? " chip-active" : ""}`} onClick={() => setPinnedOnly((v) => !v)}>
              <Star size={11} /> Pinned ({pinnedCount})
            </button>
          )}
        </div>
      </div>

      {templates.length === 0 ? (
        <EmptyState icon={Files} title="No templates yet" subtitle="Create reusable, pre-checked messages for common situations." actionLabel="Create Template" onAction={onCreate} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="No templates match your search" subtitle="Try a different keyword, category, or turn off the pinned filter." />
      ) : (
        grouped.map((g) => (
          <div className="tpl-group" key={g.category}>
            <h3 className="tpl-group-title">{g.category.toUpperCase()}</h3>
            <div className="tpl-grid">
              {g.items.map((t) => (
                <TemplateCard key={t.id} tpl={t} onUse={onUse} onEdit={onEdit} onDuplicate={onDuplicate} onDelete={onDelete} onCopy={onCopy} onTogglePin={onTogglePin} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ======================================================================
   INSERT TEMPLATE MODAL
====================================================================== */
export function InsertTemplateModal({ open, onClose, templates, onInsert }) {
  const [query, setQuery] = useState("");
  useEffect(() => { if (open) setQuery(""); }, [open]);

  const filtered = templates.filter((t) => {
    const q = query.trim().toLowerCase();
    return !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
  });
  const groupCats = Array.from(new Set(filtered.map((t) => t.category)));
  const grouped = groupCats.map((c) => ({ category: c, items: filtered.filter((t) => t.category === c) })).filter((g) => g.items.length > 0);

  return (
    <Modal open={open} onClose={onClose} title="Insert Template" width={480}>
      <div className="search-box" style={{ marginBottom: 14 }}>
        <Search size={15} />
        <input autoFocus placeholder="Search templates..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="insert-list">
        {grouped.length === 0 && <p className="field-hint">No templates found.</p>}
        {grouped.map((g) => (
          <div key={g.category} className="insert-group">
            <span className="insert-group-title">{g.category}</span>
            {g.items.map((t) => (
              <button key={t.id} className="insert-item" onClick={() => onInsert(t)}>
                <span>{t.name}</span>
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
}

/* ======================================================================
   SAVED MESSAGES PAGE
====================================================================== */
