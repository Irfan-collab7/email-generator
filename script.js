
document.getElementById("themeSwitch").addEventListener("change", () => {
  document.body.classList.toggle("dark");
});


document.getElementById("generateBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value.trim().toLowerCase();
  const outputBox = document.getElementById("outputBox");
  const emailOutput = document.getElementById("emailOutput");

  if (!prompt) {
    emailOutput.value = "⚠️ Please enter a topic!";
    outputBox.classList.add("show");
    return;
  }

  emailOutput.value = "⏳ Fetching email template...";
  outputBox.classList.add("show");

  try {
    const res = await fetch("https://raw.githubusercontent.com/amey-collab/email-templates/refs/heads/main/emails.json");
    const data = await res.json();

    const cleanPrompt = prompt.replace(/[^a-z\s]/gi, "");
    let found = null;

    for (let key in data) {
      if (cleanPrompt.includes(key.toLowerCase())) {
        found = data[key];
        break;
      }
    }

    if (found) {
      emailOutput.value = found;
    } else {
      emailOutput.value = "❌ No email template found for any word in your input.";
    }

  } catch (err) {
    emailOutput.value = "❌ Error fetching email templates.";
    console.error(err);
  }
});


function copyEmail() {
  const emailText = document.getElementById("emailOutput").value;
  navigator.clipboard.writeText(emailText)
    .then(() => alert("✅ Email copied to clipboard!"))
    .catch(() => alert("❌ Failed to copy email."));
}


function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const emailText = document.getElementById("emailOutput").value;

  const doc = new jsPDF();
  const lines = doc.splitTextToSize(emailText, 180);
  doc.text(lines, 15, 20);
  doc.save("generated_email.pdf");
}


const speakBtn = document.getElementById("speakBtn");
const promptInput = document.getElementById("prompt");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;

speakBtn.addEventListener("click", () => {
  promptInput.placeholder = "🎤 Listening...";
  recognition.start();
});

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  promptInput.value = transcript;
  promptInput.placeholder = "e.g. Request for internship, leave application...";
};

recognition.onerror = (event) => {
  alert("🎤 Speech recognition error: " + event.error);
  promptInput.placeholder = "e.g. Request for internship, leave application...";
};
