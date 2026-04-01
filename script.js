const restrictedWords = [
    // --- OFF-PLATFORM COMMUNICATION (HIGH) ---
    { word: "whatsapp", level: "high" },
    { word: "telegram", level: "high" },
    { word: "skype", level: "high" },
    { word: "discord", level: "high" },
    { word: "signal", level: "high" },
    { word: "wechat", level: "high" },
    { word: "line app", level: "high" },
    { word: "messenger", level: "high" },
    { word: "facebook", level: "high" },
    { word: "instagram", level: "high" },
    { word: "gmail", level: "high" },
    { word: "yahoo", level: "high" },
    { word: "outlook", level: "high" },
    { word: "email", level: "high" },
    { word: "phone number", level: "high" },
    { word: "mobile number", level: "high" },
    { word: "contact me outside", level: "high" },
    { word: "outside fiverr", level: "high" },
    { word: "off platform", level: "high" },

    // --- DIRECT PAYMENTS (HIGH) ---
    { word: "pay me directly", level: "high" },
    { word: "direct payment", level: "high" },
    { word: "bank transfer", level: "high" },
    { word: "wire transfer", level: "high" },
    { word: "paypal", level: "high" },
    { word: "payoneer", level: "high" },
    { word: "crypto", level: "high" },
    { word: "bitcoin", level: "high" },
    { word: "usdt", level: "high" },
    { word: "avoid fiverr fee", level: "high" },

    // --- ACADEMIC & FEEDBACK FRAUD (HIGH) ---
    { word: "homework", level: "high" },
    { word: "assignment", level: "high" },
    { word: "exam", level: "high" },
    { word: "academic", level: "high" },
    { word: "review", level: "high" },
    { word: "feedback", level: "high" },
    { word: "5 stars", level: "high" },

    // --- MEETINGS & LINKS (MEDIUM) ---
    { word: "zoom", level: "medium" },
    { word: "google meet", level: "medium" },
    { word: "schedule a call", level: "medium" },
    { word: "external link", level: "medium" },
    { word: "visit my website", level: "medium" },
    { word: "account", level: "medium" },
    { word: "password", level: "medium" },

    // --- GENERAL KEYWORDS (LOW) ---
    { word: "phone", level: "low" },
    { word: "message", level: "low" },
    { word: "contact", level: "low" },
    { word: "payment", level: "low" }
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