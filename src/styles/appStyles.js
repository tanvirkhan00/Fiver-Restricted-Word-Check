export const CSS = `
:root {}
.app-root {
  --bg: #080b12; --surface: #0e1220; --surface2: #161b2e; --surface3: #1d2340;
  --border: #1f2640; --border2: #2a3260; --text: #e2e8ff; --text2: #8892b0; --muted: #5a6590;
  --accent: #4f9eff; --accent-fg: #04101f;
  --high: #ff4d6d; --high-bg: rgba(255,77,109,0.10); --high-border: rgba(255,77,109,0.3);
  --medium: #ffb020; --medium-bg: rgba(255,176,32,0.10); --medium-border: rgba(255,176,32,0.3);
  --low: #22d3a5; --low-bg: rgba(34,211,165,0.10); --low-border: rgba(34,211,165,0.3);
  --safe: #22d3a5;
  font-family: 'Space Grotesk', 'DM Sans', sans-serif;
  background: var(--bg); color: var(--text);
  display: flex; min-height: 640px; width: 100%;
  border-radius: 14px; overflow: hidden;
  position: relative;
}
.app-root.theme-light {
  --bg: #f4f6fb; --surface: #ffffff; --surface2: #f0f2f9; --surface3: #e6e9f5;
  --border: #e1e5f2; --border2: #d3d9ec; --text: #10152a; --text2: #5b6482; --muted: #93a0c6;
  --accent: #2f6fe0; --accent-fg: #ffffff;
}
.app-root * { box-sizing: border-box; }
.mono { font-family: 'JetBrains Mono', 'DM Mono', monospace; }

/* SIDEBAR */
.sidebar {
  width: 246px; flex-shrink: 0; background: var(--surface); border-right: 1px solid var(--border);
  display: flex; flex-direction: column; padding: 18px 14px; gap: 16px;
}
.sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 4px 6px 14px; border-bottom: 1px solid var(--border); position: relative; }
.brand-shield { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, var(--accent), #2a5fc7); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
.sidebar-brand h1 { font-size: 13.5px; font-weight: 700; line-height: 1.2; }
.sidebar-brand p { font-size: 10px; color: var(--muted); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.3px; margin-top: 2px; }
.drawer-close { display: none; }
.sidebar-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px; background: transparent; border: none; color: var(--text2); font-size: 13px; font-weight: 500; cursor: pointer; text-align: left; position: relative; transition: background .15s, color .15s; }
.nav-item:hover { background: var(--surface2); color: var(--text); }
.nav-item-active { background: var(--surface2); color: var(--accent); }
.nav-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); margin-left: auto; }
.sidebar-footer { border-top: 1px solid var(--border); padding-top: 12px; display: flex; flex-direction: column; gap: 10px; }
.theme-toggle { display: flex; align-items: center; gap: 8px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px; color: var(--text2); font-size: 12px; cursor: pointer; }
.theme-toggle:hover { color: var(--text); border-color: var(--border2); }
.theme-toggle-inline { width: fit-content; }
.profile-row { display: flex; align-items: center; gap: 9px; }
.avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--surface3); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: var(--accent); flex-shrink: 0; }
.avatar-img { object-fit: cover; }
.profile-meta { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.profile-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sidebar-auth-btn { margin-top: 10px; }
.auth-loading { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; height: 100vh; color: var(--text2); font-size: 13px; }
.profile-name { font-size: 12px; font-weight: 600; }
.profile-role { font-size: 10.5px; color: var(--muted); }

.drawer-backdrop { display: none; }
.palette-trigger { display: flex; align-items: center; gap: 8px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px; color: var(--muted); font-size: 12px; cursor: pointer; width: 100%; }
.palette-trigger:hover { color: var(--text); border-color: var(--border2); }
.palette-trigger span:first-of-type { flex: 1; text-align: left; }
.palette-kbd { display: inline-flex; align-items: center; gap: 2px; font-size: 9.5px; font-family: 'JetBrains Mono', monospace; background: var(--surface3); border: 1px solid var(--border2); border-radius: 4px; padding: 1px 5px; color: var(--muted); }
.palette-overlay { align-items: flex-start; padding-top: 12vh; }
.palette-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 14px; width: 100%; max-width: 480px; box-shadow: 0 24px 60px rgba(0,0,0,0.55); overflow: hidden; }
.palette-search { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid var(--border); color: var(--muted); }
.palette-search input { flex: 1; background: none; border: none; outline: none; color: var(--text); font-size: 14px; font-family: inherit; }
.palette-results { max-height: 360px; overflow-y: auto; padding: 8px; }
.palette-group { margin-bottom: 6px; }
.palette-group-title { display: block; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--muted); padding: 6px 8px 4px; }
.palette-item { width: 100%; display: flex; align-items: center; gap: 10px; padding: 9px 10px; background: none; border: none; border-radius: 8px; color: var(--text); font-size: 13px; font-weight: 600; cursor: pointer; text-align: left; }
.palette-item:hover { background: var(--surface2); }
.palette-item-arrow { margin-left: auto; color: var(--muted); }
.palette-item-cat { margin-left: auto; font-size: 10.5px; font-weight: 600; color: var(--muted); }
.palette-empty { padding: 24px 12px; text-align: center; font-size: 12.5px; color: var(--muted); }

/* MAIN AREA */
.main-area { flex: 1; min-width: 0; overflow-y: auto; background: var(--bg); background-image: radial-gradient(ellipse 70% 50% at 15% 0%, rgba(79,158,255,0.06) 0%, transparent 60%); }
.mobile-topbar { display: none; }
.page-body { padding: 24px 28px 40px; max-width: 1180px; margin: 0 auto; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 22px; flex-wrap: wrap; }
.page-header-left { display: flex; align-items: flex-start; gap: 10px; }
.page-header h2 { font-size: 20px; font-weight: 700; letter-spacing: -0.3px; }
.page-header p { font-size: 12.5px; color: var(--text2); margin-top: 3px; }
.menu-btn { display: none; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 7px; color: var(--text2); cursor: pointer; }

.badge-live { display: flex; align-items: center; gap: 7px; padding: 7px 13px; background: var(--surface); border: 1px solid var(--border); border-radius: 100px; font-size: 11px; color: var(--text2); font-family: 'JetBrains Mono', monospace; }
.live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--safe); box-shadow: 0 0 8px var(--safe); animation: blink 2s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

/* CARD */
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.12); }
.card-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 16px; border-bottom: 1px solid var(--border); }
.card-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; gap: 8px; }
.card-label::before { content: ''; width: 3px; height: 13px; background: var(--accent); border-radius: 2px; }
.char-meta { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--muted); }
.link-btn { background: none; border: none; color: var(--accent); font-size: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; padding: 0; }
.link-btn:hover { text-decoration: underline; }

/* STAT GRID */
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 12px; }
.stat-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon-accent { background: rgba(79,158,255,0.14); color: var(--accent); }
.stat-icon-low { background: var(--low-bg); color: var(--low); }
.stat-icon-high { background: var(--high-bg); color: var(--high); }
.stat-icon-medium { background: var(--medium-bg); color: var(--medium); }
.stat-value { display: block; font-size: 21px; font-weight: 700; line-height: 1.1; }
.stat-label { display: block; font-size: 11px; color: var(--text2); margin-top: 2px; }

/* QUICK ACTIONS */
.quick-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 22px; }
.qa-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 15px 16px; display: flex; align-items: center; gap: 10px; color: var(--text); font-size: 13px; font-weight: 600; cursor: pointer; transition: border-color .15s, transform .15s; }
.qa-card:hover { border-color: var(--accent); transform: translateY(-1px); }
.qa-card svg:first-child { color: var(--accent); }
.qa-arrow { margin-left: auto; color: var(--muted); }

/* DASHBOARD COLUMNS */
.week-card { margin-bottom: 16px; }
.week-delta { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.week-delta-up { color: var(--low); }
.week-delta-down { color: var(--muted); }
.week-body { padding: 16px; display: grid; grid-template-columns: auto 1fr auto; gap: 24px; align-items: center; }
.week-stat { display: flex; flex-direction: column; gap: 3px; }
.week-stat-value { font-size: 28px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.week-stat-label { font-size: 10.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
.week-bar-wrap { display: flex; flex-direction: column; gap: 8px; min-width: 160px; }
.week-bar { height: 8px; border-radius: 100px; background: var(--high-bg); overflow: hidden; }
.week-bar-fill { height: 100%; background: var(--safe); border-radius: 100px; transition: width .5s; }
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
.activity-check { color: var(--low); flex-shrink: 0; }
.activity-label { flex: 1; color: var(--text2); }
.activity-time { font-size: 10.5px; color: var(--muted); flex-shrink: 0; }

/* STATUS CHIP / BADGE / PILL */
.status-chip { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 3px 9px; border-radius: 100px; border: 1px solid; }
.cat-pill { font-size: 10.5px; font-weight: 600; padding: 3px 9px; border-radius: 100px; background: var(--surface3); color: var(--text2); }
.badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; padding: 5px 10px; border-radius: 100px; border: 1px solid var(--border); }
.badge-muted { color: var(--text2); }

/* CHECKER GRID */
.checker-grid { display: grid; grid-template-columns: 1fr 380px; gap: 16px; align-items: stretch; margin-bottom: 16px; }
.composer-card { display: flex; flex-direction: column; }
.composer-toolbar { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
.field-label { font-size: 11px; font-weight: 600; color: var(--text2); display: flex; flex-direction: column; gap: 6px; }
.field-label-inline { flex-direction: row; align-items: center; gap: 8px; white-space: nowrap; }
.field-hint { font-weight: 400; color: var(--muted); font-size: 10.5px; }
.select { background: var(--surface2); border: 1px solid var(--border); color: var(--text); border-radius: 7px; padding: 7px 10px; font-size: 12.5px; font-family: inherit; }
.select-sm { padding: 7px 9px; }
.insert-link { margin-left: auto; }
.composer-textarea { flex: 1; width: 100%; min-height: 220px; padding: 16px; background: transparent; border: none; outline: none; resize: none; font-size: 14px; font-family: 'Space Grotesk', sans-serif; color: var(--text); line-height: 1.7; }
.composer-textarea::placeholder { color: var(--muted); }
.composer-footer { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px 14px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 10px; }
.composer-actions { display: flex; gap: 8px; flex-wrap: wrap; }

.analysis-col { display: flex; flex-direction: column; gap: 16px; height: 100%; }
.issues-card { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.issues-body { flex: 1; padding: 10px; min-height: 140px; max-height: none; overflow-y: auto; }
.status-body { display: flex; align-items: center; gap: 16px; padding: 16px; }
.gauge { position: relative; width: 140px; height: 140px; flex-shrink: 0; }
.gauge-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.gauge-score { font-size: 26px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.gauge-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
.status-side { display: flex; flex-direction: column; gap: 6px; }
.status-side-label { font-size: 10.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
.status-side-value { font-size: 14px; font-weight: 700; display: flex; align-items: center; gap: 6px; }

.risk-pills { display: grid; grid-template-columns: 1fr 1fr 1fr; border-top: 1px solid var(--border); }
.risk-pill { padding: 13px 8px; text-align: center; border-right: 1px solid var(--border); transition: background .3s; }
.risk-pill:last-child { border-right: none; }
.pill-count { display: block; font-size: 22px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.pill-label { display: block; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; margin-top: 3px; opacity: 0.75; }
.risk-pill.high { color: var(--high); } .risk-pill.med { color: var(--medium); } .risk-pill.low { color: var(--low); }
.risk-pill.high.active { background: var(--high-bg); } .risk-pill.med.active { background: var(--medium-bg); } .risk-pill.low.active { background: var(--low-bg); }

.issue-card { padding: 11px 12px; border-radius: 9px; margin-bottom: 7px; border: 1px solid transparent; }
.issue-high { background: var(--high-bg); border-color: var(--high-border); }
.issue-medium { background: var(--medium-bg); border-color: var(--medium-border); }
.issue-low { background: var(--low-bg); border-color: var(--low-border); }
.issue-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.issue-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.issue-dot-high { background: var(--high); } .issue-dot-medium { background: var(--medium); } .issue-dot-low { background: var(--low); }
.issue-keyword { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; flex: 1; }
.issue-high .issue-keyword { color: var(--high); } .issue-medium .issue-keyword { color: var(--medium); } .issue-low .issue-keyword { color: var(--low); }
.issue-badge { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; padding: 2px 7px; border-radius: 4px; }
.issue-badge-high { background: var(--high); color: #fff; } .issue-badge-medium { background: var(--medium); color: #1a1200; } .issue-badge-low { background: var(--low); color: #04231b; }
.flag-notice { display: flex; gap: 7px; background: rgba(0,0,0,0.15); border-radius: 6px; padding: 7px 9px; font-size: 11.5px; line-height: 1.5; color: var(--text2); }
.flag-icon { flex-shrink: 0; margin-top: 1px; opacity: .8; }
.issue-suggestion { font-size: 11px; color: var(--muted); margin-top: 6px; line-height: 1.5; }
.issue-bottom-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.06); }
.issue-cat { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
.fix-btn { display: inline-flex; align-items: center; gap: 5px; background: rgba(79,158,255,0.12); color: var(--accent); border: 1px solid rgba(79,158,255,0.3); font-size: 10px; font-weight: 700; padding: 4px 9px; border-radius: 6px; cursor: pointer; white-space: nowrap; }
.fix-btn:hover { background: rgba(79,158,255,0.2); }
.fix-all-btn { display: inline-flex; align-items: center; gap: 6px; background: var(--accent); color: var(--accent-fg); border: none; font-size: 10.5px; font-weight: 700; padding: 6px 11px; border-radius: 100px; cursor: pointer; }
.fix-all-btn:hover { filter: brightness(1.08); }

.preview-card { position: relative; }
.preview-body { padding: 16px 18px; min-height: 90px; font-size: 14px; line-height: 1.75; word-break: break-word; }
.preview-placeholder { position: absolute; top: 46px; left: 18px; color: var(--muted); font-size: 12.5px; pointer-events: none; }
.h-high, .h-medium, .h-low { border-radius: 3px; padding: 0 2px; font-weight: 700; cursor: help; }
.h-high { background: var(--high-bg); color: var(--high); border-bottom: 1.5px solid var(--high); }
.h-medium { background: var(--medium-bg); color: var(--medium); border-bottom: 1.5px solid var(--medium); }
.h-low { background: var(--low-bg); color: var(--low); border-bottom: 1.5px solid var(--low); }
.tooltip-wrap { position: relative; display: inline; }
.tooltip { visibility: hidden; opacity: 0; pointer-events: none; position: absolute; z-index: 999; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(4px); min-width: 220px; max-width: 280px; background: #0e1a30; border: 1px solid #2a3260; border-radius: 9px; padding: 10px 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.5); transition: opacity .18s, transform .18s; display: block; }
.tooltip-wrap:hover .tooltip { visibility: visible; opacity: 1; transform: translateX(-50%) translateY(0); }
.tt-header { display: flex; align-items: center; gap: 6px; margin-bottom: 7px; padding-bottom: 7px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.tt-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
.tt-dot-high { background: var(--high); } .tt-dot-medium { background: var(--medium); } .tt-dot-low { background: var(--low); }
.tt-word { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; flex: 1; color: #e2e8ff; }
.tt-badge { font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; color: #fff; }
.tt-badge-high { background: var(--high); } .tt-badge-medium { background: var(--medium); color: #1a1200; } .tt-badge-low { background: var(--low); color: #04231b; }
.tt-reason { font-size: 11.5px; line-height: 1.55; color: #b7c0e0; display: block; }
.tt-category { font-size: 10px; font-family: 'JetBrains Mono', monospace; color: #7480a8; margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08); display: block; text-transform: uppercase; }

/* EMPTY STATE */
.empty-state { padding: 40px 20px; text-align: center; color: var(--muted); display: flex; flex-direction: column; align-items: center; gap: 6px; }
.empty-icon { color: var(--muted); margin-bottom: 4px; }
.empty-state h4 { font-size: 13.5px; color: var(--text); font-weight: 700; }
.empty-state p { font-size: 12px; line-height: 1.6; max-width: 300px; margin-bottom: 8px; }

/* BUTTONS */
.btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: all .15s; white-space: nowrap; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-full { width: 100%; justify-content: center; }
.btn-primary { background: var(--accent); color: var(--accent-fg); }
.btn-primary:hover:not(:disabled) { filter: brightness(1.08); }
.btn-secondary { background: var(--surface2); color: var(--text); border-color: var(--border); }
.btn-secondary:hover:not(:disabled) { border-color: var(--border2); }
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
.chip { background: var(--surface); border: 1px solid var(--border); color: var(--text2); font-size: 11.5px; font-weight: 600; padding: 7px 12px; border-radius: 100px; cursor: pointer; }
.chip-active { background: var(--accent); color: var(--accent-fg); border-color: var(--accent); }

/* TEMPLATES */
.tpl-group { margin-bottom: 22px; }
.tpl-group-title { font-size: 10.5px; font-weight: 700; letter-spacing: 1px; color: var(--muted); font-family: 'JetBrains Mono', monospace; margin-bottom: 10px; }
.tpl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
.tpl-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 15px; display: flex; flex-direction: column; gap: 8px; }
.tpl-card-pinned { border-color: rgba(255,176,32,0.35); box-shadow: 0 0 0 1px rgba(255,176,32,0.12); }
.tpl-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.tpl-top-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.tpl-name { font-size: 13.5px; font-weight: 700; }
.tpl-desc { font-size: 11.5px; color: var(--text2); }
.usage-badge { display: inline-flex; align-items: center; gap: 3px; font-size: 9.5px; font-weight: 700; color: var(--muted); background: var(--surface3); padding: 2px 6px; border-radius: 100px; }
.icon-btn-pinned { color: var(--medium); border-color: var(--medium-border); background: var(--medium-bg); }
.chip-star { display: inline-flex; align-items: center; gap: 5px; }
.tpl-preview { font-size: 12px; color: var(--muted); line-height: 1.5; }
.tpl-meta-row { display: flex; align-items: center; justify-content: space-between; }
.tpl-date { font-size: 10.5px; color: var(--muted); display: flex; align-items: center; gap: 4px; }
.tpl-actions { display: flex; align-items: center; gap: 6px; margin-top: 4px; flex-wrap: wrap; }

/* TABLE */
.table-wrap { overflow-x: auto; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; }
.msg-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.msg-table th { text-align: left; padding: 12px 16px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.6px; color: var(--muted); border-bottom: 1px solid var(--border); font-family: 'JetBrains Mono', monospace; }
.msg-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); vertical-align: top; }
.msg-table tr:last-child td { border-bottom: none; }
.table-title { display: block; font-weight: 600; font-size: 13px; }
.table-preview { display: block; font-size: 11px; color: var(--muted); margin-top: 3px; }
.table-time { color: var(--text2); white-space: nowrap; }
.table-actions { display: flex; gap: 5px; }
.msg-card-list { display: none; flex-direction: column; gap: 12px; }
.msg-mobile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 8px; }

/* CATEGORIES */
.cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 14px; }
.cat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.cat-card-head { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 13px; color: var(--accent); }
.cat-card-stats { display: flex; gap: 20px; }
.cat-num { display: block; font-size: 20px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.cat-num-label { display: block; font-size: 10.5px; color: var(--muted); margin-top: 2px; }
.custom-tag { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--accent); background: rgba(79,158,255,0.12); border: 1px solid rgba(79,158,255,0.3); padding: 2px 7px; border-radius: 100px; }

/* RESTRICTED WORDS PAGE */
.words-stat-grid { margin-bottom: 18px; }
.word-list { padding: 8px; max-height: 640px; overflow-y: auto; }
.word-row { display: flex; align-items: flex-start; gap: 12px; padding: 12px 10px; border-radius: 9px; border-bottom: 1px solid var(--border); }
.word-row:last-child { border-bottom: none; }
.word-row-disabled { opacity: 0.45; }
.word-toggle { background: none; border: none; cursor: pointer; padding: 2px; flex-shrink: 0; margin-top: 1px; }
.word-row-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.word-row-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.word-row-text { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; }
.word-row-reason { font-size: 12px; color: var(--text2); line-height: 1.5; }
.word-row-fix { font-size: 11px; color: var(--accent); }
.word-row-actions { display: flex; gap: 6px; flex-shrink: 0; }

/* SETTINGS */
.settings-section { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 6px 18px; margin-bottom: 16px; }
.settings-heading { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--muted); padding: 14px 0 4px; }
.settings-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-top: 1px solid var(--border); gap: 14px; flex-wrap: wrap; }
.settings-section .settings-heading + .settings-row { border-top: none; }
.settings-row-title { font-size: 13px; font-weight: 600; }
.settings-row-sub { font-size: 11.5px; color: var(--text2); margin-top: 2px; }
.backup-note { display: flex; align-items: flex-start; gap: 8px; padding: 12px 0 16px; color: var(--muted); font-size: 11px; line-height: 1.6; }
.backup-note svg { flex-shrink: 0; margin-top: 2px; }

/* MODALS */
.modal-overlay { position: fixed; inset: 0; background: rgba(3,5,12,0.6); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 14px; width: 100%; box-shadow: 0 24px 60px rgba(0,0,0,0.5); max-height: 88vh; display: flex; flex-direction: column; }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; border-bottom: 1px solid var(--border); }
.modal-head h3 { font-size: 15px; font-weight: 700; }
.modal-body { padding: 18px; overflow-y: auto; }
.modal-actions { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 18px; border-top: 1px solid var(--border); }
.confirm-message { font-size: 13px; color: var(--text2); line-height: 1.6; padding: 0 0 4px; }
.form-grid { display: flex; flex-direction: column; gap: 14px; }
.text-input { background: var(--surface2); border: 1px solid var(--border); color: var(--text); border-radius: 8px; padding: 9px 11px; font-size: 13px; font-family: inherit; width: 100%; outline: none; }
.text-input:focus { border-color: var(--accent); }
.textarea-sm { resize: vertical; line-height: 1.6; }
.inline-scan-result { font-size: 11.5px; font-weight: 600; padding: 8px 10px; border-radius: 7px; background: var(--surface2); }
.inline-scan-high { color: var(--high); } .inline-scan-medium { color: var(--medium); } .inline-scan-low { color: var(--low); } .inline-scan-safe { color: var(--safe); }

/* INSERT TEMPLATE LIST */
.insert-list { max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
.insert-group-title { font-size: 10px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 6px; }
.insert-item { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 10px 11px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-size: 12.5px; font-weight: 600; cursor: pointer; margin-bottom: 6px; }
.insert-item:hover { border-color: var(--accent); }

/* TOASTS */
.toast-stack { position: fixed; bottom: 22px; right: 22px; display: flex; flex-direction: column; gap: 8px; z-index: 1200; }
.toast { display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border2); color: var(--text); padding: 10px 14px; border-radius: 9px; font-size: 12.5px; font-weight: 600; box-shadow: 0 10px 30px rgba(0,0,0,0.4); animation: toastIn .2s ease; }
.toast-danger { border-color: var(--high-border); color: var(--high); }
@keyframes toastIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* RESPONSIVE */
@media (max-width: 980px) {
  .checker-grid { grid-template-columns: 1fr; }
  .dash-columns { grid-template-columns: 1fr; }
  .stat-grid { grid-template-columns: 1fr 1fr; }
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
@media (max-width: 480px) {
  .stat-grid { grid-template-columns: 1fr; }
  .status-body { flex-direction: column; text-align: center; }
}
html, body, #root { height: 100%; }
body { margin: 0; }
`;
