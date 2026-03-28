// ============================================================
//  script.js  –  NexBot frontend logic
//  Handles: sending messages, rendering bubbles, typing anim,
//           auto-scroll, mobile sidebar, quick-topic chips.
// ============================================================

// ── DOM references ──────────────────────────────────────────
const messagesEl  = document.getElementById("messages");
const userInput   = document.getElementById("userInput");
const sendBtn     = document.getElementById("sendBtn");
const newChatBtn  = document.getElementById("newChatBtn");
const welcomeEl   = document.getElementById("welcome");
const statusDot   = document.getElementById("statusDot");
const statusText  = document.getElementById("statusText");
const modelTag    = document.getElementById("modelTag");
const sidebar     = document.getElementById("sidebar");
const hamburger   = document.getElementById("hamburger");
const overlay     = document.getElementById("overlay");
const modeIndicator = document.getElementById("modeIndicator");

// ── App state ───────────────────────────────────────────────
let chatHistory = [];   // [{ role: "user"|"assistant", content: "…" }]
let isThinking  = false;

// ── Helpers ─────────────────────────────────────────────────

/** Returns a formatted HH:MM AM/PM timestamp */
function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Escape HTML special chars to prevent injection */
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Very light markdown: **bold**, `code`, newlines → <br> */
function simpleMarkdown(text) {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g,   "<code>$1</code>")
    .replace(/\n/g,           "<br>");
}

/** Smoothly scroll the messages container to the bottom */
function scrollToBottom() {
  messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: "smooth" });
}

// ── Message rendering ────────────────────────────────────────

/**
 * Append a message bubble to the chat.
 * @param {"user"|"bot"} role
 * @param {string} text
 */
function appendMessage(role, text) {
  // Hide welcome screen on first message
  if (welcomeEl) welcomeEl.style.display = "none";

  const row = document.createElement("div");
  row.className = `message-row ${role}`;

  const avatarEl = document.createElement("div");
  avatarEl.className = `avatar ${role === "bot" ? "bot-av" : "user-av"}`;
  avatarEl.textContent = role === "bot" ? "N" : "You";

  const bubbleWrap = document.createElement("div");
  bubbleWrap.className = "bubble-wrap";

  const bubble = document.createElement("div");
  bubble.className = `bubble ${role === "bot" ? "bot-bubble" : "user-bubble"}`;
  bubble.innerHTML = simpleMarkdown(text);

  const ts = document.createElement("span");
  ts.className = "timestamp";
  ts.textContent = nowTime();

  bubbleWrap.appendChild(bubble);
  bubbleWrap.appendChild(ts);

  if (role === "bot") {
    row.appendChild(avatarEl);
    row.appendChild(bubbleWrap);
  } else {
    row.appendChild(bubbleWrap);
    row.appendChild(avatarEl);
  }

  messagesEl.appendChild(row);
  scrollToBottom();
}

/** Show the animated "bot is typing…" indicator, return its element */
function showTyping() {
  const row = document.createElement("div");
  row.className = "message-row bot";
  row.id = "typingRow";

  const avatarEl = document.createElement("div");
  avatarEl.className = "avatar bot-av";
  avatarEl.textContent = "N";

  const wrap = document.createElement("div");
  wrap.className = "bubble-wrap";

  const indicator = document.createElement("div");
  indicator.className = "typing-indicator";
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.className = "typing-dot";
    indicator.appendChild(dot);
  }

  wrap.appendChild(indicator);
  row.appendChild(avatarEl);
  row.appendChild(wrap);
  messagesEl.appendChild(row);
  scrollToBottom();
  return row;
}

/** Remove the typing indicator */
function removeTyping() {
  const el = document.getElementById("typingRow");
  if (el) el.remove();
}

// ── API call ─────────────────────────────────────────────────

/**
 * Send the user message to the Flask backend and render the reply.
 */
async function sendMessage(text) {
  if (!text.trim() || isThinking) return;

  isThinking = true;
  sendBtn.disabled = true;

  // Render user bubble
  appendMessage("user", text);

  // Update history (for context)
  chatHistory.push({ role: "user", content: text });

  // Show typing indicator
  const typingEl = showTyping();
  await new Promise(resolve => setTimeout(resolve, 1500));

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history: chatHistory }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    removeTyping();

    if (data.status === "ok") {
      appendMessage("bot", data.response);
      chatHistory.push({ role: "assistant", content: data.response });
    } else {
      appendMessage("bot", "⚠️ Something went wrong. Please try again.");
    }

  } catch (err) {
    removeTyping();
    console.error("[NexBot] Fetch error:", err);
    appendMessage("bot", "⚠️ Could not reach the server. Make sure Flask is running on port 5000.");
  } finally {
    isThinking = false;
    sendBtn.disabled = false;
    userInput.focus();
  }
}

// ── Auto-resize textarea ──────────────────────────────────────
userInput.addEventListener("input", () => {
  userInput.style.height = "auto";
  userInput.style.height = Math.min(userInput.scrollHeight, 140) + "px";
});

// ── Send on Enter (Shift+Enter = new line) ────────────────────
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const msg = userInput.value.trim();
    if (msg) {
      userInput.value = "";
      userInput.style.height = "auto";
      sendMessage(msg);
    }
  }
});

// ── Send button click ─────────────────────────────────────────
sendBtn.addEventListener("click", () => {
  const msg = userInput.value.trim();
  if (msg) {
    userInput.value = "";
    userInput.style.height = "auto";
    sendMessage(msg);
  }
});

// ── New chat ──────────────────────────────────────────────────
newChatBtn.addEventListener("click", () => {
  // Remove all message rows
  const rows = messagesEl.querySelectorAll(".message-row");
  rows.forEach(r => r.remove());
  // Show welcome screen again
  if (welcomeEl) welcomeEl.style.display = "flex";
  chatHistory = [];
  userInput.value = "";
  userInput.style.height = "auto";
  closeSidebar();
  userInput.focus();
});

// ── Quick topic chips ─────────────────────────────────────────
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const msg = chip.dataset.msg;
    if (msg) {
      closeSidebar();
      sendMessage(msg);
    }
  });
});

// ── Welcome cards ─────────────────────────────────────────────
document.querySelectorAll(".wcard").forEach(card => {
  card.addEventListener("click", () => {
    const msg = card.dataset.msg;
    if (msg) sendMessage(msg);
  });
});

// ── Mobile sidebar ────────────────────────────────────────────
function openSidebar()  { sidebar.classList.add("open"); overlay.classList.add("active"); }
function closeSidebar() { sidebar.classList.remove("open"); overlay.classList.remove("active"); }

hamburger.addEventListener("click", () => {
  sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
});
overlay.addEventListener("click", closeSidebar);

// ── Status check ─────────────────────────────────────────────
async function checkStatus() {
  try {
    const res  = await fetch("/api/status");
    const data = await res.json();

    statusDot.className  = "status-dot online";
    statusText.textContent = "Online";
    modelTag.textContent = data.mode || "Rule-based";
    modeIndicator.textContent = data.mode?.includes("Anthropic")
      ? "🤖 AI Powered"
      : "⚡ Rule-based";

  } catch {
    statusDot.className   = "status-dot error";
    statusText.textContent = "Offline";
    modelTag.textContent  = "—";
  }
}

// ── Init ──────────────────────────────────────────────────────
checkStatus();
userInput.focus();
