import {
  ShieldCheck,
  ShieldAlert,
  ShieldX
} from "lucide-react";

export function statusMeta(status) {
  switch (status) {
    case "high": return { label: "High Risk", color: "var(--high)", Icon: ShieldX };
    case "medium": return { label: "Medium Risk", color: "var(--medium)", Icon: ShieldAlert };
    case "low": return { label: "Low Risk", color: "var(--low)", Icon: ShieldAlert };
    default: return { label: "Safe", color: "var(--safe)", Icon: ShieldCheck };
  }
}

export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  return new Date(ts).toLocaleDateString();
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function formatDuration(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}
