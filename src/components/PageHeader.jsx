import React from "react";
import { Menu } from "lucide-react";
import { LiveClockPill } from "./LiveClock";

export function PageHeader({ title, subtitle, onMenu, right }) {
  return (
    <div className="page-header">
      <div className="page-header-left">
        <button className="menu-btn" onClick={onMenu} aria-label="Open menu"><Menu size={18} /></button>
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <div className="page-header-right">
        <LiveClockPill />
        {right}
      </div>
    </div>
  );
}
