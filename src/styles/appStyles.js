export const CSS = `
:root {}
.app-root {
  --bg: #090b10;
  --surface: #11151e;
  --surface2: #171c28;
  --surface3: #1f2637;
  --border: rgba(255, 255, 255, 0.075);
  --border2: rgba(255, 255, 255, 0.15);
  --text: #f1f5f9;
  --text2: #94a3b8;
  --muted: #64748b;
  --accent: #10b981;
  --accent-soft: rgba(16, 185, 129, 0.12);
  --accent-border: rgba(16, 185, 129, 0.30);
  --accent-fg: #032219;
  --hyphen: #f59e0b;
  --hyphen-bg: rgba(245, 158, 11, 0.12);
  --hyphen-border: rgba(245, 158, 11, 0.32);
  --high: #f43f5e;
  --high-bg: rgba(244, 63, 94, 0.10);
  --high-border: rgba(244, 63, 94, 0.28);
  --medium: #f59e0b;
  --medium-bg: rgba(245, 158, 11, 0.10);
  --medium-border: rgba(245, 158, 11, 0.28);
  --low: #38bdf8;
  --low-bg: rgba(56, 189, 248, 0.10);
  --low-border: rgba(56, 189, 248, 0.28);
  --safe: #10b981;
  font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg);
  color: var(--text);
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
  -webkit-font-smoothing: antialiased;
}
.app-root.theme-light {
  --bg: #f4f7f9;
  --surface: #ffffff;
  --surface2: #f1f5f9;
  --surface3: #e2e8f0;
  --border: #e2e8f0;
  --border2: #cbd5e1;
  --text: #0f172a;
  --text2: #475569;
  --muted: #64748b;
  --accent: #059669;
  --accent-soft: rgba(5, 150, 105, 0.10);
  --accent-border: rgba(5, 150, 105, 0.28);
  --accent-fg: #ffffff;
  --hyphen: #d97706;
  --hyphen-bg: rgba(217, 119, 6, 0.10);
  --hyphen-border: rgba(217, 119, 6, 0.30);
}
.app-root * { box-sizing: border-box; }
.mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }

/* SIDEBAR */
.sidebar {
  width: 254px;
  flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 18px 14px;
  gap: 14px;
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 2px 6px 15px;
  border-bottom: 1px solid var(--border);
  position: relative;
}
.brand-shield {
  width: 35px;
  height: 35px;
  border-radius: 10px;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.28);
}
.brand-text h1 {
  font-size: 14.5px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  letter-spacing: -0.25px;
}
.brand-text p {
  font-size: 9.5px;
  color: var(--accent);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.9px;
  margin: 2px 0 0;
  font-weight: 700;
}
.drawer-close { display: none; }
.sidebar-section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.9px;
  color: var(--muted);
  padding: 2px 10px 0;
  font-family: 'JetBrains Mono', monospace;
}
.sidebar-nav { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 11px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--text2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  position: relative;
  transition: all .15s ease;
  font-family: inherit;
}
.nav-item:hover { background: var(--surface2); color: var(--text); }
.nav-item-active {
  background: var(--accent-soft);
  border-color: var(--accent-border);
  color: var(--accent);
  font-weight: 600;
}
.nav-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); margin-left: auto; }
.nav-count {
  margin-left: auto;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--muted);
  background: var(--surface2);
  border: 1px solid var(--border);
  padding: 1px 6px;
  border-radius: 5px;
}
.nav-item-active .nav-count {
  color: var(--accent);
  background: var(--accent-soft);
  border-color: var(--accent-border);
}
.sidebar-footer { border-top: 1px solid var(--border); padding-top: 12px; display: flex; flex-direction: column; gap: 10px; }
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 11px;
  color: var(--text2);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all .15s;
}
.theme-toggle:hover { color: var(--text); border-color: var(--border2); }
.theme-toggle-inline { width: fit-content; }
.profile-row { display: flex; align-items: center; gap: 9px; }
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
  flex-shrink: 0;
}
.avatar-img { object-fit: cover; }
.profile-meta { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.profile-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; font-weight: 600; }
.sidebar-auth-btn { margin-top: 4px; }
.auth-loading { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; height: 100vh; color: var(--text2); font-size: 13px; }
.profile-role { font-size: 10.5px; color: var(--muted); }

.drawer-backdrop { display: none; }
.palette-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
  width: 100%;
  font-family: inherit;
  transition: all .15s;
}
.palette-trigger:hover { color: var(--text); border-color: var(--border2); }
.palette-trigger span:first-of-type { flex: 1; text-align: left; }
.palette-kbd { display: inline-flex; align-items: center; gap: 2px; font-size: 9.5px; font-family: 'JetBrains Mono', monospace; background: var(--surface3); border: 1px solid var(--border2); border-radius: 4px; padding: 1px 5px; color: var(--muted); }
.palette-overlay { align-items: flex-start; padding-top: 12vh; }
.palette-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 12px; width: 100%; max-width: 480px; box-shadow: 0 24px 60px rgba(0,0,0,0.55); overflow: hidden; }
.palette-search { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid var(--border); color: var(--muted); }
.palette-search input { flex: 1; background: none; border: none; outline: none; color: var(--text); font-size: 14px; font-family: inherit; }
.palette-results { max-height: 360px; overflow-y: auto; padding: 8px; }
.palette-group { margin-bottom: 6px; }
.palette-group-title { display: block; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--muted); padding: 6px 8px 4px; }
.palette-item { width: 100%; display: flex; align-items: center; gap: 10px; padding: 9px 10px; background: none; border: none; border-radius: 8px; color: var(--text); font-size: 13px; font-weight: 600; cursor: pointer; text-align: left; font-family: inherit; }
.palette-item:hover { background: var(--surface2); }
.palette-item-arrow { margin-left: auto; color: var(--muted); }
.palette-item-cat { margin-left: auto; font-size: 10.5px; font-weight: 600; color: var(--muted); }
.palette-empty { padding: 24px 12px; text-align: center; font-size: 12.5px; color: var(--muted); }

/* MAIN WORKSPACE AREA */
.main-area {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  background: var(--bg);
  background-image:
    radial-gradient(ellipse 60% 35% at 50% 0%, rgba(16, 185, 129, 0.05) 0%, transparent 70%);
}
.mobile-topbar { display: none; }
.page-body { padding: 24px 30px 48px; max-width: 1260px; margin: 0 auto; }
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}
.page-header-left { display: flex; align-items: center; gap: 10px; }
.page-header-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.page-header h2 { font-size: 20px; font-weight: 700; letter-spacing: -0.4px; margin: 0; }
.page-header p { font-size: 12.5px; color: var(--text2); margin: 3px 0 0; }
.menu-btn { display: none; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 7px; color: var(--text2); cursor: pointer; }

/* TOP CLOCK CLUSTER & CLIENT TIMEZONE SWITCHER */
.clock-cluster {
  display: inline-flex;
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.clock-tz-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  background: var(--surface2);
  border: none;
  border-right: 1px solid var(--border);
  color: var(--text2);
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: color .15s, background .15s;
}
.clock-tz-btn:hover {
  color: var(--text);
  background: var(--surface3);
}
.clock-tz-btn svg { color: var(--accent); }
.live-clock-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 11px;
  background: transparent;
  border: none;
  font-size: 11.5px;
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: background .15s;
}
.live-clock-pill:hover { background: var(--surface2); }
.live-clock-icon { color: var(--accent); flex-shrink: 0; }
.live-clock-time { font-weight: 700; color: var(--text); }
.live-clock-sep { color: var(--muted); }
.live-clock-date { color: var(--text2); font-size: 11px; font-family: 'Space Grotesk', sans-serif; font-weight: 500; }

.badge-live {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 11px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text2);
  font-family: 'JetBrains Mono', monospace;
}
.live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--safe); box-shadow: 0 0 8px var(--safe); animation: blink 2s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

/* UNIFIED TELEMETRY STRIP */
.telemetry-strip {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 18px;
  margin-bottom: 16px;
  gap: 18px;
}
.t-divider {
  width: 1px;
  height: 36px;
  background: var(--border);
}
.t-segment {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.t-segment-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.t-icon-accent { background: var(--accent-soft); color: var(--accent); }
.t-icon-low { background: var(--low-bg); color: var(--low); }
.t-icon-medium { background: var(--medium-bg); color: var(--medium); }

.t-segment-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.t-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.t-label {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--muted);
}
.t-state-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 600;
  color: var(--text2);
  font-family: 'JetBrains Mono', monospace;
}
.timer-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
.timer-dot-active {
  background: var(--safe);
  box-shadow: 0 0 8px var(--safe);
  animation: blink 1.2s infinite;
}
.timer-dot-paused { background: var(--medium); }
.timer-dot-idle { background: var(--muted); }

.t-value-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.t-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.1;
}
.t-value small {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--muted);
  margin-left: 2px;
}
.t-sub {
  font-size: 11px;
  color: var(--text2);
}
.t-controls {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.t-ctrl-btn {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--surface2);
  color: var(--text2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all .15s;
}
.t-ctrl-btn:hover:not(:disabled) {
  color: var(--text);
  border-color: var(--accent);
  background: var(--surface3);
}
.t-ctrl-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.t-tier {
  font-size: 10px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
}
.t-tier-muted { color: var(--muted); }
.t-tier-accent { color: var(--accent); }
.t-tier-low { color: var(--low); }
.t-tier-medium { color: var(--medium); }
.t-tier-high { color: var(--high); }

.t-meter {
  height: 3px;
  border-radius: 4px;
  background: var(--surface3);
  overflow: hidden;
  margin-top: 2px;
}
.t-meter-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--accent), var(--low));
  transition: width .25s ease;
}

/* DASHBOARD TYPING CARD */
.dash-typing-card { margin-bottom: 16px; }
.dash-typing-body {
  padding: 14px 16px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.dash-typing-metric {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--surface2);
  border: 1px solid var(--border);
}
.dash-unit {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
}

/* CARD */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  gap: 8px;
  flex-wrap: wrap;
}
.card-label {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text2);
  font-family: 'JetBrains Mono', monospace;
  display: flex;
  align-items: center;
  gap: 8px;
}
.card-label::before {
  content: '';
  width: 3px;
  height: 12px;
  background: var(--accent);
  border-radius: 2px;
}
.char-meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.char-meta-sep { color: var(--muted); font-size: 10.5px; }
.composer-footer-stats { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }

.link-btn {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0;
  font-family: inherit;
}
.link-btn:hover { text-decoration: underline; }

/* STAT GRID */
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 18px; }
.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 13px;
  transition: border-color .15s, transform .15s;
}
.stat-card:hover {
  border-color: var(--border2);
}
.stat-icon { width: 38px; height: 38px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon-accent { background: var(--accent-soft); color: var(--accent); }
.stat-icon-low { background: var(--low-bg); color: var(--low); }
.stat-icon-high { background: var(--high-bg); color: var(--high); }
.stat-icon-medium { background: var(--medium-bg); color: var(--medium); }
.stat-value { display: block; font-size: 21px; font-weight: 700; line-height: 1.1; }
.stat-label { display: block; font-size: 11.5px; color: var(--text2); margin-top: 3px; font-weight: 500; }
.stat-sub { display: block; font-size: 10.5px; color: var(--muted); margin-top: 3px; font-family: 'JetBrains Mono', monospace; }

/* SECONDARY COUNTERS STRIP */
.dash-secondary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 18px;
}
.sec-card {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.sec-card-left { display: flex; flex-direction: column; gap: 2px; }
.sec-card-label { font-size: 10.5px; font-weight: 600; color: var(--text2); }
.sec-card-sub { font-size: 9.5px; color: var(--muted); }
.sec-card-val { font-size: 16px; font-weight: 700; color: var(--text); font-family: 'JetBrains Mono', monospace; }

/* DASHBOARD TABS */
.dash-tab-group {
  display: inline-flex;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 2px;
  gap: 2px;
}
.dash-tab-btn {
  background: transparent;
  border: none;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 9px;
  border-radius: 4px;
  color: var(--text2);
  cursor: pointer;
  transition: all .15s;
}
.dash-tab-btn-active {
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.scan-source-pill {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 5px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  background: var(--surface3);
  color: var(--muted);
}
.scan-excerpt {
  font-size: 12.5px;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 320px;
}

/* QUICK ACTIONS */
.quick-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 18px; }
.qa-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color .15s, background .15s;
  font-family: inherit;
}
.qa-card:hover { border-color: var(--accent); background: var(--surface2); }
.qa-card svg:first-child { color: var(--accent); }
.qa-arrow { margin-left: auto; color: var(--muted); }

/* DASHBOARD COLUMNS */
.week-card { margin-bottom: 16px; }
.week-delta { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.week-delta-up { color: var(--safe); }
.week-delta-down { color: var(--muted); }
.week-body { padding: 16px; display: grid; grid-template-columns: auto 1fr auto; gap: 24px; align-items: center; }
.week-stat { display: flex; flex-direction: column; gap: 3px; }
.week-stat-value { font-size: 28px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.week-stat-label { font-size: 10.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
.week-bar-wrap { display: flex; flex-direction: column; gap: 8px; min-width: 160px; }
.week-bar { height: 8px; border-radius: 6px; background: var(--high-bg); overflow: hidden; }
.week-bar-fill { height: 100%; background: var(--safe); border-radius: 6px; transition: width .5s; }
.week-bar-legend { display: flex; gap: 14px; font-size: 11px; color: var(--text2); }
.dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; margin-right: 5px; }
.dot-safe { background: var(--safe); } .dot-high { background: var(--high); }
.week-top-templates { display: flex; flex-direction: column; gap: 6px; min-width: 170px; }
.week-top-row { display: flex; align-items: center; justify-content: space-between; font-size: 12px; gap: 8px; }
.dash-columns { display: grid; grid-template-columns: 1.3fr 1fr; gap: 16px; }
.list-body { padding: 8px; max-height: 380px; overflow-y: auto; }
.recent-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 10px; border-radius: 8px; gap: 10px; }
.recent-row:hover { background: var(--surface2); }
.recent-row-main { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.recent-title { font-size: 13px; font-weight: 600; }
.recent-cat { font-size: 11px; color: var(--muted); }
.recent-row-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.recent-time { font-size: 10.5px; color: var(--muted); display: flex; align-items: center; gap: 4px; }
.activity-row { display: flex; align-items: center; gap: 9px; padding: 9px 10px; font-size: 12.5px; }
.activity-check { color: var(--safe); flex-shrink: 0; }
.activity-label { flex: 1; color: var(--text2); }
.activity-time { font-size: 10.5px; color: var(--muted); flex-shrink: 0; }

/* STATUS CHIP / BADGE / PILL */
.status-chip {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid;
  font-family: 'JetBrains Mono', monospace;
}
.cat-pill {
  font-size: 10.5px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--surface3);
  color: var(--text2);
}
.badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; padding: 5px 10px; border-radius: 6px; border: 1px solid var(--border); }
.badge-muted { color: var(--text2); }

/* CHECKER WORKSPACE GRID */
.checker-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 16px;
  align-items: start;
}
.composer-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
.composer-card { display: flex; flex-direction: column; }
.composer-top-bar {
  padding: 10px 14px;
  background: var(--surface2);
}
.view-mode-tabs {
  display: inline-flex;
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 2px;
  gap: 2px;
}
.view-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: 5px;
  border: none;
  background: transparent;
  color: var(--text2);
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all .15s;
}
.view-tab:hover { color: var(--text); }
.view-tab-active {
  background: var(--accent-soft);
  color: var(--accent);
}

.composer-head-actions { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.chip-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text2);
  font-size: 11.5px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all .15s;
}
.chip-action-btn:hover { color: var(--text); border-color: var(--border2); background: var(--surface3); }
.chip-action-accent { color: var(--accent); border-color: var(--accent-border); background: var(--accent-soft); }
.chip-action-accent:hover { filter: brightness(1.1); color: var(--accent); }

.toolbar-group { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.field-label { font-size: 11px; font-weight: 600; color: var(--text2); display: flex; flex-direction: column; gap: 6px; }
.field-label-inline { flex-direction: row; align-items: center; gap: 8px; white-space: nowrap; }
.field-hint { font-weight: 400; color: var(--muted); font-size: 10.5px; }
.select { background: var(--surface); border: 1px solid var(--border); color: var(--text); border-radius: 6px; padding: 7px 10px; font-size: 12.5px; font-family: inherit; outline: none; }
.select:focus { border-color: var(--accent); }
.select-compact { padding: 5px 9px; font-size: 12px; width: 155px; }
.select-sm { padding: 7px 9px; }

.composer-textarea {
  flex: 1;
  width: 100%;
  min-height: 240px;
  padding: 18px;
  background: transparent;
  border: none;
  outline: none;
  resize: vertical;
  font-size: 14.5px;
  font-family: 'Space Grotesk', sans-serif;
  color: var(--text);
  line-height: 1.72;
}
.composer-textarea::placeholder { color: var(--muted); }
.composer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  background: var(--surface2);
  flex-wrap: wrap;
  gap: 10px;
}
.composer-actions { display: flex; gap: 8px; flex-wrap: wrap; }

/* RIGHT COLUMN: COMPACT COMPLIANCE SCORE & CONFLICT HYPHENATOR */
.analysis-col { display: flex; flex-direction: column; gap: 16px; }
.status-compact-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 12px;
  gap: 12px;
}
.status-verdict-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.status-score-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}
.status-score-num {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}
.status-side-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.6px; font-family: 'JetBrains Mono', monospace; }
.status-side-value { font-size: 15.5px; font-weight: 700; display: flex; align-items: center; gap: 6px; }

.safety-progress-track {
  height: 6px;
  background: var(--surface3);
  margin: 0 16px 16px;
  border-radius: 6px;
  overflow: hidden;
}
.safety-progress-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.4s ease, background 0.3s ease;
}

.risk-pills { display: grid; grid-template-columns: 1fr 1fr 1fr; border-top: 1px solid var(--border); }
.risk-pill { padding: 11px 8px; text-align: center; border-right: 1px solid var(--border); transition: background .3s; }
.risk-pill:last-child { border-right: none; }
.pill-count { display: block; font-size: 19px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.pill-label { display: block; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; margin-top: 2px; opacity: 0.8; }
.risk-pill.high { color: var(--high); } .risk-pill.med { color: var(--medium); } .risk-pill.low { color: var(--low); }
.risk-pill.high.active { background: var(--high-bg); } .risk-pill.med.active { background: var(--medium-bg); } .risk-pill.low.active { background: var(--low-bg); }

.issues-card { display: flex; flex-direction: column; }
.issues-body { padding: 10px; min-height: 220px; max-height: 460px; overflow-y: auto; }

.issue-card { padding: 11px 12px; border-radius: 8px; margin-bottom: 8px; border: 1px solid transparent; }
.issue-card:last-child { margin-bottom: 0; }
.issue-high { background: var(--high-bg); border-color: var(--high-border); }
.issue-medium { background: var(--medium-bg); border-color: var(--medium-border); }
.issue-low { background: var(--low-bg); border-color: var(--low-border); }
.issue-top { display: flex; align-items: center; gap: 7px; margin-bottom: 7px; flex-wrap: wrap; }
.issue-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.issue-dot-high { background: var(--high); } .issue-dot-medium { background: var(--medium); } .issue-dot-low { background: var(--low); }
.issue-keyword { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; }
.issue-high .issue-keyword { color: var(--high); } .issue-medium .issue-keyword { color: var(--medium); } .issue-low .issue-keyword { color: var(--low); }
.issue-arrow { color: var(--muted); flex-shrink: 0; }
.issue-hyphen-preview {
  font-size: 12px;
  font-weight: 700;
  color: var(--safe);
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
  padding: 1px 6px;
  border-radius: 4px;
}
.issue-badge { margin-left: auto; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; padding: 2px 6px; border-radius: 4px; }
.issue-badge-high { background: var(--high); color: #fff; } .issue-badge-medium { background: var(--medium); color: #1a1200; } .issue-badge-low { background: var(--low); color: #04231b; }
.flag-notice { display: flex; gap: 7px; background: rgba(0,0,0,0.18); border-radius: 6px; padding: 7px 9px; font-size: 11.5px; line-height: 1.5; color: var(--text2); }
.flag-icon { flex-shrink: 0; margin-top: 1px; opacity: .8; }
.issue-bottom-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 8px; padding-top: 7px; border-top: 1px solid rgba(255,255,255,0.06); }
.issue-cat { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }

/* HYPHENATE BUTTONS */
.hyphen-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--hyphen-bg);
  color: var(--hyphen);
  border: 1px solid var(--hyphen-border);
  font-size: 10.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  font-family: 'JetBrains Mono', monospace;
  transition: all .15s;
}
.hyphen-btn:hover {
  background: var(--hyphen);
  color: #140d00;
}
.hyphen-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--hyphen-bg);
  color: var(--hyphen);
  border: 1px solid var(--hyphen-border);
  font-size: 10.5px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  transition: all .15s;
}
.hyphen-all-btn:hover {
  background: var(--hyphen);
  color: #140d00;
}

.preview-card { position: relative; }
.preview-body { padding: 16px 18px; min-height: 84px; font-size: 14px; line-height: 1.75; word-break: break-word; }
.preview-placeholder { position: absolute; top: 52px; left: 18px; color: var(--muted); font-size: 12.5px; pointer-events: none; }
.h-high, .h-medium, .h-low { border-radius: 3px; padding: 1px 4px; font-weight: 700; cursor: help; }
.h-high { background: var(--high-bg); color: var(--high); border-bottom: 1.5px solid var(--high); }
.h-medium { background: var(--medium-bg); color: var(--medium); border-bottom: 1.5px solid var(--medium); }
.h-low { background: var(--low-bg); color: var(--low); border-bottom: 1.5px solid var(--low); }
.tooltip-wrap { position: relative; display: inline; }
.tooltip { visibility: hidden; opacity: 0; pointer-events: none; position: absolute; z-index: 999; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(4px); min-width: 230px; max-width: 290px; background: #0f141e; border: 1px solid var(--border2); border-radius: 9px; padding: 10px 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.55); transition: opacity .18s, transform .18s; display: block; }
.tooltip-wrap:hover .tooltip { visibility: visible; opacity: 1; transform: translateX(-50%) translateY(0); }
.tt-header { display: flex; align-items: center; gap: 6px; margin-bottom: 7px; padding-bottom: 7px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.tt-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
.tt-dot-high { background: var(--high); } .tt-dot-medium { background: var(--medium); } .tt-dot-low { background: var(--low); }
.tt-word { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; flex: 1; color: #f1f5f9; }
.tt-badge { font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; color: #fff; }
.tt-badge-high { background: var(--high); } .tt-badge-medium { background: var(--medium); color: #1a1200; } .tt-badge-low { background: var(--low); color: #04231b; }
.tt-reason { font-size: 11.5px; line-height: 1.55; color: #cbd5e1; display: block; }
.tt-category { font-size: 10px; font-family: 'JetBrains Mono', monospace; color: #94a3b8; margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08); display: block; }
.tt-category strong { color: var(--safe); }

/* EMPTY STATE */
.empty-state { padding: 34px 20px; text-align: center; color: var(--muted); display: flex; flex-direction: column; align-items: center; gap: 6px; }
.empty-icon { color: var(--accent); margin-bottom: 4px; opacity: 0.85; }
.empty-state h4 { font-size: 13.5px; color: var(--text); font-weight: 700; margin: 0; }
.empty-state p { font-size: 12px; line-height: 1.6; max-width: 280px; margin: 0 0 8px; }

/* BUTTONS */
.btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 13px; border-radius: 7px; font-size: 12.5px; font-weight: 600; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: all .15s; white-space: nowrap; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-full { width: 100%; justify-content: center; }
.btn-primary { background: var(--accent); color: var(--accent-fg); font-weight: 700; }
.btn-primary:hover:not(:disabled) { filter: brightness(1.08); }
.btn-secondary { background: var(--surface); color: var(--text); border-color: var(--border2); }
.btn-secondary:hover:not(:disabled) { border-color: var(--accent); background: var(--surface3); }
.btn-hyphen { background: var(--hyphen-bg); color: var(--hyphen); border-color: var(--hyphen-border); font-weight: 700; }
.btn-hyphen:hover:not(:disabled) { background: var(--hyphen); color: #140d00; }
.btn-ghost { background: transparent; color: var(--text2); border-color: var(--border); }
.btn-ghost:hover:not(:disabled) { color: var(--text); border-color: var(--border2); }
.btn-danger { background: transparent; color: var(--high); border-color: var(--high-border); }
.btn-danger:hover:not(:disabled) { background: var(--high-bg); }
.icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 7px; border: 1px solid var(--border); background: var(--surface2); color: var(--text2); cursor: pointer; }
.icon-btn:hover { color: var(--text); border-color: var(--border2); }
.icon-btn-danger:hover { color: var(--high); border-color: var(--high-border); background: var(--high-bg); }

/* FILTER ROW / SEARCH / CHIPS */
.filter-row { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
.search-box { display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; flex: 1; min-width: 200px; color: var(--muted); }
.search-box input { background: none; border: none; outline: none; color: var(--text); font-size: 13px; width: 100%; font-family: inherit; }
.chip-row { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { background: var(--surface); border: 1px solid var(--border); color: var(--text2); font-size: 11.5px; font-weight: 600; padding: 6px 11px; border-radius: 7px; cursor: pointer; font-family: inherit; transition: all .15s; }
.chip:hover { color: var(--text); border-color: var(--border2); }
.chip-active { background: var(--accent); color: var(--accent-fg); border-color: var(--accent); }

/* TEMPLATES */
.tpl-group { margin-bottom: 22px; }
.tpl-group-title { font-size: 10.5px; font-weight: 700; letter-spacing: 1px; color: var(--muted); font-family: 'JetBrains Mono', monospace; margin-bottom: 10px; }
.tpl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
.tpl-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 15px; display: flex; flex-direction: column; gap: 8px; }
.tpl-card-pinned { border-color: rgba(245,158,11,0.35); box-shadow: 0 0 0 1px rgba(245,158,11,0.12); }
.tpl-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.tpl-top-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.tpl-name { font-size: 13.5px; font-weight: 700; }
.tpl-desc { font-size: 11.5px; color: var(--text2); margin: 0; }
.usage-badge { display: inline-flex; align-items: center; gap: 3px; font-size: 9.5px; font-weight: 700; color: var(--muted); background: var(--surface3); padding: 2px 6px; border-radius: 5px; }
.icon-btn-pinned { color: var(--medium); border-color: var(--medium-border); background: var(--medium-bg); }
.chip-star { display: inline-flex; align-items: center; gap: 5px; }
.tpl-preview { font-size: 12px; color: var(--muted); line-height: 1.5; margin: 0; }
.tpl-meta-row { display: flex; align-items: center; justify-content: space-between; }
.tpl-date { font-size: 10.5px; color: var(--muted); display: flex; align-items: center; gap: 4px; }
.tpl-actions { display: flex; align-items: center; gap: 6px; margin-top: 4px; flex-wrap: wrap; }

/* TABLE */
.table-wrap { overflow-x: auto; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; }
.msg-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.msg-table th { text-align: left; padding: 12px 16px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.6px; color: var(--muted); border-bottom: 1px solid var(--border); font-family: 'JetBrains Mono', monospace; }
.msg-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); vertical-align: top; }
.msg-table tr:last-child td { border-bottom: none; }
.table-title { display: block; font-weight: 600; font-size: 13px; }
.table-preview { display: block; font-size: 11px; color: var(--muted); margin-top: 3px; }
.table-time { color: var(--text2); white-space: nowrap; }
.table-actions { display: flex; gap: 5px; }
.msg-card-list { display: none; flex-direction: column; gap: 12px; }
.msg-mobile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 8px; }

/* CATEGORIES */
.cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 14px; }
.cat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.cat-card-head { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 13px; color: var(--accent); }
.cat-card-stats { display: flex; gap: 20px; }
.cat-num { display: block; font-size: 20px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.cat-num-label { display: block; font-size: 10.5px; color: var(--muted); margin-top: 2px; }
.custom-tag { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--accent); background: var(--accent-soft); border: 1px solid var(--accent-border); padding: 2px 7px; border-radius: 5px; }

/* RESTRICTED WORDS PAGE */
.words-stat-grid { margin-bottom: 18px; }
.word-list { padding: 8px; max-height: 640px; overflow-y: auto; }
.word-row { display: flex; align-items: flex-start; gap: 12px; padding: 12px 10px; border-radius: 8px; border-bottom: 1px solid var(--border); }
.word-row:last-child { border-bottom: none; }
.word-row-disabled { opacity: 0.45; }
.word-toggle { background: none; border: none; cursor: pointer; padding: 2px; flex-shrink: 0; margin-top: 1px; }
.word-row-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.word-row-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.word-row-text { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; }
.word-row-reason { font-size: 12px; color: var(--text2); line-height: 1.5; margin: 0; }
.word-row-fix { font-size: 11px; color: var(--accent); margin: 0; }
.word-row-actions { display: flex; gap: 6px; flex-shrink: 0; }

/* SETTINGS */
.settings-section { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 6px 18px; margin-bottom: 16px; }
.settings-heading { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--muted); padding: 14px 0 4px; margin: 0; }
.settings-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-top: 1px solid var(--border); gap: 14px; flex-wrap: wrap; }
.settings-section .settings-heading + .settings-row { border-top: none; }
.settings-row-title { font-size: 13px; font-weight: 600; }
.settings-row-sub { font-size: 11.5px; color: var(--text2); margin: 2px 0 0; }
.backup-note { display: flex; align-items: flex-start; gap: 8px; padding: 12px 0 16px; color: var(--muted); font-size: 11px; line-height: 1.6; }
.backup-note svg { flex-shrink: 0; margin-top: 2px; }

/* MODALS */
.modal-overlay { position: fixed; inset: 0; background: rgba(3,5,12,0.65); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 12px; width: 100%; box-shadow: 0 24px 60px rgba(0,0,0,0.5); max-height: 88vh; display: flex; flex-direction: column; }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; border-bottom: 1px solid var(--border); }
.modal-head h3 { font-size: 15px; font-weight: 700; margin: 0; }
.modal-body { padding: 18px; overflow-y: auto; }
.modal-actions { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 18px; border-top: 1px solid var(--border); }
.confirm-message { font-size: 13px; color: var(--text2); line-height: 1.6; padding: 0 0 4px; margin: 0; }
.form-grid { display: flex; flex-direction: column; gap: 14px; }
.text-input { background: var(--surface2); border: 1px solid var(--border); color: var(--text); border-radius: 8px; padding: 9px 11px; font-size: 13px; font-family: inherit; width: 100%; outline: none; }
.text-input:focus { border-color: var(--accent); }
.textarea-sm { resize: vertical; line-height: 1.6; }
.inline-scan-result { font-size: 11.5px; font-weight: 600; padding: 8px 10px; border-radius: 7px; background: var(--surface2); }
.inline-scan-high { color: var(--high); } .inline-scan-medium { color: var(--medium); } .inline-scan-low { color: var(--low); } .inline-scan-safe { color: var(--safe); }

/* INSERT TEMPLATE LIST */
.insert-list { max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
.insert-group-title { font-size: 10px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 6px; }
.insert-item { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 10px 11px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-size: 12.5px; font-weight: 600; cursor: pointer; margin-bottom: 6px; font-family: inherit; }
.insert-item:hover { border-color: var(--accent); }

/* DYNAMIC VARIABLE BAR */
.var-shortcuts-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--surface2);
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}
.var-bar-title {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.var-chips {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.var-chip-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text2);
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s ease;
}
.var-chip-btn:hover {
  background: var(--surface3);
  color: var(--text);
  border-color: var(--accent-border);
}

/* AUDIT CHECKLIST */
.audit-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.audit-meter-banner {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.audit-meter-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.audit-meter-title {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text);
}
.audit-meter-score {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
}
.audit-meter-bar {
  height: 5px;
  background: var(--surface3);
  border-radius: 4px;
  overflow: hidden;
}
.audit-meter-fill {
  height: 100%;
  border-radius: 4px;
  transition: width .25s ease;
}
.audit-checklist {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.audit-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface2);
}
.audit-item-pass { border-color: rgba(16, 185, 129, 0.2); }
.audit-item-fail { border-color: rgba(244, 63, 94, 0.25); background: rgba(244, 63, 94, 0.04); }
.audit-item-pass .audit-icon { color: var(--safe); margin-top: 1px; }
.audit-item-fail .audit-icon { color: var(--high); margin-top: 1px; }
.audit-content { flex: 1; min-width: 0; }
.audit-label { font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
.audit-desc { font-size: 11px; color: var(--text2); line-height: 1.35; }
.audit-tag {
  font-size: 9.5px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}
.audit-tag-pass { background: var(--accent-soft); color: var(--accent); }
.audit-tag-fail { background: var(--high-bg); color: var(--high); }
.audit-length-box {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.audit-hint { font-size: 11px; color: var(--muted); line-height: 1.35; }

/* TELEMETRY PASTE HINT */
.t-paste-hint {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--medium);
  margin-top: 2px;
}

/* SPEED TRAINER STYLES */
.trainer-scenario-strip {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}
.trainer-tab-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
  transition: all .15s ease;
  font-family: inherit;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.trainer-tab-card:hover {
  border-color: var(--border2);
  background: var(--surface2);
}
.trainer-tab-active {
  border-color: var(--accent) !important;
  background: var(--surface2) !important;
  box-shadow: 0 0 0 1px var(--accent);
}
.trainer-tab-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.trainer-tab-cat {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--muted);
  letter-spacing: 0.4px;
}
.trainer-level-tag {
  font-size: 9.5px;
  font-weight: 600;
  color: var(--text2);
  background: var(--surface3);
  padding: 1px 6px;
  border-radius: 4px;
}
.trainer-pb-badge {
  font-size: 9.5px;
  font-weight: 700;
  color: var(--hyphen);
  background: var(--hyphen-bg);
  padding: 1px 6px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.trainer-tab-title {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.25;
}
.trainer-tab-meta {
  font-size: 10.5px;
  color: var(--muted);
}
.trainer-workbench {
  display: flex;
  flex-direction: column;
}
.trainer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.trainer-display {
  padding: 20px 22px;
  font-size: 17px;
  line-height: 1.7;
  letter-spacing: 0.2px;
  cursor: text;
  background: var(--surface);
  user-select: none;
  min-height: 130px;
  border-bottom: 1px solid var(--border);
}
.trainer-char {
  position: relative;
  transition: color .08s ease;
}
.trainer-char-pending {
  color: var(--muted);
  opacity: 0.75;
}
.trainer-char-correct {
  color: var(--safe);
}
.trainer-char-incorrect {
  color: var(--high);
  background: rgba(244, 63, 94, 0.2);
  border-radius: 2px;
}
.trainer-char-cursor {
  border-left: 2px solid var(--accent);
  animation: blink 1s infinite;
}
.trainer-input-wrap {
  padding: 14px 18px;
  background: var(--surface2);
}
.trainer-textarea {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: 14.5px;
  line-height: 1.5;
  resize: none;
  outline: none;
}
.trainer-textarea:focus {
  border-color: var(--accent);
}
.trainer-result-box {
  padding: 18px 22px;
  border-top: 1px solid var(--border);
  background: var(--surface);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.trainer-result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.trainer-badge-success {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 15px;
  font-weight: 700;
  color: var(--safe);
}
.trainer-score-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.trainer-wpm-pill, .trainer-acc-pill, .trainer-time-pill {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12.5px;
  border: 1px solid var(--border);
  background: var(--surface2);
  color: var(--text);
}
.trainer-wpm-pill strong { color: var(--accent); font-size: 14px; }
.trainer-acc-pill strong { color: var(--low); font-size: 14px; }
.trainer-time-pill strong { color: var(--text); font-size: 14px; }
.trainer-advice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  background: var(--surface2);
  border: 1px solid var(--border);
  font-size: 12.5px;
  color: var(--text2);
  line-height: 1.45;
}
.trainer-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.btn-compact {
  padding: 6px 10px !important;
  font-size: 11.5px !important;
}

/* TOASTS */
.toast-stack { position: fixed; bottom: 22px; right: 22px; display: flex; flex-direction: column; gap: 8px; z-index: 1200; }
.toast { display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border2); color: var(--text); padding: 10px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 600; box-shadow: 0 10px 30px rgba(0,0,0,0.4); animation: toastIn .2s ease; }
.toast-danger { border-color: var(--high-border); color: var(--high); }
.toast-warning { border-color: var(--medium-border); color: var(--medium); }
@keyframes toastIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* RESPONSIVE */
@media (max-width: 1024px) {
  .telemetry-strip { grid-template-columns: 1fr; gap: 12px; }
  .t-divider { width: 100%; height: 1px; }
  .dash-typing-body { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 980px) {
  .checker-grid { grid-template-columns: 1fr; }
  .dash-columns { grid-template-columns: 1fr; }
  .stat-grid { grid-template-columns: 1fr 1fr; }
  .dash-secondary-grid { grid-template-columns: 1fr 1fr; }
  .quick-actions { grid-template-columns: 1fr; }
}
@media (max-width: 800px) {
  .sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 1100; transform: translateX(-100%); transition: transform .25s ease; box-shadow: 20px 0 40px rgba(0,0,0,0.4); }
  .sidebar-open { transform: translateX(0); }
  .drawer-close { display: inline-flex; margin-left: auto; background: none; border: none; color: var(--muted); cursor: pointer; }
  .drawer-backdrop { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1050; }
  .mobile-topbar { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 40; }
  .mobile-brand { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 700; }
  .menu-btn { display: inline-flex; }
  .page-header-left .menu-btn { display: none; }
  .table-wrap { display: none; }
  .msg-card-list { display: flex; }
  .stat-grid { grid-template-columns: 1fr 1fr; }
  .page-body { padding: 16px 14px 32px; }
  .week-body { grid-template-columns: 1fr; }
}
@media (max-width: 540px) {
  .dash-typing-body { grid-template-columns: 1fr; }
  .stat-grid { grid-template-columns: 1fr; }
  .dash-secondary-grid { grid-template-columns: 1fr; }
  .clock-cluster { width: 100%; justify-content: space-between; }
}
html, body, #root { height: 100%; }
body { margin: 0; }
`;
