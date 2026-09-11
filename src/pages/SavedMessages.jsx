import { useState, useEffect } from "react";
import {
  BookmarkCheck,
  Tags,
  Search,
  Copy as CopyIcon,
  Trash2,
  Pencil,
  Files,
  Clock,
  Send,
  Save
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Button, CategoryField, CategoryPill, EmptyState, IconButton, Modal } from "../components/primitives";
import { statusMeta, timeAgo } from "../lib/format";

export function SavedMessages({ messages, categories, onUse, onEdit, onDelete, onDuplicate, onCopy }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("newest");

  let filtered = messages.filter((m) => {
    const matchesCat = filter === "All" || m.category === filter;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q) || (m.tags || []).join(" ").toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });
  filtered = [...filtered].sort((a, b) => sort === "newest" ? b.updatedAt - a.updatedAt : a.updatedAt - b.updatedAt);

  return (
    <div className="page-body">
      <PageHeader title="Saved Messages" subtitle="Search, filter, and reuse your saved Fiverr messages." onMenu={() => {}} />

      <div className="filter-row">
        <div className="search-box">
          <Search size={15} />
          <input placeholder="Search saved messages..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="chip-row">
          {["All", ...categories].map((c) => (
            <button key={c} className={`chip${filter === c ? " chip-active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
        <select className="select select-sm" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {messages.length === 0 ? (
        <EmptyState icon={BookmarkCheck} title="No saved messages yet" subtitle="Save your frequently used Fiverr messages here for quick access." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="No messages match your search" subtitle="Try a different keyword or filter." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="table-wrap">
            <table className="msg-table">
              <thead>
                <tr>
                  <th>Title</th><th>Category</th><th>Status</th><th>Updated</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const meta = statusMeta(m.riskStatus);
                  return (
                    <tr key={m.id}>
                      <td>
                        <span className="table-title">{m.title}</span>
                        <span className="table-preview">{m.content.slice(0, 60)}{m.content.length > 60 ? "…" : ""}</span>
                      </td>
                      <td><CategoryPill value={m.category} /></td>
                      <td><span className="status-chip" style={{ color: meta.color, borderColor: meta.color }}>{meta.label}</span></td>
                      <td className="table-time">{timeAgo(m.updatedAt)}</td>
                      <td>
                        <div className="table-actions">
                          <IconButton icon={Send} label="Use in checker" onClick={() => onUse(m)} />
                          <IconButton icon={CopyIcon} label="Copy" onClick={() => onCopy(m)} />
                          <IconButton icon={Pencil} label="Edit" onClick={() => onEdit(m)} />
                          <IconButton icon={Files} label="Duplicate" onClick={() => onDuplicate(m)} />
                          <IconButton icon={Trash2} label="Delete" tone="danger" onClick={() => onDelete(m)} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="msg-card-list">
            {filtered.map((m) => {
              const meta = statusMeta(m.riskStatus);
              return (
                <div className="msg-mobile-card" key={m.id}>
                  <div className="tpl-top">
                    <span className="tpl-name">{m.title}</span>
                    <span className="status-chip" style={{ color: meta.color, borderColor: meta.color }}>{meta.label}</span>
                  </div>
                  <p className="tpl-preview">{m.content.slice(0, 100)}{m.content.length > 100 ? "…" : ""}</p>
                  <div className="tpl-meta-row">
                    <CategoryPill value={m.category} />
                    <span className="tpl-date"><Clock size={11} /> {timeAgo(m.updatedAt)}</span>
                  </div>
                  <div className="tpl-actions">
                    <Button tone="primary" icon={Send} onClick={() => onUse(m)}>Use</Button>
                    <IconButton icon={Pencil} label="Edit" onClick={() => onEdit(m)} />
                    <IconButton icon={Files} label="Duplicate" onClick={() => onDuplicate(m)} />
                    <IconButton icon={CopyIcon} label="Copy" onClick={() => onCopy(m)} />
                    <IconButton icon={Trash2} label="Delete" tone="danger" onClick={() => onDelete(m)} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ======================================================================
   EDIT SAVED MESSAGE MODAL (reuses form styling)
====================================================================== */
export function EditMessageModal({ open, onClose, message, categories, onConfirm }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (open && message) {
      setTitle(message.title);
      setCategory(message.category);
      setContent(message.content);
      setTags((message.tags || []).join(", "));
    }
  }, [open, message]);

  return (
    <Modal open={open} onClose={onClose} title="Edit Message">
      <div className="form-grid">
        <label className="field-label">Title
          <input className="text-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <CategoryField id="edit-msg-category" value={category} onChange={setCategory} categories={categories} />
        <label className="field-label">Content
          <textarea className="text-input textarea-sm" value={content} onChange={(e) => setContent(e.target.value)} rows={5} />
        </label>
        <label className="field-label">Tags <span className="field-hint">(comma separated, optional)</span>
          <input className="text-input" value={tags} onChange={(e) => setTags(e.target.value)} />
        </label>
      </div>
      <div className="modal-actions">
        <Button tone="ghost" onClick={onClose}>Cancel</Button>
        <Button tone="primary" icon={Save} disabled={!title.trim() || !content.trim()} onClick={() => onConfirm({ title: title.trim(), category, content, tags: tags.split(",").map((t) => t.trim()).filter(Boolean) })}>
          Save Changes
        </Button>
      </div>
    </Modal>
  );
}

/* ======================================================================
   RESTRICTED WORDS PAGE — view, enable/disable built-in words, and
   add/edit/remove your own custom words, right from the UI.
====================================================================== */
