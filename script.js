const restrictedWords = [
    // Off-platform contact
    { word: "reach me on", level: "high", category: "Off-Platform Contact", reason: "Asking to be reached on external platforms bypasses Fiverr's communication policy and puts both parties at risk of scams and loss of protection." },
    { word: "text", level: "high", category: "Off-Platform Contact", reason: "Requesting texts outside Fiverr removes all transaction records and voids buyer/seller protections." },
    { word: "call", level: "high", category: "Off-Platform Contact", reason: "Initiating calls outside Fiverr violates TOS and removes dispute resolution coverage." },
    { word: "number", level: "high", category: "Off-Platform Contact", reason: "Sharing personal phone numbers can expose you to harassment, spam, and bypasses platform safety." },
    { word: "send me your number", level: "high", category: "Off-Platform Contact", reason: "Requesting someone's personal phone number is a red flag for off-platform solicitation." },
    { word: "email", level: "high", category: "Off-Platform Contact", reason: "Email sharing is typically used to move communication off Fiverr, violating their Terms of Service." },
    { word: "my email is", level: "high", category: "Off-Platform Contact", reason: "Sharing email addresses to conduct business outside Fiverr can result in account suspension." },
    { word: "contact me directly", level: "high", category: "Off-Platform Contact", reason: "Directing contact outside Fiverr strips away dispute resolution and fraud protections." },
    { word: "contact", level: "high", category: "Off-Platform Contact", reason: "Directing contact outside Fiverr strips away dispute resolution and fraud protections." },
    { word: "dm me on", level: "high", category: "Off-Platform Contact", reason: "Requesting DMs on other platforms is a TOS violation and common scam vector." },
    { word: "inbox me", level: "high", category: "Off-Platform Contact", reason: "Vague phrasing often used to redirect conversations to external platforms." },
    { word: "private message", level: "high", category: "Off-Platform Contact", reason: "Soliciting private messages outside Fiverr bypasses platform monitoring and protection." },
    { word: "reach out on", level: "high", category: "Off-Platform Contact", reason: "Directing someone to contact you elsewhere violates Fiverr's communication policy." },

    // Social / Platform bypass
    { word: "linkedin", level: "high", category: "Social Media Bypass", reason: "Mentioning LinkedIn can indicate an attempt to redirect business or communication off Fiverr." },
    { word: "twitter", level: "high", category: "Social Media Bypass", reason: "Social media references are often used to move transactions off-platform, violating TOS." },
    { word: "x.com", level: "high", category: "Social Media Bypass", reason: "Linking to X/Twitter suggests off-platform contact or payment solicitation." },
    { word: "snapchat", level: "high", category: "Social Media Bypass", reason: "Snapchat references in professional contexts are a red flag for off-platform activity." },
    { word: "tiktok", level: "high", category: "Social Media Bypass", reason: "TikTok mentions may indicate redirection away from Fiverr's secure messaging system." },
    { word: "pinterest", level: "high", category: "Social Media Bypass", reason: "Redirecting to Pinterest can be used to share portfolio or contact info outside TOS." },
    { word: "youtube", level: "high", category: "Social Media Bypass", reason: "YouTube links may be used to bypass Fiverr review or direct external contact." },
    { word: "facebook", level: "high", category: "Social Media Bypass", reason: "Facebook references often indicate an intent to communicate or transact off-platform." },
    { word: "instagram", level: "high", category: "Social Media Bypass", reason: "Instagram links violate Fiverr TOS when used to solicit off-platform work or payment." },

    // Payment bypass
    { word: "send money", level: "high", category: "Payment Bypass", reason: "Requesting money outside Fiverr is a serious TOS violation and common fraud vector — you lose all buyer protection." },
    { word: "transfer money", level: "high", category: "Payment Bypass", reason: "Money transfers outside Fiverr are irreversible and unprotected against scams." },
    { word: "pay outside", level: "high", category: "Payment Bypass", reason: "Paying outside Fiverr voids all dispute protection and is explicitly against TOS." },
    { word: "pay", level: "high", category: "Payment Bypass", reason: "This word may indicate an attempt to arrange payment outside Fiverr's secure checkout." },
    { word: "payment", level: "high", category: "Payment Bypass", reason: "Payment-related language may signal attempts to move financial transactions off-platform." },
    { word: "outside payment", level: "high", category: "Payment Bypass", reason: "Explicit off-platform payment solicitation — a direct TOS violation and scam risk." },
    { word: "pay separately", level: "high", category: "Payment Bypass", reason: "Suggesting separate payment bypasses Fiverr's transaction system and buyer protections." },
    { word: "western union", level: "high", category: "Payment Bypass", reason: "Western Union is a classic scam tool — Fiverr strictly prohibits its use for payments." },
    { word: "moneygram", level: "high", category: "Payment Bypass", reason: "MoneyGram transfers are unrecoverable and prohibited for Fiverr transactions." },
    { word: "skrill", level: "high", category: "Payment Bypass", reason: "Third-party payment processors like Skrill are not permitted in Fiverr transactions." },
    { word: "cashapp", level: "high", category: "Payment Bypass", reason: "CashApp payments outside Fiverr bypass dispute resolution and violate TOS." },
    { word: "venmo", level: "high", category: "Payment Bypass", reason: "Venmo transactions are unprotected and prohibited for Fiverr-related payments." },
    { word: "wise transfer", level: "high", category: "Payment Bypass", reason: "Wire/bank transfers outside Fiverr are irreversible and violate platform policy." },
    { word: "remitly", level: "high", category: "Payment Bypass", reason: "Third-party remittance apps violate Fiverr TOS and remove financial protections." },

    // External links
    { word: "http://", level: "high", category: "External Link", reason: "HTTP links can direct users to external sites for off-platform contact or payment, violating TOS." },
    { word: "https://", level: "high", category: "External Link", reason: "External website links may be used to share contact info or redirect payments outside Fiverr." },
    { word: ".com", level: "medium", category: "External Link", reason: "Domain mentions may indicate sharing of external websites for contact or portfolio, which can violate TOS." },
    { word: ".net", level: "medium", category: "External Link", reason: "External domain references may signal off-platform communication or portfolio links." },
    { word: ".org", level: "medium", category: "External Link", reason: "External domain references may be used to redirect users away from the platform." },
    { word: "www.", level: "medium", category: "External Link", reason: "Website references can indicate an attempt to move communication or payment off Fiverr." },
    { word: "portfolio link", level: "medium", category: "External Link", reason: "While portfolios are acceptable, sharing links may redirect clients off-platform." },
    { word: "check my website", level: "medium", category: "External Link", reason: "Directing clients to external websites can violate Fiverr's communication policies." },

    // Meeting / Calls
    { word: "book a call", level: "medium", category: "External Meeting", reason: "Booking calls outside Fiverr's system removes the protection of on-platform records." },
    { word: "jump on a call", level: "medium", category: "External Meeting", reason: "External calls are not monitored by Fiverr and remove dispute resolution coverage." },
    { word: "quick call", level: "medium", category: "External Meeting", reason: "Suggesting calls outside platform channels can violate communication guidelines." },
    { word: "video call", level: "medium", category: "External Meeting", reason: "Video calls arranged off Fiverr remove transaction transparency and dispute protection." },
    { word: "voice call", level: "medium", category: "External Meeting", reason: "Unmonitored voice calls bypass Fiverr's dispute resolution and TOS guidelines." },
    { word: "meeting link", level: "medium", category: "External Meeting", reason: "Sharing meeting links may indicate off-platform coordination, which can violate TOS." },
    { word: "calendar link", level: "medium", category: "External Meeting", reason: "Calendar scheduling tools can be used to arrange off-platform meetings or calls." },

    // Sensitive info
    { word: "send otp", level: "high", category: "Sensitive Information", reason: "Requesting OTPs is a major red flag for account takeover scams — never share verification codes." },
    { word: "verification code", level: "high", category: "Sensitive Information", reason: "Asking for verification codes is a clear sign of phishing or account hijacking." },
    { word: "credit card", level: "high", category: "Sensitive Information", reason: "Requesting credit card details is a scam vector — Fiverr never asks for card info via chat." },
    { word: "debit card", level: "high", category: "Sensitive Information", reason: "Sharing debit card info outside secure payment systems risks financial fraud." },
    { word: "cvv", level: "high", category: "Sensitive Information", reason: "CVV codes are highly sensitive — requesting them is a serious financial fraud risk." },
    { word: "pin code", level: "high", category: "Sensitive Information", reason: "PIN codes should never be shared; this is a critical phishing and fraud signal." },
    { word: "bank details", level: "high", category: "Sensitive Information", reason: "Sharing banking information outside secure systems is a severe fraud risk." },

    // Scam / fraud
    { word: "guaranteed profit", level: "high", category: "Scam Indicator", reason: "No legitimate investment or service guarantees profit — this is a classic scam tactic." },
    { word: "double your money", level: "high", category: "Scam Indicator", reason: "Promises to double money are hallmarks of financial scams and Ponzi schemes." },
    { word: "investment plan", level: "high", category: "Scam Indicator", reason: "Investment solicitations on Fiverr are prohibited and commonly associated with fraud." },
    { word: "earn fast money", level: "high", category: "Scam Indicator", reason: "Get-rich-quick language is a major red flag for scams and violates Fiverr's policies." },

    // Review manipulation
    { word: "review", level: "high", category: "Review Manipulation", reason: "Mentioning reviews in messages can indicate manipulation attempts, which are strictly prohibited." },
    { word: "positive review", level: "high", category: "Review Manipulation", reason: "Soliciting positive reviews violates Fiverr's review integrity policy." },
    { word: "5 star review", level: "high", category: "Review Manipulation", reason: "Requesting 5-star reviews is a direct TOS violation and can result in account suspension." },
    { word: "exchange review", level: "high", category: "Review Manipulation", reason: "Review exchanges are explicitly banned as they undermine platform trust." },
    { word: "review in return", level: "high", category: "Review Manipulation", reason: "Offering services or perks in exchange for reviews is prohibited and can get you banned." },
    { word: "feedback", level: "high", category: "Review Manipulation", reason: "Soliciting specific feedback can cross into review manipulation, which violates TOS." },

    // Off-platform work
    { word: "work outside fiverr", level: "high", category: "Off-Platform Work", reason: "Soliciting work outside Fiverr is a direct TOS violation and can result in permanent ban." },
    { word: "long term outside", level: "high", category: "Off-Platform Work", reason: "Arranging ongoing work outside Fiverr bypasses platform fees and violates TOS." },
    { word: "hire directly", level: "high", category: "Off-Platform Work", reason: "Direct hiring outside Fiverr is prohibited and removes buyer/seller protections." },
    { word: "deal outside", level: "high", category: "Off-Platform Work", reason: "Off-platform deals violate Fiverr's Terms of Service and void all protections." },

    // Low risk
    { word: "chat", level: "low", category: "Communication Signal", reason: "Casual communication references — low risk but worth monitoring for off-platform intent." },
    { word: "talk", level: "low", category: "Communication Signal", reason: "Vague communication language — usually harmless but may precede off-platform requests." },
    { word: "reach", level: "low", category: "Communication Signal", reason: "Could indicate intent to contact outside platform — context-dependent risk." }
];

