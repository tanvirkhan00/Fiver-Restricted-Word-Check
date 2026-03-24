const restrictedWords = [
    { word: "whatsapp", level: "high" },
    { word: "telegram", level: "high" },
    { word: "account", level: "high" },
    { word: "skype", level: "high" },
    { word: "discord", level: "high" },
    { word: "signal", level: "high" },
    { word: "wechat", level: "high" },
    { word: "line app", level: "high" },
    { word: "gmail", level: "high" },
    { word: "yahoo mail", level: "high" },
    { word: "outlook mail", level: "high" },
    { word: "email", level: "high" },
    { word: "phone number", level: "high" },
    { word: "phone", level: "low" },
    { word: "mobile number", level: "high" },
    { word: "call me", level: "high" },
    { word: "text me", level: "high" },
    { word: "message me on", level: "high" },
    { word: "discuss outside", level: "high" },
    { word: "reach me on", level: "high" },
    { word: "contact me outside", level: "high" },
    { word: "contact", level: "high" },
    { word: "outside fiverr", level: "high" },
    { word: "off platform", level: "high" },
    { word: "dm me outside", level: "high" },
    { word: "pay me directly", level: "high" },
    { word: "direct payment", level: "high" },
    { word: "bank transfer", level: "high" },
    { word: "wire transfer", level: "high" },
    { word: "western union", level: "high" },
    { word: "moneygram", level: "high" },
    { word: "send money directly", level: "high" },
    { word: "avoid fiverr fee", level: "high" },
    { word: "payment outside fiverr", level: "high" },
    { word: "paypal", level: "high" },
    { word: "payoneer", level: "high" },
    { word: "skrill", level: "high" },
    { word: "crypto", level: "high" },
    { word: "bitcoin", level: "high" },
    { word: "usdt", level: "high" },
    { word: "visit my website", level: "high" },
    { word: "check my website", level: "high" },
    { word: "portfolio website", level: "high" },
    { word: "go to this link", level: "high" },
    { word: "external link", level: "high" },
    { word: "download from here", level: "high" },
    { word: "zoom call", level: "medium" },
    { word: "zoom", level: "medium" },
    { word: "google meet", level: "medium" },
    { word: "schedule a call", level: "medium" },
    { word: "book a call", level: "medium" },
    { word: "join a call", level: "medium" },
    { word: "send your email", level: "medium" },
    { word: "share your number", level: "medium" },
    { word: "payment", level: "medium" },
    { word: "message", level: "low" },
    { word: "reach me", level: "low" },
];

// Sort longest first so multi-word phrases match before single words
restrictedWords.sort((a, b) => b.word.length - a.word.length);

function checkText() {
    const text = document.getElementById("inputText").value;
    document.getElementById("charCount").textContent = text.length + ' chars';

    const issuesList = document.getElementById("issuesList");
    const outputText = document.getElementById("outputText");

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

    // Update counts
    const highCount = found.filter(f => f.level === 'high').length;
    const mediumCount = found.filter(f => f.level === 'medium').length;
    const lowCount = found.filter(f => f.level === 'low').length;

    document.getElementById("highCount").textContent = highCount;
    document.getElementById("mediumCount").textContent = mediumCount;
    document.getElementById("lowCount").textContent = lowCount;
    document.getElementById("totalCount").textContent = found.length + ' found';

    // Risk meter
    const score = Math.min(100, highCount * 25 + mediumCount * 10 + lowCount * 5);
    const fill = document.getElementById("meterFill");
    const riskLabel = document.getElementById("riskScore");
    fill.style.width = score + '%';

    if (score === 0) {
        fill.style.background = 'var(--muted)';
        riskLabel.textContent = '—';
        riskLabel.style.color = 'var(--muted)';
    } else if (score < 30) {
        fill.style.background = 'var(--low)';
        riskLabel.textContent = 'Low Risk';
        riskLabel.style.color = 'var(--low)';
    } else if (score < 60) {
        fill.style.background = 'var(--medium)';
        riskLabel.textContent = 'Medium Risk';
        riskLabel.style.color = 'var(--medium)';
    } else {
        fill.style.background = 'var(--high)';
        riskLabel.textContent = 'High Risk';
        riskLabel.style.color = 'var(--high)';
    }

    // Issues list
    if (found.length === 0) {
        issuesList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${text.length > 0 ? '✅' : '🔍'}</div>
        <p>${text.length > 0 ? 'Message looks safe!' : 'No issues detected yet.<br>Start typing to scan.'}</p>
      </div>`;
    } else {
        issuesList.innerHTML = found.map(item => `
      <div class="issue-item ${item.level}">
        <span class="issue-dot"></span>
        <span class="issue-word">${item.word}</span>
        <span class="issue-badge">${item.level}</span>
      </div>
    `).join('');
    }

    // Highlighted preview
    if (!text) { outputText.innerHTML = ''; return; }

    let html = escapeHtml(text);
    const sortedFound = [...found].sort((a, b) => b.word.length - a.word.length);

    sortedFound.forEach(item => {
        const escaped = item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b(${escaped})\\b`, "gi");
        html = html.replace(regex, `<mark class="${item.level}-mark">$1</mark>`);
    });

    outputText.innerHTML = html.replace(/\n/g, '<br>');
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function clearAll() {
    document.getElementById("inputText").value = '';
    checkText();
}