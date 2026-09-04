import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Shield, LayoutDashboard, MessageSquareText, BookmarkCheck, Tags,
  Settings as SettingsIcon, Search, Plus, Copy as CopyIcon, Trash2, Pencil,
  Files, X, Check, AlertTriangle, Info, ChevronDown, Menu, Sun, Moon, Clock,
  FileText, Send, ArrowRight, Filter, ShieldCheck, ShieldAlert, ShieldX,
  ListChecks, Save, ClipboardList, ChevronRight, Star, Command, TrendingUp, Wand2,
  Download, Upload, DatabaseBackup, Ban, ToggleLeft, ToggleRight, PlusCircle, ShieldOff
} from "lucide-react";

/* ======================================================================
   DATA: restricted-word ruleset (unchanged from the original scanner)
====================================================================== */
const RESTRICTED_WORDS = [
  { word: "reach me on", level: "high", category: "Off-Platform Contact", reason: "Asking to be reached on external platforms bypasses Fiverr's communication policy and puts both parties at risk of scams and loss of protection.", fix: "reach me here in Fiverr chat" },
  { word: "text", level: "high", category: "Off-Platform Contact", reason: "Requesting texts outside Fiverr removes all transaction records and voids buyer/seller protections.", fix: "message" },
  { word: "call", level: "high", category: "Off-Platform Contact", reason: "Initiating calls outside Fiverr violates TOS and removes dispute resolution coverage.", fix: "Fiverr's call feature" },
  { word: "number", level: "high", category: "Off-Platform Contact", reason: "Sharing personal phone numbers can expose you to harassment, spam, and bypasses platform safety.", fix: "Fiverr's messaging system" },
  { word: "send me your number", level: "high", category: "Off-Platform Contact", reason: "Requesting someone's personal phone number is a red flag for off-platform solicitation.", fix: "" },
  { word: "email", level: "high", category: "Off-Platform Contact", reason: "Email sharing is typically used to move communication off Fiverr, violating their Terms of Service.", fix: "Fiverr Inbox" },
  { word: "my email is", level: "high", category: "Off-Platform Contact", reason: "Sharing email addresses to conduct business outside Fiverr can result in account suspension.", fix: "" },
  { word: "contact me directly", level: "high", category: "Off-Platform Contact", reason: "Directing contact outside Fiverr strips away dispute resolution and fraud protections.", fix: "message me here on Fiverr" },
  { word: "contact", level: "high", category: "Off-Platform Contact", reason: "Directing contact outside Fiverr strips away dispute resolution and fraud protections.", fix: "message" },
  { word: "dm me on", level: "high", category: "Off-Platform Contact", reason: "Requesting DMs on other platforms is a TOS violation and common scam vector.", fix: "message me here on Fiverr" },
  { word: "inbox me", level: "high", category: "Off-Platform Contact", reason: "Vague phrasing often used to redirect conversations to external platforms.", fix: "message me here on Fiverr" },
  { word: "private message", level: "high", category: "Off-Platform Contact", reason: "Soliciting private messages outside Fiverr bypasses platform monitoring and protection.", fix: "Fiverr message" },
  { word: "reach out on", level: "high", category: "Off-Platform Contact", reason: "Directing someone to contact you elsewhere violates Fiverr's communication policy.", fix: "message me here on Fiverr" },
  { word: "linkedin", level: "high", category: "Social Media Bypass", reason: "Mentioning LinkedIn can indicate an attempt to redirect business or communication off Fiverr.", fix: "" },
  { word: "twitter", level: "high", category: "Social Media Bypass", reason: "Social media references are often used to move transactions off-platform, violating TOS.", fix: "" },
  { word: "x.com", level: "high", category: "Social Media Bypass", reason: "Linking to X/Twitter suggests off-platform contact or payment solicitation.", fix: "" },
  { word: "snapchat", level: "high", category: "Social Media Bypass", reason: "Snapchat references in professional contexts are a red flag for off-platform activity.", fix: "" },
  { word: "tiktok", level: "high", category: "Social Media Bypass", reason: "TikTok mentions may indicate redirection away from Fiverr's secure messaging system.", fix: "" },
  { word: "pinterest", level: "high", category: "Social Media Bypass", reason: "Redirecting to Pinterest can be used to share portfolio or contact info outside TOS.", fix: "" },
  { word: "youtube", level: "high", category: "Social Media Bypass", reason: "YouTube links may be used to bypass Fiverr review or direct external contact.", fix: "" },
  { word: "facebook", level: "high", category: "Social Media Bypass", reason: "Facebook references often indicate an intent to communicate or transact off-platform.", fix: "" },
  { word: "instagram", level: "high", category: "Social Media Bypass", reason: "Instagram links violate Fiverr TOS when used to solicit off-platform work or payment.", fix: "" },
  { word: "send money", level: "high", category: "Payment Bypass", reason: "Requesting money outside Fiverr is a serious TOS violation and common fraud vector — you lose all buyer protection.", fix: "pay through Fiverr's secure checkout" },
  { word: "transfer money", level: "high", category: "Payment Bypass", reason: "Money transfers outside Fiverr are irreversible and unprotected against scams.", fix: "pay through Fiverr's secure checkout" },
  { word: "pay outside", level: "high", category: "Payment Bypass", reason: "Paying outside Fiverr voids all dispute protection and is explicitly against TOS.", fix: "pay through Fiverr" },
  { word: "pay", level: "high", category: "Payment Bypass", reason: "This word may indicate an attempt to arrange payment outside Fiverr's secure checkout.", fix: "pay through Fiverr" },
  { word: "payment", level: "high", category: "Payment Bypass", reason: "Payment-related language may signal attempts to move financial transactions off-platform.", fix: "Fiverr payment" },
  { word: "outside payment", level: "high", category: "Payment Bypass", reason: "Explicit off-platform payment solicitation — a direct TOS violation and scam risk.", fix: "Fiverr payment" },
  { word: "pay separately", level: "high", category: "Payment Bypass", reason: "Suggesting separate payment bypasses Fiverr's transaction system and buyer protections.", fix: "pay through Fiverr" },
  { word: "western union", level: "high", category: "Payment Bypass", reason: "Western Union is a classic scam tool — Fiverr strictly prohibits its use for payments.", fix: "Fiverr's secure checkout" },
  { word: "moneygram", level: "high", category: "Payment Bypass", reason: "MoneyGram transfers are unrecoverable and prohibited for Fiverr transactions.", fix: "Fiverr's secure checkout" },
  { word: "skrill", level: "high", category: "Payment Bypass", reason: "Third-party payment processors like Skrill are not permitted in Fiverr transactions.", fix: "Fiverr's secure checkout" },
  { word: "cashapp", level: "high", category: "Payment Bypass", reason: "CashApp payments outside Fiverr bypass dispute resolution and violate TOS.", fix: "Fiverr's secure checkout" },
  { word: "venmo", level: "high", category: "Payment Bypass", reason: "Venmo transactions are unprotected and prohibited for Fiverr-related payments.", fix: "Fiverr's secure checkout" },
  { word: "wise transfer", level: "high", category: "Payment Bypass", reason: "Wire/bank transfers outside Fiverr are irreversible and violate platform policy.", fix: "Fiverr's secure checkout" },
  { word: "remitly", level: "high", category: "Payment Bypass", reason: "Third-party remittance apps violate Fiverr TOS and remove financial protections.", fix: "Fiverr's secure checkout" },
  { word: "http://", level: "high", category: "External Link", reason: "HTTP links can direct users to external sites for off-platform contact or payment, violating TOS.", fix: "" },
  { word: "https://", level: "high", category: "External Link", reason: "External website links may be used to share contact info or redirect payments outside Fiverr.", fix: "" },
  { word: ".com", level: "medium", category: "External Link", reason: "Domain mentions may indicate sharing of external websites for contact or portfolio, which can violate TOS.", fix: "" },
  { word: ".net", level: "medium", category: "External Link", reason: "External domain references may signal off-platform communication or portfolio links.", fix: "" },
  { word: ".org", level: "medium", category: "External Link", reason: "External domain references may be used to redirect users away from the platform.", fix: "" },
  { word: "www.", level: "medium", category: "External Link", reason: "Website references can indicate an attempt to move communication or payment off Fiverr.", fix: "" },
  { word: "portfolio link", level: "medium", category: "External Link", reason: "While portfolios are acceptable, sharing links may redirect clients off-platform.", fix: "my Fiverr portfolio" },
  { word: "check my website", level: "medium", category: "External Link", reason: "Directing clients to external websites can violate Fiverr's communication policies.", fix: "check my Fiverr gig gallery" },
  { word: "book a call", level: "medium", category: "External Meeting", reason: "Booking calls outside Fiverr's system removes the protection of on-platform records.", fix: "schedule a Fiverr call" },
  { word: "jump on a call", level: "medium", category: "External Meeting", reason: "External calls are not monitored by Fiverr and remove dispute resolution coverage.", fix: "hop on a Fiverr call" },
  { word: "quick call", level: "medium", category: "External Meeting", reason: "Suggesting calls outside platform channels can violate communication guidelines.", fix: "quick Fiverr call" },
  { word: "video call", level: "medium", category: "External Meeting", reason: "Video calls arranged off Fiverr remove transaction transparency and dispute protection.", fix: "Fiverr video call" },
  { word: "voice call", level: "medium", category: "External Meeting", reason: "Unmonitored voice calls bypass Fiverr's dispute resolution and TOS guidelines.", fix: "Fiverr voice call" },
  { word: "meeting link", level: "medium", category: "External Meeting", reason: "Sharing meeting links may indicate off-platform coordination, which can violate TOS.", fix: "Fiverr call scheduling" },
  { word: "calendar link", level: "medium", category: "External Meeting", reason: "Calendar scheduling tools can be used to arrange off-platform meetings or calls.", fix: "Fiverr call scheduling" },
  { word: "send otp", level: "high", category: "Sensitive Information", reason: "Requesting OTPs is a major red flag for account takeover scams — never share verification codes.", fix: "" },
  { word: "verification code", level: "high", category: "Sensitive Information", reason: "Asking for verification codes is a clear sign of phishing or account hijacking.", fix: "" },
  { word: "credit card", level: "high", category: "Sensitive Information", reason: "Requesting credit card details is a scam vector — Fiverr never asks for card info via chat.", fix: "" },
  { word: "debit card", level: "high", category: "Sensitive Information", reason: "Sharing debit card info outside secure payment systems risks financial fraud.", fix: "" },
  { word: "cvv", level: "high", category: "Sensitive Information", reason: "CVV codes are highly sensitive — requesting them is a serious financial fraud risk.", fix: "" },
  { word: "pin code", level: "high", category: "Sensitive Information", reason: "PIN codes should never be shared; this is a critical phishing and fraud signal.", fix: "" },
  { word: "bank details", level: "high", category: "Sensitive Information", reason: "Sharing banking information outside secure systems is a severe fraud risk.", fix: "" },
  { word: "guaranteed profit", level: "high", category: "Scam Indicator", reason: "No legitimate investment or service guarantees profit — this is a classic scam tactic.", fix: "" },
  { word: "double your money", level: "high", category: "Scam Indicator", reason: "Promises to double money are hallmarks of financial scams and Ponzi schemes.", fix: "" },
  { word: "investment plan", level: "high", category: "Scam Indicator", reason: "Investment solicitations on Fiverr are prohibited and commonly associated with fraud.", fix: "" },
  { word: "earn fast money", level: "high", category: "Scam Indicator", reason: "Get-rich-quick language is a major red flag for scams and violates Fiverr's policies.", fix: "" },
  { word: "review", level: "high", category: "Review Manipulation", reason: "Mentioning reviews in messages can indicate manipulation attempts, which are strictly prohibited.", fix: "your feedback" },
  { word: "positive review", level: "high", category: "Review Manipulation", reason: "Soliciting positive reviews violates Fiverr's review integrity policy.", fix: "your honest feedback" },
  { word: "5 star review", level: "high", category: "Review Manipulation", reason: "Requesting 5-star reviews is a direct TOS violation and can result in account suspension.", fix: "your honest feedback" },
  { word: "exchange review", level: "high", category: "Review Manipulation", reason: "Review exchanges are explicitly banned as they undermine platform trust.", fix: "" },
  { word: "review in return", level: "high", category: "Review Manipulation", reason: "Offering services or perks in exchange for reviews is prohibited and can get you banned.", fix: "" },
  { word: "feedback", level: "high", category: "Review Manipulation", reason: "Soliciting specific feedback can cross into review manipulation, which violates TOS.", fix: "your thoughts" },
  { word: "work outside fiverr", level: "high", category: "Off-Platform Work", reason: "Soliciting work outside Fiverr is a direct TOS violation and can result in permanent ban.", fix: "" },
  { word: "long term outside", level: "high", category: "Off-Platform Work", reason: "Arranging ongoing work outside Fiverr bypasses platform fees and violates TOS.", fix: "" },
  { word: "hire directly", level: "high", category: "Off-Platform Work", reason: "Direct hiring outside Fiverr is prohibited and removes buyer/seller protections.", fix: "" },
  { word: "deal outside", level: "high", category: "Off-Platform Work", reason: "Off-platform deals violate Fiverr's Terms of Service and void all protections.", fix: "" },
  { word: "chat", level: "low", category: "Communication Signal", reason: "Casual communication references — low risk but worth monitoring for off-platform intent.", fix: "Fiverr message" },
  { word: "talk", level: "low", category: "Communication Signal", reason: "Vague communication language — usually harmless but may precede off-platform requests.", fix: "connect" },
  { word: "reach", level: "low", category: "Communication Signal", reason: "Could indicate intent to contact outside platform — context-dependent risk.", fix: "connect" },

  // Messaging apps (Fiverr's Trust & Safety team and community reports repeatedly flag these as the #1 off-platform redirect vector)
  { word: "whatsapp", level: "high", category: "Social Media Bypass", reason: "WhatsApp is the most commonly reported off-platform redirect tool on Fiverr and is explicitly against the off-platform activity policy.", fix: "" },
  { word: "telegram", level: "high", category: "Social Media Bypass", reason: "Telegram handles are a well-documented scam and off-platform solicitation vector reported frequently by the Fiverr community.", fix: "" },
  { word: "skype", level: "high", category: "Social Media Bypass", reason: "Requesting Skype contact moves communication outside Fiverr's monitored and protected messaging system.", fix: "" },
  { word: "discord", level: "high", category: "Social Media Bypass", reason: "Discord invites are used to move conversations off Fiverr, which violates the off-platform activity policy.", fix: "" },
  { word: "wechat", level: "high", category: "Social Media Bypass", reason: "WeChat contact requests are a common off-platform redirect method flagged by Fiverr's Trust & Safety team.", fix: "" },
  { word: "viber", level: "high", category: "Social Media Bypass", reason: "Viber is an off-platform messaging app; sharing it removes Fiverr's dispute protection.", fix: "" },
  { word: "signal app", level: "high", category: "Social Media Bypass", reason: "Signal is an encrypted off-platform app sometimes used to hide contact after redirecting away from Fiverr.", fix: "" },
  { word: "imo", level: "medium", category: "Social Media Bypass", reason: "IMO is a messaging app referenced in off-platform contact attempts reported by sellers.", fix: "" },
  { word: "kik", level: "medium", category: "Social Media Bypass", reason: "Kik usernames are used to move conversations off Fiverr's monitored system.", fix: "" },
  { word: "line app", level: "medium", category: "Social Media Bypass", reason: "LINE is an off-platform messaging app referenced in redirect attempts.", fix: "" },

  // Payment methods & financial details (Fiverr's Community Standards on financial safety and off-platform payment)
  { word: "paypal", level: "high", category: "Payment Bypass", reason: "PayPal transfers outside Fiverr checkout are unprotected and explicitly against the off-platform payment policy.", fix: "Fiverr's secure checkout" },
  { word: "zelle", level: "high", category: "Payment Bypass", reason: "Zelle payments are irreversible and prohibited for Fiverr transactions.", fix: "Fiverr's secure checkout" },
  { word: "payoneer", level: "high", category: "Payment Bypass", reason: "Requesting Payoneer transfers outside Fiverr checkout bypasses buyer/seller protections.", fix: "Fiverr's secure checkout" },
  { word: "stripe", level: "high", category: "Payment Bypass", reason: "Direct Stripe payment links move transactions outside Fiverr's protected checkout system.", fix: "Fiverr's secure checkout" },
  { word: "bitcoin", level: "high", category: "Payment Bypass", reason: "Cryptocurrency payments are irreversible and a common scam vector; Fiverr requires payment through its own checkout.", fix: "" },
  { word: "usdt", level: "high", category: "Payment Bypass", reason: "Crypto/stablecoin payment requests are a common fraud pattern and violate Fiverr's payment policy.", fix: "" },
  { word: "crypto", level: "high", category: "Payment Bypass", reason: "Cryptocurrency payments bypass Fiverr's secure checkout and buyer protections entirely.", fix: "" },
  { word: "bank transfer", level: "high", category: "Payment Bypass", reason: "Direct bank transfers are irreversible and prohibited as a way to pay for Fiverr work.", fix: "Fiverr's secure checkout" },
  { word: "iban", level: "high", category: "Sensitive Information", reason: "Sharing an IBAN/bank account number outside secure systems is a serious financial fraud risk.", fix: "" },
  { word: "routing number", level: "high", category: "Sensitive Information", reason: "Bank routing numbers should never be shared in chat; this is a critical fraud signal.", fix: "" },
  { word: "gift card", level: "high", category: "Scam Indicator", reason: "Requests for payment via gift cards are one of the most common online scam patterns and are never a legitimate Fiverr payment method.", fix: "" },
  { word: "itunes card", level: "high", category: "Scam Indicator", reason: "iTunes/Apple gift card requests are a classic untraceable-payment scam tactic.", fix: "" },
  { word: "steam wallet", level: "high", category: "Scam Indicator", reason: "Steam Wallet code requests are a known scam payment method with no buyer protection.", fix: "" },

  // Additional sensitive personal information
  { word: "social security", level: "high", category: "Sensitive Information", reason: "Social Security numbers should never be requested or shared in a Fiverr chat — this is a severe identity-theft risk.", fix: "" },
  { word: "passport number", level: "high", category: "Sensitive Information", reason: "Passport numbers are highly sensitive identity documents and should never be shared over chat.", fix: "" },
  { word: "driver's license", level: "high", category: "Sensitive Information", reason: "Government ID numbers should never be shared in messages; this is a strong identity-theft red flag.", fix: "" },
  { word: "swift code", level: "medium", category: "Sensitive Information", reason: "SWIFT/BIC codes combined with other banking details can enable unauthorized transfers.", fix: "" },

  // Fee-avoidance language (a specific, frequently-cited off-platform work pattern)
  { word: "avoid the fee", level: "high", category: "Off-Platform Work", reason: "Explicitly proposing to avoid Fiverr's service fee is solicitation of off-platform work and a direct TOS violation.", fix: "" },
  { word: "save on fees", level: "high", category: "Off-Platform Work", reason: "Offering to save on fees by working outside Fiverr is prohibited off-platform solicitation.", fix: "" },
  { word: "cheaper if we", level: "high", category: "Off-Platform Work", reason: "Offering a discount for moving off-platform is a direct TOS violation and voids buyer/seller protection.", fix: "" },
  { word: "outside of fiverr", level: "high", category: "Off-Platform Work", reason: "Explicitly proposing to work outside Fiverr is prohibited and can result in permanent suspension.", fix: "" },

].sort((a, b) => b.word.length - a.word.length);

