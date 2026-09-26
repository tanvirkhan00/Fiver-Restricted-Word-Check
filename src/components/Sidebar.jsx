import React from "react";
import {
  Shield,
  Settings as SettingsIcon,
  Search,
  X,
  Sun,
  Moon,
  Command
} from "lucide-react";
import { NAV_ITEMS } from "../data/navItems";

export function Sidebar({
  page,
  setPage,
  mobileOpen,
  setMobileOpen,
  theme,
  toggleTheme,
  onOpenPalette,
  user,
  onSignIn,
  onSignOut,
  counts = {},
}) {
  const isGuest = !user || user.isAnonymous;
  const initials = (user?.displayName || "Guest")
    .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <>
      {mobileOpen && <div className="drawer-backdrop" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar${mobileOpen ? " sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-shield"><Shield size={19} /></div>
          <div className="brand-text">
            <h1>Fiverr Safety</h1>
            <p>COMPLIANCE SUITE</p>
          </div>
          <button className="drawer-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>

        <button className="palette-trigger" onClick={onOpenPalette}>
          <Search size={13} />
          <span>Quick search...</span>
          <span className="palette-kbd"><Command size={10} />K</span>
        </button>

        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const countVal = counts[item.id];
            return (
              <button
                key={item.id}
                className={`nav-item${page === item.id ? " nav-item-active" : ""}`}
                onClick={() => { setPage(item.id); setMobileOpen(false); }}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
                {typeof countVal === "number" && countVal > 0 ? (
                  <span className="nav-count mono">{countVal}</span>
                ) : (
                  page === item.id && <span className="nav-dot" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
            <span>{theme === "dark" ? "Dark Appearance" : "Light Appearance"}</span>
          </button>
          <div className="profile-row">
            {(user?.photoURL || user?.providerData?.[0]?.photoURL)
              ? <img className="avatar avatar-img" src={user.photoURL || user.providerData[0].photoURL} alt="" referrerPolicy="no-referrer" />
              : <div className="avatar">{isGuest ? "G" : initials}</div>}
            <div className="profile-meta">
              <span className="profile-name">{isGuest ? "Local Workspace" : (user.displayName || user.email)}</span>
              <span className="profile-role">{isGuest ? "Offline storage active" : "Synced with Google"}</span>
            </div>
            <button className="icon-btn icon-btn-ghost" onClick={() => setPage("settings")} aria-label="Settings">
              <SettingsIcon size={14} />
            </button>
          </div>
          {isGuest ? (
            <button className="btn btn-secondary btn-full sidebar-auth-btn" onClick={onSignIn}>
              <span>Sign in with Google</span>
            </button>
          ) : (
            <button className="btn btn-ghost btn-full sidebar-auth-btn" onClick={onSignOut}>
              <span>Sign out</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