// Sort longest first
restrictedWords.sort((a, b) => b.word.length - a.word.length);

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function checkText() {
    const text = document.getElementById("inputText").value;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    document.getElementById("charCount").textContent = text.length + ' chars';
    document.getElementById("wordCount").textContent = (text.trim() ? words : 0) + ' words';

    const found = [];
    const foundWords = new Set();

    restrictedWords.forEach(item => {
        const escaped = item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, "gi");
        if (regex.test(text) && !foundWords.has(item.word.toLowerCase())) {
            foundWords.add(item.word.toLowerCase());
            found.push(item);
        }
    });

    const highCount = found.filter(f => f.level === 'high').length;
    const medCount = found.filter(f => f.level === 'medium').length;
    const lowCount = found.filter(f => f.level === 'low').length;

    document.getElementById("highCount").textContent = highCount;
    document.getElementById("mediumCount").textContent = medCount;
    document.getElementById("lowCount").textContent = lowCount;
    document.getElementById("totalCount").textContent = found.length + ' found';

    // Pill active state
    document.getElementById("pillHigh").classList.toggle("active", highCount > 0);
    document.getElementById("pillMed").classList.toggle("active", medCount > 0);
    document.getElementById("pillLow").classList.toggle("active", lowCount > 0);

    // Risk meter
    const score = Math.min(100, highCount * 25 + medCount * 10 + lowCount * 5);
    const fill = document.getElementById("meterFill");
    const label = document.getElementById("riskLabel");
    fill.style.width = score + '%';

    if (score === 0) {
        fill.style.background = 'var(--muted)';
        label.textContent = text.length > 0 ? 'Safe ✓' : '—';
        label.style.color = text.length > 0 ? 'var(--safe)' : 'var(--muted)';
    } else if (score < 30) {
        fill.style.background = 'var(--low)';
        label.textContent = 'Low Risk';
        label.style.color = 'var(--low)';
    } else if (score < 60) {
        fill.style.background = 'var(--medium)';
        label.textContent = 'Medium Risk';
        label.style.color = 'var(--medium)';
    } else {
        fill.style.background = 'var(--high)';
        label.textContent = 'High Risk';
        label.style.color = 'var(--high)';
    }

    // Issues list
    const issuesList = document.getElementById("issuesList");
    if (found.length === 0) {
        issuesList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${text.length > 0 ? '✅' : '🔍'}</div>
        <p>${text.length > 0 ? 'Message looks safe!<br>No violations found.' : 'No issues detected.<br>Start typing to scan.'}</p>
      </div>`;
    } else {
        issuesList.innerHTML = found.map(item => `
      <div class="issue-card ${item.level}">
        <div class="issue-top">
          <span class="issue-dot"></span>
          <span class="issue-keyword">"${item.word}"</span>
          <span class="issue-badge">${item.level}</span>
        </div>
        <div class="flag-notice">
          <span class="flag-icon">⚑</span>
          <span>${item.reason}</span>
        </div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--muted);margin-top:6px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.05);text-transform:uppercase;letter-spacing:0.5px;">
          Category: ${item.category}
        </div>
      </div>
    `).join('');
    }

    // Highlighted preview
    const outputText = document.getElementById("outputText");
    if (!text) { outputText.innerHTML = ''; return; }

    let html = escapeHtml(text);
    const sortedFound = [...found].sort((a, b) => b.word.length - a.word.length);

    sortedFound.forEach(item => {
        const escaped = item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b(${escaped})\\b`, "gi");
        const levelClass = item.level === 'high' ? 'h-high' : item.level === 'medium' ? 'h-medium' : 'h-low';
        // Tooltip colors
        const dotColor = item.level === 'high' ? 'var(--high)' : item.level === 'medium' ? 'var(--medium)' : 'var(--low)';
        const badgeBg = item.level === 'high' ? 'var(--high)' : item.level === 'medium' ? 'var(--medium)' : 'var(--low)';
        const badgeFg = item.level === 'high' ? '#fff' : '#000';
        const tooltip = `
      <span class="tooltip">
        <div class="tt-header">
          <div class="tt-dot" style="background:${dotColor};box-shadow:0 0 6px ${dotColor};"></div>
          <span class="tt-word" style="color:${dotColor};">${item.word}</span>
          <span class="tt-badge" style="background:${badgeBg};color:${badgeFg};">${item.level}</span>
        </div>
        <div class="tt-reason">${item.reason}</div>
        <div class="tt-category">⊡ ${item.category}</div>
      </span>`;
        html = html.replace(regex, `<span class="tooltip-wrap"><span class="${levelClass}">$1</span>${tooltip}</span>`);
    });

    outputText.innerHTML = html.replace(/\n/g, '<br>');
}

function copyMessage() {
    const text = document.getElementById("inputText").value;
    if (!text.trim()) return;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById("copyBtn");
        btn.textContent = '✓ Copied';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = '⎘ Copy';
            btn.classList.remove('copied');
        }, 2000);
    });
}

function clearAll() {
    document.getElementById("inputText").value = '';
    checkText();
}