const CATEGORIES = ["First Draft", "Meeting Approach", "Follow Up", "Delivery Message", "Revision / Adjustment", "Extend Message", "General"];
const APP_VERSION = "2.0.0";

/* Seed content so the app never opens completely empty */
const SEED_TEMPLATES = [
  { id: "t1", name: "Initial Client Update", category: "First Draft", description: "Kick off a new order with a friendly status note.", content: "Hi! Thanks so much for your order. I'm getting started on it right away and will keep you posted on progress here in the Fiverr inbox.", tags: ["intro", "starter"], createdAt: Date.now() - 86400000 * 6, updatedAt: Date.now() - 86400000 * 6, riskStatus: "safe", riskScore: 0, pinned: true, usageCount: 4 },
  { id: "t2", name: "Meeting Request", category: "Meeting Approach", description: "Ask to hop on a Fiverr voice/video session.", content: "Would you be open to a quick call through Fiverr's built-in voice feature so I can confirm a few details before I begin?", tags: ["scheduling"], createdAt: Date.now() - 86400000 * 5, updatedAt: Date.now() - 86400000 * 5, riskStatus: "medium", riskScore: 10, pinned: false, usageCount: 1 },
  { id: "t3", name: "Project Follow Up", category: "Follow Up", description: "Check in on a quiet order.", content: "Hi, just checking in — have you had a chance to look over the last delivery? Let me know if anything needs adjusting.", tags: ["check-in"], createdAt: Date.now() - 86400000 * 3, updatedAt: Date.now() - 86400000 * 3, riskStatus: "safe", riskScore: 0, pinned: true, usageCount: 3 },
  { id: "t4", name: "Project Delivery", category: "Delivery Message", description: "Deliver finished work with next steps.", content: "Your order is complete and delivered! Please review the files and let me know if you'd like any revisions before marking it complete.", tags: ["delivery"], createdAt: Date.now() - 86400000 * 2, updatedAt: Date.now() - 86400000 * 2, riskStatus: "safe", riskScore: 0, pinned: false, usageCount: 2 },
  { id: "t5", name: "Revision Request", category: "Revision / Adjustment", description: "Ask the client for clarification on changes.", content: "Thanks for the notes! Could you clarify which section you'd like adjusted so I can get the revision right the first time?", tags: ["revision"], createdAt: Date.now() - 86400000, updatedAt: Date.now() - 86400000, riskStatus: "safe", riskScore: 0, pinned: false, usageCount: 0 },
  { id: "t6", name: "Request Deadline Extension", category: "Extend Message", description: "Politely ask for a short extension before the delivery date.", content: "Hi! To make sure I deliver the best possible quality on this project, I'd like to request a short extension on the delivery date. Would an extra couple of days work on your end? I'll keep you updated with progress along the way — thank you for your understanding!", tags: ["extension", "deadline"], createdAt: Date.now() - 43200000, updatedAt: Date.now() - 43200000, riskStatus: "safe", riskScore: 0, pinned: false, usageCount: 0 },
];

