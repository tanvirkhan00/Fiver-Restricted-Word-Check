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
import { auth } from "../firebase/config";

export function Sidebar({ page, setPage, mobileOpen, setMobileOpen, theme, toggleTheme, onOpenPalette, user, onSignIn, onSignOut }) {
  const isGuest = !user || user.isAnonymous;
  const initials = (user?.displayName || "Guest")
    .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <>
      {mobileOpen && <div className="drawer-backdrop" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar${mobileOpen ? " sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-shield"><Shield size={20} /></div>
          <div>
            <h1>Fiverr Safety Checker</h1>
            <p>freelancer risk toolkit</p>
          </div>
          <button className="drawer-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>

        <button className="palette-trigger" onClick={onOpenPalette}>
          <Search size={13} />
          <span>Quick jump</span>
          <span className="palette-kbd"><Command size={10} />K</span>
        </button>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item${page === item.id ? " nav-item-active" : ""}`}
              onClick={() => { setPage(item.id); setMobileOpen(false); }}
            >
              <item.icon size={17} />
              <span>{item.label}</span>
              {page === item.id && <span className="nav-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
            <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
          </button>
          <div className="profile-row">
            {(user?.photoURL || user?.providerData?.[0]?.photoURL)
              ? <img className="avatar avatar-img" src={user.photoURL || user.providerData[0].photoURL} alt="" referrerPolicy="no-referrer" />
              : <div className="avatar">{isGuest ? "?" : initials}</div>}
            <div className="profile-meta">
              <span className="profile-name">{isGuest ? "Guest" : (user.displayName || user.email)}</span>
              <span className="profile-role">{isGuest ? "Not signed in — data local to this device" : "Signed in with Google"}</span>
            </div>
            <button className="icon-btn icon-btn-ghost" onClick={() => setPage("settings")} aria-label="Settings">
              <SettingsIcon size={15} />
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

