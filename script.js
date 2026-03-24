const restrictedWords = [
  "whatsapp",
  "telegram",
  "skype",
  "email",
  "gmail",
  "phone",
  "phone number",
  "outside fiverr",
  "contact me outside",
  "zoom",
  "bank transfer",
  "pay me directly"
];

function checkText() {
  let text = document.getElementById("inputText").value;
  let detectedList = document.getElementById("detectedList");
  let output = document.getElementById("outputText");

  detectedList.innerHTML = "";

  let foundWords = [];

  // Highlight words
  let highlightedText = text;

  restrictedWords.forEach(word => {
    let regex = new RegExp(`\\b${word}\\b`, "gi");

    if (regex.test(text)) {
      foundWords.push(word);

      highlightedText = highlightedText.replace(regex, match => {
        return `<span class="highlight">${match}</span>`;
      });
    }
  });

  // Show detected words list
  foundWords.forEach(word => {
    let li = document.createElement("li");
    li.innerText = word;
    detectedList.appendChild(li);
  });

  output.innerHTML = highlightedText;
}