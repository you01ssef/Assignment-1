const knowledge = [
  {
    id: "bio",
    keywords: [
      "who is youssef",
      "about youssef",
      "who are you",
      "bio",
      "introduce",
      "student",
    ],
    text: "Youssef is an Information Technology senior at Kean University. He’s working toward graduation and enjoys guitar, solo travel, photography, and learning languages.",
    page: "about.html",
  },
  {
    id: "education",
    keywords: [
      "university",
      "kean",
      "college",
      "degree",
      "major",
      "school",
      "graduation",
      "graduate",
      "senior",
    ],
    text: "Youssef is a senior majoring in Information Technology at Kean University. His current academic goal is to finish strong and graduate.",
    page: "about.html",
  },
  {
    id: "hobbies",
    keywords: ["hobbies", "hobby", "free time", "personal interests"],
    text: "Outside IT, Youssef enjoys playing guitar (over six years), solo traveling, digital photography, and learning languages.",
    page: "about.html",
  },
  {
    id: "guitar",
    keywords: ["guitar", "music", "instrument"],
    text: "Youssef has played guitar for over six years and enjoys exploring music and musical instruments.",
    page: "about.html",
  },
  {
    id: "travel",
    keywords: [
      "travel",
      "traveling",
      "travelling",
      "trip",
      "photography",
      "camera",
      "photos",
    ],
    text: "Youssef enjoys solo travel, meeting new people, and photographing landscapes, cityscapes, and candid moments.",
    page: "about.html",
  },
  {
    id: "languages",
    keywords: ["languages", "language", "speak", "multilingual"],
    text: "Youssef speaks about four languages. The portfolio doesn’t list which ones, so I can’t name them accurately.",
    page: "about.html",
  },
  {
    id: "career",
    keywords: [
      "career",
      "job",
      "sysadmin",
      "systems administration",
      "systems administrator",
      "infrastructure",
      "support engineer",
    ],
    text: "Youssef is interested in systems administration, infrastructure operations, and technical support. He likes practical troubleshooting and keeping systems reliable.",
    page: "tech-interests.html",
  },
  {
    id: "skills",
    keywords: [
      "scripting",
      "python",
      "bash",
      "powershell",
      "skills",
      "automate",
      "automation",
    ],
    text: "He wants to improve administrative scripting and automated infrastructure triage: using Python, Bash, or PowerShell to inspect logs and automate routine IT tasks.",
    page: "tech-interests.html",
  },
  {
    id: "tools",
    keywords: [
      "devices",
      "laptop",
      "daily tools",
      "daily tech",
      "cloud",
      "macos",
      "windows",
    ],
    text: "His everyday tools include macOS and Windows computers, smartphones, and Google Drive and iCloud for storing coursework and creative projects.",
    page: "tech-interests.html",
  },
  {
    id: "security",
    keywords: [
      "cybersecurity",
      "cyber security",
      "protect information",
      "security mean",
    ],
    text: "To Youssef, cybersecurity means protecting people and sensitive information. Good habits include strong unique passwords, a second factor, and careful attention to alerts.",
    page: "cybersecurity.html",
  },
  {
    id: "mfa",
    keywords: [
      "2fa",
      "mfa",
      "two factor",
      "two-factor",
      "habit",
      "otp",
      "token demo",
    ],
    text: "Youssef uses two-factor authentication on important accounts. The website’s code widget is only a browser-based learning demo. The Security Lab’s real login uses a password; real MFA isn’t implemented.",
    page: "cybersecurity.html",
  },
  {
    id: "triage",
    keywords: ["triage", "triaging", "incident", "alerts"],
    text: "Security triage means checking an alert, judging its severity, filtering false alarms, and prioritizing the incidents that need attention first. It’s a topic Youssef wants to learn.",
    page: "cybersecurity.html",
  },
  {
    id: "architecture",
    keywords: [
      "architecture",
      "components",
      "requirements",
      "how does the site work",
      "how does the website work",
      "stack",
    ],
    text: "The lab has three main parts: a plain HTML/CSS/JavaScript frontend, a Node.js + Express server and application layer, and a SQLite database. The server handles authentication, authorization, encryption, sessions, and validation. See the architecture page for all nine requirements.",
    page: "architecture.html",
  },
  {
    id: "authentication",
    keywords: [
      "authentication",
      "authenticate",
      "login",
      "log in",
      "sign in",
      "signin",
      "password",
      "register",
      "registration",
      "account",
    ],
    text: "Authentication answers ‘who are you?’ The lab checks your username and password on the server. Passwords are stored as salted scrypt hashes, not readable text. Successful login creates a new session; repeated attempts are rate limited.",
    page: "security-lab.html",
  },
  {
    id: "authorization",
    keywords: [
      "authorization",
      "authorisation",
      "permission",
      "ownership",
      "another user",
      "other users",
      "access control",
    ],
    text: "Authorization answers ‘what may you access?’ Public visitors can read the portfolio. Signed-in users can read and delete only their own notes. The server checks the session’s user ID in every note query; changing an ID in the browser doesn’t grant access.",
    page: "architecture.html",
  },
  {
    id: "encryption",
    keywords: [
      "encryption",
      "encrypted",
      "encrypt",
      "aes",
      "hashing",
      "hashed",
      "hash",
      "https",
      "tls",
    ],
    text: "Private note text is encrypted with AES-256-GCM before storage. Passwords use one-way salted scrypt hashes, which are different from reversible encryption. Public hosting must provide HTTPS for data in transit; the local classroom demo uses HTTP on localhost.",
    page: "architecture.html",
  },
  {
    id: "sessions",
    keywords: [
      "session",
      "sessions",
      "cookie",
      "cookies",
      "logout",
      "log out",
      "sign out",
      "expire",
      "expiration",
    ],
    text: "Sessions last 30 minutes. A random token is stored in an HttpOnly, SameSite=Strict cookie; the database stores only its hash. Login replaces the session and logout revokes it. Production cookies also use Secure so they travel only over HTTPS.",
    page: "architecture.html",
  },
  {
    id: "validation",
    keywords: [
      "validation",
      "validate",
      "input",
      "xss",
      "sql injection",
      "csrf",
    ],
    text: "The server validates usernames, passwords, note lengths, and note IDs. Prepared SQL statements prevent user input from becoming SQL commands. Text-only rendering prevents HTML injection, and origin plus CSRF token checks protect requests that change data.",
    page: "architecture.html",
  },
  {
    id: "database",
    keywords: ["database", "sqlite", "storage", "sql"],
    text: "SQLite keeps accounts, sessions, rate-limit counters, and encrypted notes in a server-side file. Queries use placeholders instead of joining user input into SQL. The database and encryption key aren’t served to visitors or committed to Git.",
    page: "architecture.html",
  },
  {
    id: "notes",
    keywords: ["notes", "note", "notebook", "security lab", "lab"],
    text: "Open the Security Lab, create an account, and save a study note. Each account can store up to 50 notes of 1,000 characters each. Only the owner can access them. This feature requires the Node server and won’t run on GitHub Pages alone.",
    page: "security-lab.html",
  },
  {
    id: "hosting",
    keywords: [
      "github pages",
      "hosting",
      "offline",
      "server",
      "deploy",
      "backend",
    ],
    text: "GitHub Pages can host the public pages and this local assistant. Accounts and notes need the included Node server: run npm install, then npm start, and open localhost:3000. Public deployment also needs HTTPS, persistent storage, and a private encryption key.",
    page: "architecture.html",
  },
  {
    id: "threats",
    keywords: ["threat", "threats", "threat model", "stride"],
    text: "STRIDE covers Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege. The threat model connects each risk to a control or an explicit limitation of this project.",
    page: "threat-model.html",
  },
  {
    id: "navigation",
    keywords: ["pages", "navigation", "links", "menu"],
    text: "You can explore Home, About, Technology, Cybersecurity, Threat Model, Architecture, and the Security Lab. The Architecture page is the best place to see how the assignment requirements are implemented.",
    page: "architecture.html",
  },
];
const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
export function answerQuestion(question, previousTopic = null) {
  const normalized = normalize(question.slice(0, 400));
  if (/^(hi|hello|hey|good morning|good evening)$/.test(normalized))
    return {
      text: "Hello! I can help you explore Youssef’s portfolio or explain the Security Lab. Try “How are notes protected?” or “What career interests him?”",
    };
  if (/^(thanks|thank you|thank you so much|great|cool)$/.test(normalized))
    return {
      text: "You’re welcome! You can ask another question about the portfolio or the security architecture.",
    };
  if (
    /^(tell me more|more|explain more|how does it work|why|give me an example)$/.test(
      normalized,
    ) &&
    previousTopic
  ) {
    const topic = knowledge.find((item) => item.id === previousTopic);
    if (topic)
      return {
        ...topic,
        text: `${topic.text}\n\nThe linked page has the full explanation and any demo associated with this topic.`,
      };
  }
  const ranked = knowledge
    .map((item) => ({
      ...item,
      score: item.keywords.reduce((score, phrase) => {
        const keyword = normalize(phrase);
        return ` ${normalized} `.includes(` ${keyword} `)
          ? score + keyword.split(" ").length * 3
          : score;
      }, 0),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
  if (!ranked.length)
    return {
      text: "I don’t have a reliable answer to that in this portfolio. I can help with Youssef’s background, IT interests, or the site’s security. Try “Explain the architecture”, “How are passwords stored?”, or “What are his hobbies?”",
    };
  const best = ranked[0];
  // Explain both sides of a common comparison instead of picking just one keyword.
  if (
    normalized.includes("authentication") &&
    /authori[sz]ation/.test(normalized)
  ) {
    return {
      id: "authorization",
      page: "architecture.html",
      text: "Authentication verifies who you are (signing in with your password). Authorization checks what you can do (reading or deleting only your own notes). The server enforces both; a hidden button alone is not security.",
    };
  }
  return best;
}
if (typeof document !== "undefined") {
  const $ = (id) => document.getElementById(id);
  const windowEl = $("chat-window"),
    launcher = $("chat-launcher"),
    messages = $("chat-messages");
  let previousTopic = null;
  function addMessage(text, user = false, page = null) {
    const item = document.createElement("div");
    item.className = `chat-message${user ? " user" : ""}`;
    item.textContent = text;
    if (page) {
      const link = document.createElement("a");
      link.href = page;
      link.textContent = "Explore this page →";
      item.append(link);
    }
    messages.append(item);
    while (messages.children.length > 40) messages.firstElementChild.remove();
    messages.scrollTop = messages.scrollHeight;
  }
  function reset() {
    previousTopic = null;
    messages.replaceChildren();
    addMessage(
      "Hi, I’m your portfolio guide. Ask about Youssef, his IT interests, or how the Security Lab works. I use curated local answers, so I’ll tell you when I don’t know.",
    );
  }
  function open(value) {
    windowEl.hidden = !value;
    launcher.setAttribute("aria-expanded", String(value));
    (value ? $("chat-input") : launcher).focus();
  }
  function send(question) {
    const value = question.trim().slice(0, 400);
    if (!value) return;
    addMessage(value, true);
    const answer = answerQuestion(value, previousTopic);
    previousTopic = answer.id || previousTopic;
    addMessage(answer.text, false, answer.page);
    $("chat-input").value = "";
    $("chat-input").focus();
  }
  launcher.addEventListener("click", () => open(windowEl.hidden));
  $("chat-close").addEventListener("click", () => open(false));
  $("chat-reset").addEventListener("click", () => {
    reset();
    $("chat-input").focus();
  });
  $("chat-form").addEventListener("submit", (event) => {
    event.preventDefault();
    send($("chat-input").value);
  });
  document
    .querySelectorAll("[data-question]")
    .forEach((button) =>
      button.addEventListener("click", () => send(button.dataset.question)),
    );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !windowEl.hidden) open(false);
  });
  reset();
}