/* ======================================================================
   SCANNER LOGIC (ported 1:1 from the original vanilla-JS scanner)
====================================================================== */
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function scanMessage(text, wordList = RESTRICTED_WORDS) {
  const found = [];
  const foundWords = new Set();
  wordList.forEach((item) => {
    const escaped = item.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    if (regex.test(text) && !foundWords.has(item.word.toLowerCase())) {
      foundWords.add(item.word.toLowerCase());
      found.push(item);
    }
  });
  const highCount = found.filter((f) => f.level === "high").length;
  const medCount = found.filter((f) => f.level === "medium").length;
  const lowCount = found.filter((f) => f.level === "low").length;
  const score = Math.min(100, highCount * 25 + medCount * 10 + lowCount * 5);
  let status = "safe";
  if (score >= 60) status = "high";
  else if (score >= 30) status = "medium";
  else if (score > 0) status = "low";
  return { found, highCount, medCount, lowCount, score, status };
}

/* Apply a single flagged word/phrase's suggested safe rewrite. An empty
   `fix` means "remove it" rather than swap in a replacement. */
function applyFix(text, item) {
  const escaped = item.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escaped}\\b`, "gi");
  const replaced = text.replace(regex, item.fix || "");
  return replaced.replace(/[ \t]{2,}/g, " ").replace(/ +([,.!?])/g, "$1").trim();
}

/* Apply every currently-detected issue's fix in one pass. */
function applyAllFixes(text, found) {
  let next = text;
  [...found].sort((a, b) => b.word.length - a.word.length).forEach((item) => {
    next = applyFix(next, item);
  });
  return next;
}

/* Combine the built-in word list (minus anything the user disabled) with
   the user's own custom words (only the enabled ones), for scanning. */
function buildWordList(disabledBuiltinWords, customWords) {
  const disabled = new Set((disabledBuiltinWords || []).map((w) => w.toLowerCase()));
  const builtinActive = RESTRICTED_WORDS.filter((w) => !disabled.has(w.word.toLowerCase()));
  const customActive = (customWords || [])
    .filter((w) => w.enabled)
    .map((w) => ({
      word: w.word,
      level: w.level,
      category: w.category || "Custom",
      reason: w.reason || "Custom restricted word added by you.",
      fix: w.fix || "",
      custom: true,
    }));
  return [...builtinActive, ...customActive].sort((a, b) => b.word.length - a.word.length);
}

function buildHighlightHtml(text, found) {
  if (!text) return "";
  let html = escapeHtml(text);
  const sorted = [...found].sort((a, b) => b.word.length - a.word.length);
  sorted.forEach((item) => {
    const escaped = item.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b(${escaped})\\b`, "gi");
    const levelClass = item.level === "high" ? "h-high" : item.level === "medium" ? "h-medium" : "h-low";
    html = html.replace(
      regex,
      `<span class="tooltip-wrap"><span class="${levelClass}">$1</span><span class="tooltip"><span class="tt-header"><span class="tt-dot tt-dot-${item.level}"></span><span class="tt-word">${item.word}</span><span class="tt-badge tt-badge-${item.level}">${item.level}</span></span><span class="tt-reason">${item.reason}</span><span class="tt-category">⊡ ${item.category}</span></span></span>`
    );
  });
  return html.replace(/\n/g, "<br>");
}

