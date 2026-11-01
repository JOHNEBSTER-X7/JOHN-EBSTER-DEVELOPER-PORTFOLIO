let conversationId = null;
const messages = document.querySelector("#messages");
const chatForm = document.querySelector("#chat-form");
const input = document.querySelector("#message");
const send = document.querySelector("#send");
const escalation = document.querySelector("#escalation");

function addBubble(role, content, sources = []) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${role}`;
  if (role === "assistant") {
    const label = document.createElement("span");
    label.className = "bubble-label";
    label.textContent = "NORTHSTAR ASSISTANT";
    bubble.append(label);
  }
  const text = document.createElement("span");
  text.textContent = content;
  bubble.append(text);
  if (sources.length) {
    const sourceLine = document.createElement("div");
    sourceLine.className = "sources";
    sourceLine.textContent = "Sources: " + sources.map(source => source.title).join(" · ");
    bubble.append(sourceLine);
  }
  messages.append(bubble);
  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage(message) {
  addBubble("user", message);
  send.disabled = true;
  send.textContent = "…";
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, message })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to send message.");
    conversationId = data.conversationId;
    addBubble("assistant", data.answer, data.sources);
    if (data.escalationSuggested) escalation.classList.remove("hidden");
  } catch (error) {
    addBubble("assistant", error instanceof Error ? error.message : "Something went wrong. Please try again.");
  } finally {
    send.disabled = false;
    send.innerHTML = 'Send <span>→</span>';
  }
}

chatForm.addEventListener("submit", async event => {
  event.preventDefault();
  const message = input.value.trim();
  if (message.length < 2) return;
  input.value = "";
  await sendMessage(message);
});

document.querySelectorAll("[data-question]").forEach(button => {
  button.addEventListener("click", () => sendMessage(button.dataset.question));
});

document.querySelector("#new-chat").addEventListener("click", () => {
  conversationId = null;
  messages.replaceChildren();
  addBubble("assistant", "A fresh conversation is ready. What can I help you with?");
  escalation.classList.add("hidden");
});

document.querySelector("#escalation-form").addEventListener("submit", async event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const result = document.querySelector("#escalation-result");
  if (!conversationId) {
    result.textContent = "Please start a chat before submitting an escalation.";
    return;
  }
  try {
    const response = await fetch("/api/escalations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, email: form.get("email"), summary: form.get("summary") })
    });
    const data = await response.json();
    result.textContent = response.ok ? `Demo ticket ${data.ticket.id} recorded. No email has been sent.` : (data.error || "Unable to record request.");
  } catch {
    result.textContent = "Unable to record request. Please try again.";
  }
});
