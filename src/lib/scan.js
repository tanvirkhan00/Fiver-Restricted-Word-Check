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

/**
 * Inserts a hyphen (-) in the middle of a single token or each word of a multi-word phrase
 * so Fiverr's automated word filter does not flag it while keeping it human-readable.
 * Example: "payment" -> "pay-ment", "email" -> "em-ail", "video call" -> "vi-deo ca-ll"
 */
export function hyphenateSingleToken(token) {
  if (!token || token.includes("-")) return token;
  // Handle leading dot or protocol tokens like ".com" or "http://"
  if (token.startsWith(".") && token.length >= 3) {
    const body = token.slice(1);
    const mid = body.length === 3 ? 2 : Math.max(1, Math.floor(body.length / 2));
    return `.${body.slice(0, mid)}-${body.slice(mid)}`;
  }
  if (token.length < 2) return token;
  const mid = token.length === 3 ? 2 : Math.max(1, Math.floor(token.length / 2));
  return `${token.slice(0, mid)}-${token.slice(mid)}`;
}

export function hyphenatePhrase(phrase) {
  if (!phrase) return "";
  return phrase
    .split(/(\s+)/)
    .map((part) => (/^\s+$/.test(part) ? part : hyphenateSingleToken(part)))
    .join("");
}

export function applyHyphen(text, item) {
  const escaped = item.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escaped}\\b`, "gi");
  return text.replace(regex, (matched) => hyphenatePhrase(matched));
}

export function applyAllHyphens(text, found) {
  let next = text;
  [...found]
    .sort((a, b) => b.word.length - a.word.length)
    .forEach((item) => {
      next = applyHyphen(next, item);
    });
  return next;
}

export function dotSeparateSingleToken(token) {
  if (!token || token.includes(".")) return token;
  if (token.length < 2) return token;
  const mid = token.length === 3 ? 2 : Math.max(1, Math.floor(token.length / 2));
  return `${token.slice(0, mid)}.${token.slice(mid)}`;
}

export function dotSeparatePhrase(phrase) {
  if (!phrase) return "";
  return phrase
    .split(/(\s+)/)
    .map((part) => (/^\s+$/.test(part) ? part : dotSeparateSingleToken(part)))
    .join("");
}

export function applyDot(text, item) {
  const escaped = item.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escaped}\\b`, "gi");
  return text.replace(regex, (matched) => dotSeparatePhrase(matched));
}

export function applyAllDots(text, found) {
  let next = text;
  [...found]
    .sort((a, b) => b.word.length - a.word.length)
    .forEach((item) => {
      next = applyDot(next, item);
    });
  return next;
}

/**
 * Reverts middle-hyphens and dot separations from previously obfuscated words
 * so the user can easily undo or view clean original text.
 */
export function revertHyphensAndDots(text) {
  if (!text) return "";
  // Remove intra-word hyphens: letters-hyphen-letters (not markdown lists or em-dashes)
  let clean = text.replace(/([a-zA-Z0-9])-([a-zA-Z0-9])/g, "$1$2");
  // Remove intra-word dots that aren't domain extensions or numbers
  clean = clean.replace(/([a-zA-Z])\.([a-zA-Z]{3,})/g, "$1$2");
  return clean;
}

export function auditFiverrCompliance(text, scanResult) {
  const t = text || "";
  const trimmed = t.trim();
  const foundCount = scanResult?.found?.length || 0;

  const hasRestricted = foundCount > 0;
  const hasPhoneOrEmail = /((\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b)/.test(t);
  const hasExternalContact = /\b(whatsapp|telegram|skype|zoom|wechat|viber|call me|direct call|phone number)\b/i.test(t);
  const hasOffPlatformPay = /\b(paypal|bkash|nagad|bank transfer|wire transfer|pay outside|pay me directly|bitcoin|crypto|usdt)\b/i.test(t);
  const hasReviewAsking = /\b(5 star|five star|positive review|leave a review|give me a review|rate me|5-star|feedback for feedback)\b/i.test(t);
  const hasGreeting = /^(hi|hello|hey|dear|greetings|good morning|good afternoon|good evening|thanks|thank you)\b/i.test(trimmed);
  const hasClosing = /\b(regards|best regards|thanks|thank you|sincerely|cheers|looking forward|warm regards)[,.!\s]*$/i.test(trimmed);

  const checks = [
    {
      id: "restricted",
      label: "Zero Restricted Terms",
      desc: hasRestricted ? `${foundCount} flagged terms detected` : "All 184 Fiverr policy terms clear",
      passed: !hasRestricted,
      severity: "high",
    },
    {
      id: "contact",
      label: "No Direct Contact Info",
      desc: (hasPhoneOrEmail || hasExternalContact) ? "External contact or phone/email detected" : "No off-platform contact sharing",
      passed: !hasPhoneOrEmail && !hasExternalContact,
      severity: "high",
    },
    {
      id: "payment",
      label: "Platform Payment Protected",
      desc: hasOffPlatformPay ? "Off-Fiverr payment keywords found" : "All transactions remain on Fiverr",
      passed: !hasOffPlatformPay,
      severity: "high",
    },
    {
      id: "reviews",
      label: "Review Policy Compliant",
      desc: hasReviewAsking ? "Review / rating manipulation detected" : "No review solicitation terms",
      passed: !hasReviewAsking,
      severity: "high",
    },
    {
      id: "polite",
      label: "Professional Salutation & Closing",
      desc: (hasGreeting && hasClosing) ? "Polite greeting and signoff included" : "Missing greeting or closing signoff",
      passed: hasGreeting && hasClosing,
      severity: "low",
    },
  ];

  const totalChecks = checks.length;
  const passedChecks = checks.filter((c) => c.passed).length;
  const auditScore = Math.round((passedChecks / totalChecks) * 100);

  return {
    checks,
    passedChecks,
    totalChecks,
    auditScore,
    isFullyCompliant: passedChecks === totalChecks,
  };
}

export function applyFix(text, item) {
  const escaped = item.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escaped}\\b`, "gi");
  const replaced = text.replace(regex, item.fix || "");
  return replaced.replace(/[ \t]{2,}/g, " ").replace(/ +([,.!?])/g, "$1").trim();
}

export function applyAllFixes(text, found) {
  let next = text;
  [...found].sort((a, b) => b.word.length - a.word.length).forEach((item) => {
    next = applyFix(next, item);
  });
  return next;
}

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
    const hyphenPreview = hyphenatePhrase(item.word);
    html = html.replace(
      regex,
      `<span class="tooltip-wrap"><span class="${levelClass}">$1</span><span class="tooltip"><span class="tt-header"><span class="tt-dot tt-dot-${item.level}"></span><span class="tt-word">${item.word}</span><span class="tt-badge tt-badge-${item.level}">${item.level}</span></span><span class="tt-reason">${item.reason}</span><span class="tt-category">Safe hyphen: <strong>${hyphenPreview}</strong> · ${item.category}</span></span></span>`
    );
  });
  return html.replace(/\n/g, "<br>");
}
