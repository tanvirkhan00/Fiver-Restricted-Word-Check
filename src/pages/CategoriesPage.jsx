import React from "react";
import {
  Tags,
  ArrowRight
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { CATEGORIES } from "../data/constants";

export function CategoriesPage({ messages, templates, categories, setPage, setCheckerCategory }) {
  return (
    <div className="page-body">
      <PageHeader title="Categories" subtitle="How your saved messages and templates break down." onMenu={() => {}} />
      <div className="cat-grid">
        {categories.map((c) => {
          const msgCount = messages.filter((m) => m.category === c).length;
          const tplCount = templates.filter((t) => t.category === c).length;
          return (
            <div className="cat-card" key={c}>
              <div className="cat-card-head">
                <Tags size={16} />
                <span>{c}</span>
                {!CATEGORIES.includes(c) && <span className="custom-tag">Custom</span>}
              </div>
              <div className="cat-card-stats">
                <div><span className="cat-num">{msgCount}</span><span className="cat-num-label">Messages</span></div>
                <div><span className="cat-num">{tplCount}</span><span className="cat-num-label">Templates</span></div>
              </div>
              <button className="link-btn" onClick={() => { setCheckerCategory(c); setPage("checker"); }}>
                Draft in this category <ArrowRight size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ======================================================================
   SETTINGS PAGE
====================================================================== */
