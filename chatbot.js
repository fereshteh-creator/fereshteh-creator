document.addEventListener("DOMContentLoaded", () => {
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbotPanel = document.getElementById("chatbot-panel");
  const chatbotForm = document.getElementById("chatbot-form");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");

  chatbotToggle?.addEventListener("click", () => {
    chatbotPanel.classList.toggle("hidden");
  });

  chatbotForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userInput = chatbotInput.value.trim();
    if (!userInput) return;

    appendMessage("user", userInput);
    chatbotInput.value = "";

    appendMessage("bot", "Typing...");

    const reply = await getGPTResponse(userInput);

    // Remove "Typing..." placeholder
    chatbotMessages.lastChild.remove();

    appendMessage("bot", reply);
  });

  function appendMessage(sender, text) {
    const div = document.createElement("div");
    div.className = sender;
    div.textContent = text;
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  async function getGPTResponse(message) {
    const res = await fetch(
      "https://magnificent-shortbread-339638.netlify.app/.netlify/functions/fereshbot",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }
    );

    const data = await res.json();
    return data.reply || "Hmm, I didn’t get that.";
  }
});