function statusMeta(status) {
  switch (status) {
    case "high": return { label: "High Risk", color: "var(--high)", Icon: ShieldX };
    case "medium": return { label: "Medium Risk", color: "var(--medium)", Icon: ShieldAlert };
    case "low": return { label: "Low Risk", color: "var(--low)", Icon: ShieldAlert };
    default: return { label: "Safe", color: "var(--safe)", Icon: ShieldCheck };
  }
}

function timeAgo(ts) {
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

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

/* ======================================================================
   STORAGE HELPERS (persistent artifact key-value storage)
====================================================================== */
const STORE_KEY = "fiverr-safety-checker:state";

async function loadState() {
  try {
    const res = await window.storage.get(STORE_KEY, false);
    return res ? JSON.parse(res.value) : null;
  } catch {
    return null;
  }
}
async function saveState(state) {
  try {
    await window.storage.set(STORE_KEY, JSON.stringify(state), false);
  } catch (e) {
    console.error("Storage error:", e);
  }
}

/* ======================================================================
   SMALL SHARED UI PRIMITIVES
====================================================================== */
function Badge({ children, tone = "muted" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function IconButton({ icon: Icon, label, onClick, tone = "ghost", size = 16 }) {
  return (
    <button className={`icon-btn icon-btn-${tone}`} onClick={onClick} aria-label={label} title={label} type="button">
      <Icon size={size} />
    </button>
  );
}

function Button({ children, icon: Icon, tone = "secondary", onClick, type = "button", disabled, full }) {
  return (
    <button
      type={type}
      className={`btn btn-${tone}${full ? " btn-full" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon size={15} />}
      <span>{children}</span>
    </button>
  );
}

function EmptyState({ icon: Icon = FileText, title, subtitle, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon size={26} /></div>
      <h4>{title}</h4>
      {subtitle && <p>{subtitle}</p>}
      {actionLabel && <Button icon={Plus} tone="primary" onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}

function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: width }} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h3>{title}</h3>
          <IconButton icon={X} label="Close" onClick={onClose} />
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ config, onClose }) {
  if (!config) return null;
  return (
    <Modal open onClose={onClose} title={config.title} width={420}>
      <p className="confirm-message">{config.message}</p>
      <div className="modal-actions">
        <Button tone="ghost" onClick={onClose}>Cancel</Button>
        <Button tone="danger" icon={Trash2} onClick={() => { config.onConfirm(); onClose(); }}>
          {config.confirmLabel || "Delete"}
        </Button>
      </div>
    </Modal>
  );
}

function ToastStack({ toasts }) {
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.tone}`}>
          {t.tone === "danger" ? <AlertTriangle size={15} /> : <Check size={15} />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/* ======================================================================
   COMMAND PALETTE (Ctrl/Cmd+K)
====================================================================== */
function CommandPalette({ open, onClose, onNavigate, templates, onUseTemplate }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const pages = NAV_ITEMS.filter((p) => !q || p.label.toLowerCase().includes(q));
  const tpls = q ? templates.filter((t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)).slice(0, 6) : [];

  return (
    <div className="modal-overlay palette-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="palette-card" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette-search">
          <Search size={16} />
          <input
            ref={inputRef}
            placeholder="Jump to a page or template..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
          />
          <span className="palette-kbd">Esc</span>
        </div>
        <div className="palette-results">
          {pages.length > 0 && (
            <div className="palette-group">
              <span className="palette-group-title">Pages</span>
              {pages.map((p) => (
                <button key={p.id} className="palette-item" onClick={() => { onNavigate(p.id); onClose(); }}>
                  <p.icon size={15} />
                  <span>{p.label}</span>
                  <ChevronRight size={13} className="palette-item-arrow" />
                </button>
              ))}
            </div>
          )}
          {tpls.length > 0 && (
            <div className="palette-group">
              <span className="palette-group-title">Templates</span>
              {tpls.map((t) => (
                <button key={t.id} className="palette-item" onClick={() => { onUseTemplate(t); onClose(); }}>
                  <Files size={15} />
                  <span>{t.name}</span>
                  <span className="palette-item-cat">{t.category}</span>
                </button>
              ))}
            </div>
          )}
          {pages.length === 0 && tpls.length === 0 && (
            <div className="palette-empty">No matches for &ldquo;{query}&rdquo;.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function RiskGauge({ score, status }) {
  const meta = statusMeta(status);
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, score);
  const offset = c - (pct / 100) * c;
  return (
    <div className="gauge">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--surface3)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r} fill="none" stroke={meta.color} strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 70 70)" style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(.4,0,.2,1), stroke .3s" }}
        />
      </svg>
      <div className="gauge-center">
        <span className="gauge-score">{score}</span>
        <span className="gauge-label" style={{ color: meta.color }}>{meta.label}</span>
      </div>
    </div>
  );
}

function CategoryPill({ value }) {
  return <span className="cat-pill">{value}</span>;
}

/* Type-or-pick category input. Backed by a native <datalist> so people get
   autocomplete suggestions from existing categories but can freely type
   a brand-new one — saving a message with it is what "creates" it. */
function CategoryField({ id, value, onChange, categories, label = "Category" }) {
  const listId = `${id}-catlist`;
  return (
    <label className="field-label" htmlFor={id}>
      {label} <span className="field-hint">(pick one or type a new category)</span>
      <input
        id={id}
        list={listId}
        className="text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. General"
      />
      <datalist id={listId}>
        {categories.map((c) => <option key={c} value={c} />)}
      </datalist>
    </label>
  );
}

/* ======================================================================
   SIDEBAR + HEADER
====================================================================== */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "checker", label: "Message Checker", icon: MessageSquareText },
  { id: "templates", label: "Message Templates", icon: Files },
  { id: "saved", label: "Saved Messages", icon: BookmarkCheck },
  { id: "words", label: "Restricted Words", icon: Ban },
  { id: "categories", label: "Categories", icon: Tags },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

function Sidebar({ page, setPage, mobileOpen, setMobileOpen, theme, toggleTheme, onOpenPalette }) {
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
            <div className="avatar">TK</div>
            <div className="profile-meta">
              <span className="profile-name">Tanvir Khan</span>
              <span className="profile-role">Freelancer</span>
            </div>
            <button className="icon-btn icon-btn-ghost" onClick={() => setPage("settings")} aria-label="Settings">
              <SettingsIcon size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function PageHeader({ title, subtitle, onMenu, right }) {
  return (
    <div className="page-header">
      <div className="page-header-left">
        <button className="menu-btn" onClick={onMenu} aria-label="Open menu"><Menu size={18} /></button>
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {right && <div className="page-header-right">{right}</div>}
    </div>
  );
}

/* ======================================================================
   DASHBOARD
====================================================================== */
function Dashboard({ messages, templates, activity, setPage, startNewCheck }) {
  const safeCount = messages.filter((m) => m.riskStatus === "safe").length;
  const attentionCount = messages.filter((m) => m.riskStatus !== "safe").length;

  const stats = [
    { label: "Messages Checked", value: messages.length, icon: MessageSquareText, tone: "accent" },
    { label: "Safe Messages", value: safeCount, icon: ShieldCheck, tone: "low" },
    { label: "Needing Attention", value: attentionCount, icon: ShieldAlert, tone: "high" },
    { label: "Saved Templates", value: templates.length, icon: Files, tone: "medium" },
  ];

  const now = Date.now();
  const oneWeek = 7 * 86400000;
  const thisWeek = messages.filter((m) => now - m.createdAt < oneWeek);
  const lastWeek = messages.filter((m) => now - m.createdAt >= oneWeek && now - m.createdAt < oneWeek * 2);
  const thisWeekSafe = thisWeek.filter((m) => m.riskStatus === "safe").length;
  const thisWeekAttention = thisWeek.length - thisWeekSafe;
  const weekDelta = thisWeek.length - lastWeek.length;
  const safePct = thisWeek.length ? Math.round((thisWeekSafe / thisWeek.length) * 100) : 0;

  const topTemplates = [...templates].filter((t) => t.usageCount > 0).sort((a, b) => b.usageCount - a.usageCount).slice(0, 3);

  return (
    <div className="page-body">
      <PageHeader title="Dashboard" subtitle="Your Fiverr message safety, at a glance." onMenu={() => {}} />

      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon stat-icon-${s.tone}`}><s.icon size={18} /></div>
            <div>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <button className="qa-card" onClick={() => setPage("checker")}>
          <MessageSquareText size={18} />
          <span>Check New Message</span>
          <ArrowRight size={14} className="qa-arrow" />
        </button>
        <button className="qa-card" onClick={() => setPage("templates")}>
          <Plus size={18} />
          <span>Create Template</span>
          <ArrowRight size={14} className="qa-arrow" />
        </button>
        <button className="qa-card" onClick={() => setPage("saved")}>
          <BookmarkCheck size={18} />
          <span>View Saved Messages</span>
          <ArrowRight size={14} className="qa-arrow" />
        </button>
      </div>

      <div className="week-card card">
        <div className="card-head">
          <span className="card-label">This Week</span>
          {lastWeek.length > 0 && (
            <span className={`week-delta ${weekDelta >= 0 ? "week-delta-up" : "week-delta-down"}`}>
              <TrendingUp size={12} /> {weekDelta >= 0 ? "+" : ""}{weekDelta} vs last week
            </span>
          )}
        </div>
        <div className="week-body">
          <div className="week-stat">
            <span className="week-stat-value">{thisWeek.length}</span>
            <span className="week-stat-label">Messages checked</span>
          </div>
          <div className="week-bar-wrap">
            <div className="week-bar">
              <div className="week-bar-fill" style={{ width: `${safePct}%` }} />
            </div>
            <div className="week-bar-legend">
              <span><span className="dot dot-safe" /> {thisWeekSafe} safe</span>
              <span><span className="dot dot-high" /> {thisWeekAttention} needed attention</span>
            </div>
          </div>
          {topTemplates.length > 0 && (
            <div className="week-top-templates">
              <span className="week-stat-label">Most used templates</span>
              {topTemplates.map((t) => (
                <div className="week-top-row" key={t.id}>
                  <span>{t.name}</span>
                  <span className="usage-badge"><TrendingUp size={10} /> {t.usageCount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="dash-columns">
        <div className="card">
          <div className="card-head">
            <span className="card-label">Recent Messages</span>
            <button className="link-btn" onClick={() => setPage("saved")}>View all</button>
          </div>
          <div className="list-body">
            {messages.length === 0 ? (
              <EmptyState icon={BookmarkCheck} title="No saved messages yet" subtitle="Save messages from the checker to see them here." actionLabel="Check a message" onAction={() => setPage("checker")} />
            ) : (
              messages.slice(0, 5).map((m) => {
                const meta = statusMeta(m.riskStatus);
                return (
                  <div className="recent-row" key={m.id}>
                    <div className="recent-row-main">
                      <span className="recent-title">{m.title}</span>
                      <span className="recent-cat">{m.category}</span>
                    </div>
                    <div className="recent-row-meta">
                      <span className="status-chip" style={{ color: meta.color, borderColor: meta.color }}>{meta.label}</span>
                      <span className="recent-time"><Clock size={11} /> {timeAgo(m.updatedAt)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-label">Recent Activity</span></div>
          <div className="list-body">
            {activity.length === 0 ? (
              <EmptyState icon={ListChecks} title="No activity yet" subtitle="Actions you take will show up here." />
            ) : (
              activity.slice(0, 8).map((a) => (
                <div className="activity-row" key={a.id}>
                  <Check size={13} className="activity-check" />
                  <span className="activity-label">{a.label}</span>
                  <span className="activity-time">{timeAgo(a.timestamp)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================================
   MESSAGE CHECKER
====================================================================== */
function IssueCard({ item, onFix }) {
  return (
    <div className={`issue-card issue-${item.level}`}>
      <div className="issue-top">
        <span className={`issue-dot issue-dot-${item.level}`} />
        <span className="issue-keyword">&ldquo;{item.word}&rdquo;</span>
        <span className={`issue-badge issue-badge-${item.level}`}>{item.level}</span>
      </div>
      <div className="flag-notice">
        <AlertTriangle size={12} className="flag-icon" />
        <span>{item.reason}</span>
      </div>
      <div className="issue-suggestion">
        {item.fix
          ? <>Suggested fix: replace with <strong>&ldquo;{item.fix}&rdquo;</strong>.</>
          : "Suggested fix: remove this phrase and keep the conversation inside Fiverr's messaging and payment system."}
      </div>
      <div className="issue-bottom-row">
        <div className="issue-cat">Category: {item.category}</div>
        {onFix && (
          <button type="button" className="fix-btn" onClick={() => onFix(item)}>
            <Wand2 size={12} /> Apply fix
          </button>
        )}
      </div>
    </div>
  );
}

function MessageChecker({
  text, setText, category, setCategory, categories, scan, onSave, onOpenInsert, addToast, textareaRef,
}) {
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const meta = statusMeta(scan.status);
  const highlightHtml = useMemo(() => buildHighlightHtml(text, scan.found), [text, scan.found]);

  const handleCopy = () => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text).then(() => addToast("Message copied to clipboard."));
  };
  const handleClear = () => {
    setText("");
    addToast("Message cleared.");
  };
  const handleFixOne = (item) => {
    setText((prev) => applyFix(prev, item));
    addToast(`Rewrote "${item.word}".`);
  };
  const handleFixAll = () => {
    setText((prev) => applyAllFixes(prev, scan.found));
    addToast(`Applied ${scan.found.length} suggested fix${scan.found.length === 1 ? "" : "es"}.`);
  };

  return (
    <div className="page-body">
      <PageHeader
        title="Message Checker"
        subtitle="Analyze your Fiverr messages before sending them."
        onMenu={() => {}}
        right={
          <div className="badge-live">
            <span className="live-dot" /> Live Scanning
          </div>
        }
      />

      <div className="checker-grid">
        {/* LEFT: composer */}
        <div className="card">
          <div className="card-head">
            <span className="card-label">Message Composer</span>
            <span className="char-meta">{text.length} chars</span>
          </div>

          <div className="composer-toolbar">
            <label className="field-label field-label-inline" htmlFor="category-select">Category</label>
            <input
              id="category-select"
              list="checker-category-list"
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Choose or type a category"
            />
            <datalist id="checker-category-list">
              {categories.map((c) => <option key={c} value={c} />)}
            </datalist>
            <button className="link-btn insert-link" onClick={onOpenInsert}>
              <Files size={13} /> Insert Template
            </button>
          </div>

          <textarea
            ref={textareaRef}
            className="composer-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your Fiverr message here to scan for policy violations and risky content..."
            aria-label="Message content"
          />

          <div className="composer-footer">
            <span className="char-meta">{words} words</span>
            <div className="composer-actions">
              <Button tone="ghost" icon={Trash2} onClick={handleClear}>Clear</Button>
              <Button tone="secondary" icon={CopyIcon} onClick={handleCopy}>Copy</Button>
              <Button tone="primary" icon={Save} onClick={onSave} disabled={!text.trim()}>Save Message</Button>
            </div>
          </div>
        </div>

        {/* RIGHT: analysis */}
        <div className="analysis-col">
          <div className="card status-card">
            <div className="card-head"><span className="card-label">Safety Analysis</span></div>
            <div className="status-body">
              <RiskGauge score={scan.score} status={scan.status} />
              <div className="status-side">
                <span className="status-side-label">Overall Status</span>
                <span className="status-side-value" style={{ color: meta.color }}>
                  <meta.Icon size={16} /> {meta.label.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="risk-pills">
              <div className={`risk-pill high${scan.highCount ? " active" : ""}`}>
                <span className="pill-count">{scan.highCount}</span>
                <span className="pill-label">High Risk</span>
              </div>
              <div className={`risk-pill med${scan.medCount ? " active" : ""}`}>
                <span className="pill-count">{scan.medCount}</span>
                <span className="pill-label">Medium</span>
              </div>
              <div className={`risk-pill low${scan.lowCount ? " active" : ""}`}>
                <span className="pill-count">{scan.lowCount}</span>
                <span className="pill-label">Low</span>
              </div>
            </div>
          </div>

          <div className="card issues-card">
            <div className="card-head">
              <span className="card-label">Detected Issues</span>
              {scan.found.length > 0 ? (
                <button type="button" className="fix-all-btn" onClick={handleFixAll}>
                  <Wand2 size={12} /> Fix all ({scan.found.length})
                </button>
              ) : (
                <span className="char-meta">{scan.found.length} found</span>
              )}
            </div>
            <div className="issues-body">
              {scan.found.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">{text ? <ShieldCheck size={26} /> : <Search size={26} />}</div>
                  <h4>{text ? "Message looks safe!" : "No issues detected"}</h4>
                  <p>{text ? "No potential Fiverr policy violations detected." : "Start typing to scan your message."}</p>
                </div>
              ) : (
                scan.found.map((item) => <IssueCard key={item.word} item={item} onFix={handleFixOne} />)
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card preview-card">
        <div className="card-head"><span className="card-label">Highlighted Preview</span></div>
        <div className="preview-body" dangerouslySetInnerHTML={{ __html: highlightHtml || "" }} />
        {!text && <div className="preview-placeholder">Highlighted preview will appear here...</div>}
      </div>
    </div>
  );
}

/* ======================================================================
   SAVE MESSAGE MODAL
====================================================================== */
function SaveMessageModal({ open, onClose, defaultContent, defaultCategory, categories, onConfirm }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(defaultCategory || "General");
  const [content, setContent] = useState(defaultContent || "");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setCategory(defaultCategory || "General");
      setContent(defaultContent || "");
      setTags("");
    }
  }, [open, defaultContent, defaultCategory]);

  return (
    <Modal open={open} onClose={onClose} title="Save Message">
      <div className="form-grid">
        <label className="field-label">Title
          <input className="text-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Website Update Follow Up" autoFocus />
        </label>
        <CategoryField id="save-msg-category" value={category} onChange={setCategory} categories={categories} />
        <label className="field-label">Content
          <textarea className="text-input textarea-sm" value={content} onChange={(e) => setContent(e.target.value)} rows={5} />
        </label>
        <label className="field-label">Tags <span className="field-hint">(comma separated, optional)</span>
          <input className="text-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. intro, delivery" />
        </label>
      </div>
      <div className="modal-actions">
        <Button tone="ghost" onClick={onClose}>Cancel</Button>
        <Button
          tone="primary"
          icon={Save}
          disabled={!title.trim() || !content.trim()}
          onClick={() => {
            onConfirm({
              title: title.trim(),
              category,
              content,
              tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
            });
          }}
        >
          Save Message
        </Button>
      </div>
    </Modal>
  );
}

/* ======================================================================
   TEMPLATE EDITOR MODAL
====================================================================== */
function TemplateModal({ open, onClose, initial, categories, wordList, onConfirm }) {
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
function TemplateCard({ tpl, onUse, onEdit, onDuplicate, onDelete, onCopy, onTogglePin }) {
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

function TemplatesPage({ templates, categories, onUse, onCreate, onEdit, onDuplicate, onDelete, onCopy, onTogglePin }) {
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
function InsertTemplateModal({ open, onClose, templates, onInsert }) {
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
function SavedMessages({ messages, categories, onUse, onEdit, onDelete, onDuplicate, onCopy }) {
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
function EditMessageModal({ open, onClose, message, categories, onConfirm }) {
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
function WordFormModal({ open, onClose, initial, categories, onConfirm }) {
  const [word, setWord] = useState("");
  const [level, setLevel] = useState("high");
  const [category, setCategory] = useState("Custom");
  const [reason, setReason] = useState("");
  const [fix, setFix] = useState("");

  useEffect(() => {
    if (open) {
      setWord(initial?.word || "");
      setLevel(initial?.level || "high");
      setCategory(initial?.category || "Custom");
      setReason(initial?.reason || "");
      setFix(initial?.fix || "");
    }
  }, [open, initial]);

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Word" : "Add Restricted Word"} width={520}>
      <div className="form-grid">
        <label className="field-label">Word or phrase
          <input className="text-input" value={word} onChange={(e) => setWord(e.target.value)} placeholder="e.g. bkash number" autoFocus />
        </label>
        <label className="field-label">Risk level
          <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
        <CategoryField id="word-category" value={category} onChange={setCategory} categories={categories} />
        <label className="field-label">Reason <span className="field-hint">(shown when this word is flagged)</span>
          <textarea className="text-input textarea-sm" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why is this risky to send on Fiverr?" />
        </label>
        <label className="field-label">Suggested safe rewrite <span className="field-hint">(optional — leave blank to suggest removing it)</span>
          <input className="text-input" value={fix} onChange={(e) => setFix(e.target.value)} placeholder="e.g. Fiverr's secure checkout" />
        </label>
      </div>
      <div className="modal-actions">
        <Button tone="ghost" onClick={onClose}>Cancel</Button>
        <Button
          tone="primary"
          icon={Save}
          disabled={!word.trim() || !reason.trim()}
          onClick={() => onConfirm({ word: word.trim().toLowerCase(), level, category: category.trim() || "Custom", reason: reason.trim(), fix: fix.trim() })}
        >
          {initial ? "Save Changes" : "Add Word"}
        </Button>
      </div>
    </Modal>
  );
}

function WordRow({ item, onToggle, onEdit, onDelete }) {
  const levelColor = item.level === "high" ? "var(--high)" : item.level === "medium" ? "var(--medium)" : "var(--low)";
  return (
    <div className={`word-row${item.enabled ? "" : " word-row-disabled"}`}>
      <button
        type="button"
        className="word-toggle"
        onClick={() => onToggle(item)}
        title={item.enabled ? "Disable — stop flagging this" : "Enable — start flagging this again"}
      >
        {item.enabled ? <ToggleRight size={20} color="var(--accent)" /> : <ToggleLeft size={20} color="var(--muted)" />}
      </button>
      <div className="word-row-main">
        <div className="word-row-top">
          <span className="word-row-text">{item.word}</span>
          <span className="issue-badge" style={{ background: levelColor, color: item.level === "medium" ? "#1a1200" : item.level === "low" ? "#04231b" : "#fff" }}>{item.level}</span>
          <CategoryPill value={item.category} />
          {item.source === "custom" && <span className="custom-tag">Custom</span>}
        </div>
        <p className="word-row-reason">{item.reason}</p>
        {item.fix && <p className="word-row-fix">Suggested rewrite: &ldquo;{item.fix}&rdquo;</p>}
      </div>
      {item.source === "custom" && (
        <div className="word-row-actions">
          <IconButton icon={Pencil} label="Edit" onClick={() => onEdit(item)} />
          <IconButton icon={Trash2} label="Delete" tone="danger" onClick={() => onDelete(item)} />
        </div>
      )}
    </div>
  );
}

function RestrictedWordsPage({ disabledBuiltinWords, customWords, categories, onToggleBuiltin, onAddCustom, onUpdateCustom, onToggleCustom, onDeleteCustom }) {
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [modal, setModal] = useState({ open: false, initial: null });

  const disabledSet = new Set(disabledBuiltinWords.map((w) => w.toLowerCase()));
  const combined = [
    ...RESTRICTED_WORDS.map((w) => ({ ...w, source: "builtin", enabled: !disabledSet.has(w.word.toLowerCase()) })),
    ...customWords.map((w) => ({ ...w, source: "custom" })),
  ];

  const q = query.trim().toLowerCase();
  const filtered = combined.filter((w) => {
    const matchesQ = !q || w.word.toLowerCase().includes(q) || w.category.toLowerCase().includes(q);
    const matchesLevel = levelFilter === "All" || w.level === levelFilter;
    const matchesSource = sourceFilter === "All" || w.source === sourceFilter;
    return matchesQ && matchesLevel && matchesSource;
  }).sort((a, b) => a.word.localeCompare(b.word));

  const activeCount = combined.filter((w) => w.enabled).length;
  const customCount = customWords.length;

  return (
    <div className="page-body">
      <PageHeader
        title="Restricted Words"
        subtitle="The words and phrases the scanner checks for — built-in plus your own."
        onMenu={() => {}}
        right={<Button tone="primary" icon={PlusCircle} onClick={() => setModal({ open: true, initial: null })}>Add Word</Button>}
      />

      <div className="stat-grid words-stat-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-accent"><ListChecks size={18} /></div>
          <div><span className="stat-value">{combined.length}</span><span className="stat-label">Total words</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-low"><ShieldCheck size={18} /></div>
          <div><span className="stat-value">{activeCount}</span><span className="stat-label">Actively scanned</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-medium"><PlusCircle size={18} /></div>
          <div><span className="stat-value">{customCount}</span><span className="stat-label">Your custom words</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-high"><ShieldOff size={18} /></div>
          <div><span className="stat-value">{disabledBuiltinWords.length}</span><span className="stat-label">Disabled built-ins</span></div>
        </div>
      </div>

      <div className="filter-row">
        <div className="search-box">
          <Search size={15} />
          <input placeholder="Search words or categories..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="chip-row">
          {["All", "high", "medium", "low"].map((l) => (
            <button key={l} className={`chip${levelFilter === l ? " chip-active" : ""}`} onClick={() => setLevelFilter(l)}>{l === "All" ? "All levels" : l}</button>
          ))}
        </div>
        <div className="chip-row">
          {["All", "builtin", "custom"].map((s) => (
            <button key={s} className={`chip${sourceFilter === s ? " chip-active" : ""}`} onClick={() => setSourceFilter(s)}>{s === "All" ? "All sources" : s === "builtin" ? "Built-in" : "Custom"}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Search} title="No words match" subtitle="Try a different search term or filter." />
      ) : (
        <div className="card">
          <div className="word-list">
            {filtered.map((item) => (
              <WordRow
                key={`${item.source}-${item.word}-${item.id || ""}`}
                item={item}
                onToggle={(w) => w.source === "builtin" ? onToggleBuiltin(w.word) : onToggleCustom(w)}
                onEdit={(w) => setModal({ open: true, initial: w })}
                onDelete={onDeleteCustom}
              />
            ))}
          </div>
        </div>
      )}

      <WordFormModal
        open={modal.open}
        initial={modal.initial}
        categories={categories}
        onClose={() => setModal({ open: false, initial: null })}
        onConfirm={(data) => {
          if (modal.initial) onUpdateCustom(modal.initial.id, data);
          else onAddCustom(data);
          setModal({ open: false, initial: null });
        }}
      />
    </div>
  );
}

/* ======================================================================
   CATEGORIES PAGE
====================================================================== */
function CategoriesPage({ messages, templates, categories, setPage, setCheckerCategory }) {
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
function SettingsPage({ theme, toggleTheme, settings, setSettings, onClearMessages, onClearTemplates, onClearActivity, onExportData, onImportFile, lastBackupAt }) {
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
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [messages, setMessages] = useState([]);
  const [templates, setTemplates] = useState(SEED_TEMPLATES);
  const [activity, setActivity] = useState([]);
  const [settings, setSettings] = useState({ defaultCategory: "General" });
  const [customWords, setCustomWords] = useState([]);
  const [disabledBuiltinWords, setDisabledBuiltinWords] = useState([]);

  const [text, setText] = useState("");
  const [category, setCategory] = useState("General");
  const textareaRef = useRef(null);

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [templateModal, setTemplateModal] = useState({ open: false, initial: null });
  const [editMessage, setEditMessage] = useState(null);
  const [insertOpen, setInsertOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  /* ---- Global Ctrl/Cmd+K shortcut for the command palette ---- */
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, tone = "success") => {
    const id = uid();
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const addActivity = useCallback((label) => {
    setActivity((a) => [{ id: uid(), label, timestamp: Date.now() }, ...a].slice(0, 30));
  }, []);

  /* ---- Load persisted state once ---- */
  useEffect(() => {
    (async () => {
      const saved = await loadState();
      if (saved) {
        if (saved.messages) setMessages(saved.messages);
        if (saved.templates) setTemplates(saved.templates);
        if (saved.activity) setActivity(saved.activity);
        if (saved.settings) setSettings(saved.settings);
        if (saved.theme) setTheme(saved.theme);
        if (saved.customWords) setCustomWords(saved.customWords);
        if (saved.disabledBuiltinWords) setDisabledBuiltinWords(saved.disabledBuiltinWords);
      }
      setLoaded(true);
    })();
  }, []);

  /* ---- Persist on change ---- */
  useEffect(() => {
    if (!loaded) return;
    saveState({ messages, templates, activity, settings, theme, customWords, disabledBuiltinWords });
  }, [loaded, messages, templates, activity, settings, theme, customWords, disabledBuiltinWords]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  /* ---- Combined word list (built-in minus disabled, plus custom) used for every scan ---- */
  const wordList = useMemo(() => buildWordList(disabledBuiltinWords, customWords), [disabledBuiltinWords, customWords]);

  /* ---- Dynamic category list: the fixed defaults plus any custom category already in use ---- */
  const allCategories = useMemo(() => {
    const set = new Set(CATEGORIES);
    messages.forEach((m) => m.category && set.add(m.category));
    templates.forEach((t) => t.category && set.add(t.category));
    return Array.from(set);
  }, [messages, templates]);

  const scan = useMemo(() => scanMessage(text, wordList), [text, wordList]);

  /* ---- Checker actions ---- */
  const startNewCheck = () => {
    setPage("checker");
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleSaveMessage = (data) => {
    const now = Date.now();
    const s = scanMessage(data.content, wordList);
    const newMsg = {
      id: uid(), title: data.title, category: data.category, content: data.content,
      tags: data.tags, createdAt: now, updatedAt: now, riskStatus: s.status, riskScore: s.score, usageCount: 0,
    };
    setMessages((m) => [newMsg, ...m]);
    addActivity(`Message saved — "${data.title}"`);
    addToast("Message saved successfully.");
    setSaveModalOpen(false);
  };

  const handleEditMessage = (data) => {
    const s = scanMessage(data.content, wordList);
    setMessages((list) => list.map((m) => m.id === editMessage.id ? { ...m, ...data, riskStatus: s.status, riskScore: s.score, updatedAt: Date.now() } : m));
    addActivity(`Message updated — "${data.title}"`);
    addToast("Message updated.");
    setEditMessage(null);
  };

  const handleDeleteMessage = (m) => {
    setConfirmDialog({
      title: "Delete message",
      message: `Delete "${m.title}"? This can't be undone.`,
      confirmLabel: "Delete message",
      onConfirm: () => {
        setMessages((list) => list.filter((x) => x.id !== m.id));
        addActivity(`Message deleted — "${m.title}"`);
        addToast("Message deleted.", "danger");
      },
    });
  };

  const handleDuplicateMessage = (m) => {
    const now = Date.now();
    setMessages((list) => [{ ...m, id: uid(), title: `${m.title} (copy)`, createdAt: now, updatedAt: now }, ...list]);
    addToast("Message duplicated.");
  };

  const handleCopyMessage = (m) => {
    navigator.clipboard.writeText(m.content).then(() => addToast("Message copied to clipboard."));
  };

  const handleUseMessage = (m) => {
    setText(m.content);
    setCategory(m.category);
    setPage("checker");
    setMessages((list) => list.map((x) => x.id === m.id ? { ...x, usageCount: (x.usageCount || 0) + 1 } : x));
    addActivity(`Message loaded into checker — "${m.title}"`);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  /* ---- Template actions ---- */
  const handleCreateTemplate = (data) => {
    const now = Date.now();
    setTemplates((t) => [{ id: uid(), pinned: false, usageCount: 0, ...data, createdAt: now, updatedAt: now }, ...t]);
    addActivity(`Template saved — "${data.name}"`);
    addToast("Template created.");
    setTemplateModal({ open: false, initial: null });
  };

  const handleUpdateTemplate = (data) => {
    setTemplates((list) => list.map((t) => t.id === templateModal.initial.id ? { ...t, ...data, updatedAt: Date.now() } : t));
    addActivity(`Template updated — "${data.name}"`);
    addToast("Template updated.");
    setTemplateModal({ open: false, initial: null });
  };

  const handleDeleteTemplate = (t) => {
    setConfirmDialog({
      title: "Delete template",
      message: `Delete "${t.name}"? This can't be undone.`,
      confirmLabel: "Delete template",
      onConfirm: () => {
        setTemplates((list) => list.filter((x) => x.id !== t.id));
        addActivity(`Template deleted — "${t.name}"`);
        addToast("Template deleted.", "danger");
      },
    });
  };

  const handleDuplicateTemplate = (t) => {
    const now = Date.now();
    setTemplates((list) => [{ ...t, id: uid(), name: `${t.name} (copy)`, pinned: false, usageCount: 0, createdAt: now, updatedAt: now }, ...list]);
    addToast("Template duplicated.");
  };

  const handleCopyTemplate = (t) => {
    navigator.clipboard.writeText(t.content).then(() => addToast("Template content copied."));
  };

  const handleTogglePin = (t) => {
    setTemplates((list) => list.map((x) => x.id === t.id ? { ...x, pinned: !x.pinned } : x));
    addToast(t.pinned ? "Unpinned template." : "Pinned to top.");
  };

  const handleUseTemplate = (t) => {
    setText(t.content);
    setCategory(t.category);
    setPage("checker");
    setTemplates((list) => list.map((x) => x.id === t.id ? { ...x, usageCount: (x.usageCount || 0) + 1 } : x));
    addActivity(`Template inserted — "${t.name}"`);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleInsertTemplate = (t) => {
    setText((prev) => (prev ? `${prev}\n${t.content}` : t.content));
    setCategory(t.category);
    setTemplates((list) => list.map((x) => x.id === t.id ? { ...x, usageCount: (x.usageCount || 0) + 1 } : x));
    setInsertOpen(false);
    addToast("Template inserted.");
  };

  const clearMessages = () => setConfirmDialog({
    title: "Clear saved messages", message: "This removes every saved message. This can't be undone.", confirmLabel: "Clear all",
    onConfirm: () => { setMessages([]); addActivity("Saved messages cleared"); addToast("Saved messages cleared.", "danger"); },
  });
  const clearTemplates = () => setConfirmDialog({
    title: "Clear templates", message: "This removes every template. This can't be undone.", confirmLabel: "Clear all",
    onConfirm: () => { setTemplates([]); addActivity("Templates cleared"); addToast("Templates cleared.", "danger"); },
  });
  const clearActivity = () => setConfirmDialog({
    title: "Clear activity log", message: "This resets your recent activity history.", confirmLabel: "Clear all",
    onConfirm: () => { setActivity([]); addToast("Activity log cleared.", "danger"); },
  });

  /* ---- Restricted word management ---- */
  const handleToggleBuiltinWord = (word) => {
    setDisabledBuiltinWords((list) => {
      const w = word.toLowerCase();
      const isDisabled = list.includes(w);
      addToast(isDisabled ? `"${word}" is being scanned again.` : `"${word}" will no longer be flagged.`);
      return isDisabled ? list.filter((x) => x !== w) : [...list, w];
    });
  };

  const handleAddCustomWord = (data) => {
    setCustomWords((list) => [{ id: uid(), ...data, enabled: true }, ...list]);
    addActivity(`Custom word added — "${data.word}"`);
    addToast("Word added to the scanner.");
  };

  const handleUpdateCustomWord = (id, data) => {
    setCustomWords((list) => list.map((w) => w.id === id ? { ...w, ...data } : w));
    addToast("Word updated.");
  };

  const handleToggleCustomWord = (w) => {
    setCustomWords((list) => list.map((x) => x.id === w.id ? { ...x, enabled: !x.enabled } : x));
    addToast(w.enabled ? `"${w.word}" disabled.` : `"${w.word}" enabled.`);
  };

  const handleDeleteCustomWord = (w) => {
    setConfirmDialog({
      title: "Delete custom word",
      message: `Remove "${w.word}" from your custom word list? This can't be undone.`,
      confirmLabel: "Delete word",
      onConfirm: () => {
        setCustomWords((list) => list.filter((x) => x.id !== w.id));
        addToast("Custom word deleted.", "danger");
      },
    });
  };

  /* ---- Backup: export / import all data as a JSON file ---- */
  const [lastBackupAt, setLastBackupAt] = useState(null);

  const handleExportData = () => {
    const payload = {
      app: "Fiverr Safety Checker",
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      messages, templates, activity, settings, theme, customWords, disabledBuiltinWords,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `fiverr-safety-checker-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setLastBackupAt(Date.now());
    addActivity("Data exported to backup file");
    addToast("Backup file downloaded.");
  };

  const handleImportFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      let parsed;
      try {
        parsed = JSON.parse(reader.result);
      } catch {
        addToast("That file isn't valid JSON.", "danger");
        return;
      }
      if (!parsed || (!Array.isArray(parsed.messages) && !Array.isArray(parsed.templates))) {
        addToast("That doesn't look like a Fiverr Safety Checker backup.", "danger");
        return;
      }
      setConfirmDialog({
        title: "Import backup",
        message: `This will replace your current data with the backup${parsed.exportedAt ? ` from ${new Date(parsed.exportedAt).toLocaleString()}` : ""}. This can't be undone.`,
        confirmLabel: "Replace with backup",
        onConfirm: () => {
          if (Array.isArray(parsed.messages)) setMessages(parsed.messages);
          if (Array.isArray(parsed.templates)) setTemplates(parsed.templates);
          if (Array.isArray(parsed.activity)) setActivity(parsed.activity);
          if (parsed.settings) setSettings(parsed.settings);
          if (parsed.theme) setTheme(parsed.theme);
          if (Array.isArray(parsed.customWords)) setCustomWords(parsed.customWords);
          if (Array.isArray(parsed.disabledBuiltinWords)) setDisabledBuiltinWords(parsed.disabledBuiltinWords);
          addActivity("Data restored from backup file");
          addToast("Backup restored successfully.");
        },
      });
    };
    reader.onerror = () => addToast("Couldn't read that file.", "danger");
    reader.readAsText(file);
  };

  return (
    <div className={`app-root theme-${theme}`} data-theme={theme}>
      <style>{CSS}</style>

      <Sidebar page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} theme={theme} toggleTheme={toggleTheme} onOpenPalette={() => setPaletteOpen(true)} />

      <main className="main-area">
        <div className="mobile-topbar">
          <button className="menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={18} /></button>
          <div className="mobile-brand"><Shield size={16} /> Fiverr Safety Checker</div>
        </div>

        {page === "dashboard" && (
          <Dashboard messages={messages} templates={templates} activity={activity} setPage={setPage} startNewCheck={startNewCheck} />
        )}

        {page === "checker" && (
          <MessageChecker
            text={text} setText={setText} category={category} setCategory={setCategory} categories={allCategories}
            scan={scan} onSave={() => setSaveModalOpen(true)} onOpenInsert={() => setInsertOpen(true)}
            addToast={addToast} textareaRef={textareaRef}
          />
        )}

        {page === "templates" && (
          <TemplatesPage
            templates={templates}
            categories={allCategories}
            onUse={handleUseTemplate}
            onCreate={() => setTemplateModal({ open: true, initial: null })}
            onEdit={(t) => setTemplateModal({ open: true, initial: t })}
            onDuplicate={handleDuplicateTemplate}
            onDelete={handleDeleteTemplate}
            onCopy={handleCopyTemplate}
            onTogglePin={handleTogglePin}
          />
        )}

        {page === "saved" && (
          <SavedMessages
            messages={messages}
            categories={allCategories}
            onUse={handleUseMessage}
            onEdit={(m) => setEditMessage(m)}
            onDelete={handleDeleteMessage}
            onDuplicate={handleDuplicateMessage}
            onCopy={handleCopyMessage}
          />
        )}

        {page === "words" && (
          <RestrictedWordsPage
            disabledBuiltinWords={disabledBuiltinWords}
            customWords={customWords}
            categories={allCategories}
            onToggleBuiltin={handleToggleBuiltinWord}
            onAddCustom={handleAddCustomWord}
            onUpdateCustom={handleUpdateCustomWord}
            onToggleCustom={handleToggleCustomWord}
            onDeleteCustom={handleDeleteCustomWord}
          />
        )}

        {page === "categories" && (
          <CategoriesPage messages={messages} templates={templates} categories={allCategories} setPage={setPage} setCheckerCategory={setCategory} />
        )}

        {page === "settings" && (
          <SettingsPage
            theme={theme} toggleTheme={toggleTheme} settings={settings} setSettings={setSettings}
            onClearMessages={clearMessages} onClearTemplates={clearTemplates} onClearActivity={clearActivity}
            onExportData={handleExportData} onImportFile={handleImportFile} lastBackupAt={lastBackupAt}
          />
        )}
      </main>

      <SaveMessageModal open={saveModalOpen} onClose={() => setSaveModalOpen(false)} defaultContent={text} defaultCategory={category} categories={allCategories} onConfirm={handleSaveMessage} />
      <TemplateModal
        open={templateModal.open}
        initial={templateModal.initial}
        categories={allCategories}
        wordList={wordList}
        onClose={() => setTemplateModal({ open: false, initial: null })}
        onConfirm={templateModal.initial ? handleUpdateTemplate : handleCreateTemplate}
      />
      <EditMessageModal open={!!editMessage} message={editMessage} categories={allCategories} onClose={() => setEditMessage(null)} onConfirm={handleEditMessage} />
      <InsertTemplateModal open={insertOpen} onClose={() => setInsertOpen(false)} templates={templates} onInsert={handleInsertTemplate} />
      <ConfirmDialog config={confirmDialog} onClose={() => setConfirmDialog(null)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onNavigate={setPage} templates={templates} onUseTemplate={handleUseTemplate} />
      <ToastStack toasts={toasts} />
    </div>
  );
}

/* ======================================================================
   STYLES
====================================================================== */
const CSS = `
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
.profile-meta { display: flex; flex-direction: column; flex: 1; min-width: 0; }
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
.checker-grid { display: grid; grid-template-columns: 1fr 380px; gap: 16px; align-items: start; margin-bottom: 16px; }
.composer-toolbar { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
.field-label { font-size: 11px; font-weight: 600; color: var(--text2); display: flex; flex-direction: column; gap: 6px; }
.field-label-inline { flex-direction: row; align-items: center; gap: 8px; white-space: nowrap; }
.field-hint { font-weight: 400; color: var(--muted); font-size: 10.5px; }
.select { background: var(--surface2); border: 1px solid var(--border); color: var(--text); border-radius: 7px; padding: 7px 10px; font-size: 12.5px; font-family: inherit; }
.select-sm { padding: 7px 9px; }
.insert-link { margin-left: auto; }
.composer-textarea { width: 100%; min-height: 260px; padding: 16px; background: transparent; border: none; outline: none; resize: vertical; font-size: 14px; font-family: 'Space Grotesk', sans-serif; color: var(--text); line-height: 1.7; }
.composer-textarea::placeholder { color: var(--muted); }
.composer-footer { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px 14px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 10px; }
.composer-actions { display: flex; gap: 8px; flex-wrap: wrap; }

.analysis-col { display: flex; flex-direction: column; gap: 16px; }
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

.issues-body { padding: 10px; max-height: 320px; overflow-y: auto; }
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
`;