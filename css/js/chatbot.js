(function () {
  const KNOWLEDGE_BASE = [
    {
      id: "bio",
      keywords: ["who is youssef", "who are you", "tell me about yourself", "bio", "about youssef", "introduce", "introduction", "student"],
      response: "<strong>Youssef</strong> is a senior at <strong>Kean University</strong> majoring in <strong>Information Technology</strong>. His primary focus right now is to excel in his coursework and graduate as soon as possible! Outside classes, he loves music, playing guitar for over 6 years, solo traveling, and digital photography."
    },
    {
      id: "education",
      keywords: ["school", "university", "kean", "college", "degree", "major", "program", "senior", "academic", "graduate", "graduation"],
      response: "Youssef is currently a <strong>Senior</strong> studying <strong>Information Technology (B.S.) at Kean University</strong>. His main academic and personal goal is to finish his degree and graduate as soon as possible to begin his professional IT career."
    },
    {
      id: "hobbies",
      keywords: ["hobby", "hobbies", "interests", "free time", "fun", "activities", "what do you do"],
      response: "Youssef's key hobbies and creative passions include:<br>• 🎸 <strong>Playing Guitar:</strong> 6+ years experience on acoustic & electric.<br>• ✈️ <strong>Solo Travel:</strong> Exploring new destinations & meeting new people.<br>• 📷 <strong>Photography:</strong> Digital photography capturing landscapes and candid moments.<br>• 🗣️ <strong>Languages:</strong> Learning new languages (speaks ~4 languages)."
    },
    {
      id: "guitar",
      keywords: ["guitar", "instrument", "instruments", "music", "song", "play"],
      response: "Youssef has been a dedicated <strong>guitar player for over 6 years</strong>! He plays both acoustic and electric guitars and loves exploring diverse musical styles and instruments."
    },
    {
      id: "travel",
      keywords: ["travel", "traveling", "solo travel", "destinations", "trip", "trips", "explore"],
      response: "Youssef is deeply passionate about <strong>solo traveling</strong>! He loves venturing to new destinations, stepping outside his comfort zone, and connecting with people from diverse cultures."
    },
    {
      id: "photography",
      keywords: ["photo", "photography", "camera", "pictures", "photos", "landscape"],
      response: "Youssef is heavily into <strong>digital photography</strong>. He enjoys capturing candid moments, cityscapes, and scenic landscapes, especially while traveling to new places."
    },
    {
      id: "languages",
      keywords: ["language", "languages", "speak", "multilingual", "polyglot"],
      response: "Youssef loves learning languages and currently speaks approximately <strong>4 languages</strong>! This polyglot background helps him communicate seamlessly while solo traveling and collaborate within diverse IT teams."
    },
    {
      id: "tech_often",
      keywords: ["technology do you use", "tech used", "most often", "daily tech", "devices", "computer", "laptop", "workstation", "cloud"],
      response: "The technology Youssef uses most frequently includes:<br>• 💻 <strong>Workstations & Laptops</strong> (macOS & Windows for coursework and media)<br>• 📱 <strong>Mobile Devices</strong> (for navigation, communication, and travel logistics)<br>• ☁️ <strong>Cloud Storage</strong> (Google Drive & iCloud for backing up photography, music, and academic assignments)."
    },
    {
      id: "tech_skill",
      keywords: ["skill would you like to improve", "improve", "skills to improve", "learn more", "scripting", "python", "bash"],
      response: "The technology skill Youssef wants to improve most is <strong>administrative scripting and automated infrastructure alert triaging</strong>. He wants to master scripting (Python, Bash/PowerShell) to automate routine IT tasks, inspect logs, and handle system alerts efficiently."
    },
    {
      id: "career",
      keywords: ["career", "job", "future", "profession", "sysadmin", "systems administrator", "infrastructure", "support engineer"],
      response: "Youssef is interested in a career in <strong>IT Systems Administration / Infrastructure Operations & Technical Support Engineering</strong>. This involves configuring hardware/software, managing enterprise networks, provisioning access, and ensuring computing systems remain reliable."
    },
    {
      id: "why_it",
      keywords: ["why are you interested", "why it", "why systems", "motivation", "reason"],
      response: "Youssef is drawn to IT systems and infrastructure because it is <strong>practical, hands-on, and mission-critical</strong>. Reliable IT is vital for every organization. He enjoys diagnosing problems, restoring service, and it provides a direct pathway into the tech industry upon graduation."
    },
    {
      id: "cyber_meaning",
      keywords: ["what does cybersecurity mean", "cybersecurity mean to you", "definition of cybersecurity", "security mean"],
      response: "To Youssef, cybersecurity means <strong>the protection of individuals along with important and sensitive information</strong>. It is about establishing digital trust so people and companies can work and communicate without fear of stolen identities or intercepted private records."
    },
    {
      id: "cyber_importance",
      keywords: ["why is cybersecurity important", "why important", "importance of security", "business secrets", "confidential"],
      response: "Cybersecurity is critically important <strong>to protect assets, information, business secrets, and confidential paperwork</strong>. Without strong security measures, organizations risk massive financial disruption, theft of trade secrets, and exposure of confidential records."
    },
    {
      id: "habit_2fa",
      keywords: ["habit", "2fa", "two-factor", "mfa", "authentication", "cybersecurity habit", "password"],
      response: "Youssef's primary cybersecurity habit is practicing <strong>Two-Factor Authentication (2FA)</strong> across all his important academic, personal, and financial accounts. 2FA blocks unauthorized logins even if a password is compromised in a data leak. You can test the interactive 2FA widget on the <a href='cybersecurity.html'>Cybersecurity page</a>!"
    },
    {
      id: "cyber_topic",
      keywords: ["cybersecurity topic", "topic do you want to learn", "learn this semester", "triage", "triaging", "incident triage"],
      response: "While not planning to specialize as a dedicated security analyst, the security topic Youssef wants to learn this semester is <strong>security alert and incident triaging</strong>—learning how to rapidly evaluate, categorize, and prioritize incoming alerts to separate false alarms from critical threats."
    },
    {
      id: "pages",
      keywords: ["pages", "sections", "navigation", "website", "where can i find", "links", "menu"],
      response: "This website has 4 main sections:<br>• <a href='index.html'>Home</a>: Bio & Highlights<br>• <a href='about.html'>About Me</a>: Hobbies & Languages<br>• <a href='tech-interests.html'>Tech Interests</a>: Daily Tools & Career Goals<br>• <a href='cybersecurity.html'>Cybersecurity</a>: Course Reflection & 2FA Demo"
    },
    {
      id: "greetings",
      keywords: ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "howdy"],
      response: "Hello! I am **Youssef's Portfolio AI Assistant**. Ask me anything about Youssef, his IT studies at Kean University, hobbies like guitar & travel, tech interests, or his cybersecurity awareness!"
    },
    {
      id: "thanks",
      keywords: ["thank", "thanks", "awesome", "great", "cool", "appreciate"],
      response: "You're very welcome! Let me know if you'd like to learn more about Youssef's background, hobbies, or IT goals."
    }
  ];

  function initChatbot() {
    const launcher = document.createElement("button");
    launcher.className = "chat-launcher";
    launcher.setAttribute("aria-label", "Open AI Portfolio Assistant");
    launcher.innerHTML = `
      <span class="chat-launcher-icon">🤖</span>
      <span>Ask AI</span>
      <span class="chat-launcher-pulse"></span>
    `;
    document.body.appendChild(launcher);

    const chatWindow = document.createElement("div");
    chatWindow.className = "chat-window";
    chatWindow.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-header-avatar">Y</div>
          <div>
            <div class="chat-header-title">Youssef's AI Assistant</div>
            <div class="chat-header-status">Online &bull; Kean IT Assistant</div>
          </div>
        </div>
        <div class="chat-header-actions">
          <button class="chat-action-btn" id="chat-reset-btn" title="Reset chat">🔄</button>
          <button class="chat-action-btn" id="chat-close-btn" title="Close chat">✕</button>
        </div>
      </div>

      <div class="chat-suggestions">
        <button class="chat-chip" data-q="Who is Youssef?">Who is Youssef?</button>
        <button class="chat-chip" data-q="What are his hobbies?">Hobbies &amp; Guitar</button>
        <button class="chat-chip" data-q="What tech career interests him?">Career Interest</button>
        <button class="chat-chip" data-q="What is his cybersecurity habit?">2FA Habit</button>
        <button class="chat-chip" data-q="What languages does he speak?">Languages</button>
      </div>

      <div class="chat-messages" id="chat-messages-container">
        <div class="chat-msg chat-msg-bot">
          👋 Hi there! I'm Youssef's AI Assistant. Ask me anything about his IT degree at <strong>Kean University</strong>, his hobbies (like 6 years playing guitar), his daily tech stack, or his cybersecurity habits!
        </div>
      </div>

      <div class="chat-input-area">
        <input type="text" class="chat-input" id="chat-user-input" placeholder="Ask a question about Youssef..." autocomplete="off">
        <button class="chat-send-btn" id="chat-send-btn" aria-label="Send message">&#10148;</button>
      </div>
    `;
    document.body.appendChild(chatWindow);

    const closeBtn = document.getElementById("chat-close-btn");
    const resetBtn = document.getElementById("chat-reset-btn");
    const msgContainer = document.getElementById("chat-messages-container");
    const input = document.getElementById("chat-user-input");
    const sendBtn = document.getElementById("chat-send-btn");
    const chips = document.querySelectorAll(".chat-chip");

    launcher.addEventListener("click", () => {
      chatWindow.classList.toggle("active");
      if (chatWindow.classList.contains("active")) {
        input.focus();
      }
    });

    closeBtn.addEventListener("click", () => {
      chatWindow.classList.remove("active");
    });

    resetBtn.addEventListener("click", () => {
      msgContainer.innerHTML = `
        <div class="chat-msg chat-msg-bot">
          👋 Chat reset! How can I help you learn more about Youssef today?
        </div>
      `;
    });

    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        const q = chip.getAttribute("data-q");
        input.value = q;
        handleUserSend();
      });
    });

    sendBtn.addEventListener("click", handleUserSend);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleUserSend();
      }
    });

    function handleUserSend() {
      const text = input.value.trim();
      if (!text) return;

      appendMessage(text, "user");
      input.value = "";
      sendBtn.disabled = true;

      const typingEl = document.createElement("div");
      typingEl.className = "chat-typing";
      typingEl.innerHTML = `
        <div class="chat-typing-dot"></div>
        <div class="chat-typing-dot"></div>
        <div class="chat-typing-dot"></div>
      `;
      msgContainer.appendChild(typingEl);
      msgContainer.scrollTop = msgContainer.scrollHeight;

      setTimeout(() => {
        if (typingEl.parentNode) {
          typingEl.parentNode.removeChild(typingEl);
        }
        const botReply = generateAnswer(text);
        appendMessage(botReply, "bot");
        sendBtn.disabled = false;
        input.focus();
      }, 500);
    }

    function appendMessage(htmlContent, sender) {
      const msg = document.createElement("div");
      msg.className = sender === "user" ? "chat-msg chat-msg-user" : "chat-msg chat-msg-bot";
      msg.innerHTML = htmlContent;
      msgContainer.appendChild(msg);
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    function generateAnswer(query) {
      const clean = query.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
      const words = clean.split(/\s+/).filter(w => w.length > 1);

      let bestMatch = null;
      let highestScore = 0;

      for (const entry of KNOWLEDGE_BASE) {
        let score = 0;

        for (const kw of entry.keywords) {
          if (clean.includes(kw)) {
            score += kw.split(/\s+/).length * 10;
          } else {
            const kwParts = kw.split(/\s+/);
            for (const part of kwParts) {
              if (words.includes(part)) {
                score += 3;
              }
            }
          }
        }

        if (score > highestScore) {
          highestScore = score;
          bestMatch = entry;
        }
      }

      if (bestMatch && highestScore >= 3) {
        return bestMatch.response;
      }

      return "I'm not quite sure about that specific question, but I can answer anything based on Youssef's website! Try asking about:<br>• <strong>Who Youssef is</strong> or his major at Kean University<br>• His <strong>hobbies</strong> (guitar, solo travel, photography)<br>• His <strong>IT career interests</strong> &amp; daily tech tools<br>• His <strong>cybersecurity habits</strong> (like 2FA and triaging).";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatbot);
  } else {
    initChatbot();
  }
})();
