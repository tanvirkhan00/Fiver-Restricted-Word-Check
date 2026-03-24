const restrictedWords = [

  // 🔴 HIGH RISK – Outside Contact
  { word: "whatsapp", level: "high" },
  { word: "telegram", level: "high" },
  { word: "skype", level: "high" },
  { word: "discord", level: "high" },
  { word: "signal", level: "high" },
  { word: "wechat", level: "high" },
  { word: "line app", level: "high" },

  { word: "email", level: "high" },
  { word: "gmail", level: "high" },
  { word: "yahoo mail", level: "high" },
  { word: "outlook mail", level: "high" },

  { word: "phone", level: "high" },
  { word: "phone number", level: "high" },
  { word: "contact", level: "high" },
  { word: "mobile number", level: "high" },

  { word: "call me", level: "high" },
  { word: "text me", level: "high" },
  { word: "message me on", level: "high" },
  { word: "reach me on", level: "high" },
  { word: "contact me outside", level: "high" },
  { word: "outside fiverr", level: "high" },
  { word: "off platform", level: "high" },
  { word: "dm me outside", level: "high" },

  // 🔴 HIGH RISK – Payment Bypass
  { word: "pay me directly", level: "high" },
  { word: "direct payment", level: "high" },
  { word: "bank transfer", level: "high" },
  { word: "wire transfer", level: "high" },
  { word: "western union", level: "high" },
  { word: "moneygram", level: "high" },
  { word: "send money directly", level: "high" },
  { word: "avoid fiverr fee", level: "high" },
  { word: "payment outside fiverr", level: "high" },
  { word: "payment", level: "high" },

  { word: "paypal", level: "high" },
  { word: "payoneer", level: "high" },
  { word: "skrill", level: "high" },

  { word: "crypto", level: "high" },
  { word: "bitcoin", level: "high" },
  { word: "usdt", level: "high" },

  // 🔴 HIGH RISK – External Redirection
  { word: "visit my website", level: "high" },
  { word: "check my website", level: "high" },
  { word: "portfolio website", level: "high" },
  { word: "go to this link", level: "high" },
  { word: "external link", level: "high" },
  { word: "download from here", level: "high" },

  // 🟡 MEDIUM RISK – Meetings & Indirect Contact
  { word: "zoom", level: "medium" },
  { word: "zoom call", level: "medium" },
  { word: "google meet", level: "medium" },
  { word: "schedule a call", level: "medium" },
  { word: "book a call", level: "medium" },
  { word: "join a call", level: "medium" },

  { word: "send your email", level: "medium" },
  { word: "share your number", level: "medium" },
  { word: "discuss outside", level: "medium" },

  // 🟢 LOW RISK – Generic (context-based)
  { word: "contact", level: "low" },
  { word: "message", level: "low" },
  { word: "reach me", level: "low" },
];

function checkText() {
  let text = document.getElementById("inputText").value;
  let output = document.getElementById("outputText");
  let list = document.getElementById("detectedList");

  list.innerHTML = "";
  let highlightedText = text;

  restrictedWords.forEach(item => {
    let regex = new RegExp(item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");

    if (regex.test(text)) {

      // Add to list
      let li = document.createElement("li");
      li.innerText = `${item.word} (${item.level})`;
      li.classList.add(item.level);
      list.appendChild(li);

      // Highlight text
      highlightedText = highlightedText.replace(regex, match => {
        return `<span class="${item.level}">${match}</span>`;
      });
    }
  });

  output.innerHTML = highlightedText;
}