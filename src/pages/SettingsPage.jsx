import { useRef } from "react";
import {
  Trash2,
  Sun,
  Moon,
  ClipboardList,
  Download,
  Upload,
  DatabaseBackup
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/primitives";
import { APP_VERSION, CATEGORIES } from "../data/constants";
import { timeAgo } from "../lib/format";

export function SettingsPage({ theme, toggleTheme, settings, setSettings, onClearMessages, onClearTemplates, onClearActivity, onExportData, onImportFile, lastBackupAt }) {
  const fileInputRef = useRef(null);
  return (
    <div className="page-body">
      <PageHeader title="Settings" subtitle="Manage appearance, preferences, and stored data." onMenu={() => {}} />

      <div className="settings-section">
        <h3 className="settings-heading">Appearance</h3>
        <div className="settings-row">
          <div>
            <span className="settings-row-title">Theme</span>
            <p className="settings-row-sub">Switch between dark and light mode.</p>
          </div>
          <button className="theme-toggle theme-toggle-inline" onClick={toggleTheme}>
            {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
            <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-heading">Message Preferences</h3>
        <div className="settings-row">
          <div>
            <span className="settings-row-title">Default category</span>
            <p className="settings-row-sub">Used when starting a new message check.</p>
          </div>
          <select className="select" value={settings.defaultCategory} onChange={(e) => setSettings((s) => ({ ...s, defaultCategory: e.target.value }))}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-heading">Backup & Restore</h3>
        <div className="settings-row">
          <div>
            <span className="settings-row-title">Export all data</span>
            <p className="settings-row-sub">
              Download your saved messages, templates, and activity as a JSON file.
              {lastBackupAt ? ` Last exported ${timeAgo(lastBackupAt)}.` : " Do this before switching devices, browsers, or dev server ports."}
            </p>
          </div>
          <Button tone="secondary" icon={Download} onClick={onExportData}>Export</Button>
        </div>
        <div className="settings-row">
          <div>
            <span className="settings-row-title">Import data</span>
            <p className="settings-row-sub">Restore from a previously exported JSON backup. This replaces your current data.</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={(e) => { if (e.target.files?.[0]) onImportFile(e.target.files[0]); e.target.value = ""; }}
          />
          <Button tone="secondary" icon={Upload} onClick={() => fileInputRef.current?.click()}>Import</Button>
        </div>
        <div className="backup-note">
          <DatabaseBackup size={13} />
          <span>Saved data lives in this browser's local storage, tied to this exact address (including the port, e.g. localhost:5173). If your dev server ever starts on a different port, or you switch browsers/devices, export a backup first and import it there.</span>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-heading">Storage</h3>
        <div className="settings-row">
          <div>
            <span className="settings-row-title">Clear saved messages</span>
            <p className="settings-row-sub">Permanently remove all saved messages.</p>
          </div>
          <Button tone="danger" icon={Trash2} onClick={onClearMessages}>Clear</Button>
        </div>
        <div className="settings-row">
          <div>
            <span className="settings-row-title">Clear templates</span>
            <p className="settings-row-sub">Permanently remove all message templates.</p>
          </div>
          <Button tone="danger" icon={Trash2} onClick={onClearTemplates}>Clear</Button>
        </div>
        <div className="settings-row">
          <div>
            <span className="settings-row-title">Clear activity log</span>
            <p className="settings-row-sub">Reset the recent activity history.</p>
          </div>
          <Button tone="danger" icon={Trash2} onClick={onClearActivity}>Clear</Button>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-heading">About</h3>
        <div className="settings-row">
          <div>
            <span className="settings-row-title">Fiverr Safety Checker</span>
            <p className="settings-row-sub">Version {APP_VERSION} · Built by Tanvir Khan</p>
          </div>
          <div className="badge badge-muted"><ClipboardList size={13} /> {CATEGORIES.length} categories</div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================================
   ROOT APP
====================================================================== */
