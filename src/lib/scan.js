import { RESTRICTED_WORDS } from "../data/restrictedWords";

export function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function scanMessage(text, wordList = RESTRICTED_WORDS) {
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
export function applyFix(text, item) {
  const escaped = item.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escaped}\\b`, "gi");
  const replaced = text.replace(regex, item.fix || "");
  return replaced.replace(/[ \t]{2,}/g, " ").replace(/ +([,.!?])/g, "$1").trim();
}

/* Apply every currently-detected issue's fix in one pass. */
export function applyAllFixes(text, found) {
  let next = text;
  [...found].sort((a, b) => b.word.length - a.word.length).forEach((item) => {
    next = applyFix(next, item);
  });
  return next;
}

/* Combine the built-in word list (minus anything the user disabled) with
   the user's own custom words (only the enabled ones), for scanning. */
export function buildWordList(disabledBuiltinWords, customWords) {
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

export function buildHighlightHtml(text, found) {
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
