import { mathAnswer } from "./math.js";
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
    text: "Youssef uses two-factor authentication on important accounts. The code widget illustrates the concept only. Neither the browser notebook nor optional password-login backend implements real MFA.",
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
    text: "The live site runs on GitHub Pages: HTML/CSS/JavaScript, browser application logic, and encrypted browser storage. The Architecture page distinguishes this demonstration from the optional Express/SQLite backend in the repository.",
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
    text: "The live demo unlocks a notebook using a passphrase-derived encryption key. This is a browser encryption demonstration, not a real server account. The optional Node backend separately implements password login.",
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
    text: "Browser notebook names separate encrypted notebooks, but client-side UI checks are not server authorization. For real multi-user access control, the optional backend checks each note\u2019s owner on the server.",
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
    text: "The live notebook derives an AES-256-GCM encryption key from your passphrase using PBKDF2 with a random salt. Only encrypted notes are saved in browser storage. The passphrase and unlocked key are not saved. GitHub Pages serves the site over HTTPS.",
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
    text: "The live notebook keeps its unlocked key only in memory. It locks after 15 minutes, on refresh, or when you press Lock. This is a demo session, not a server session cookie.",
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
    text: "The live demo limits notebook names, passphrase lengths, and note lengths. Notes and chat are rendered as text, and math uses a small parser rather than eval. Browser checks are bypassable; the optional backend adds server validation and prepared SQL.",
    page: "architecture.html",
  },
  {
    id: "database",
    keywords: ["database", "sqlite", "storage", "sql"],
    text: "The live notebook uses encrypted browser storage, not a hosted database. Notes stay in this browser and do not sync. Clearing site data removes them. The optional backend still contains SQLite for the full database requirement.",
    page: "architecture.html",
  },
  {
    id: "notes",
    keywords: ["notes", "note", "notebook", "security lab", "lab"],
    text: "Open the Security Lab and create a notebook with a name and passphrase. Save up to 50 short notes, then lock it. Return in the same browser and unlock it to see your notes. No server installation is needed. There is no recovery if you forget the passphrase or clear site data.",
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
    text: "The live Security Lab, Nova helper, and math calculator work directly on GitHub Pages with no backend setup. Encrypted notes stay in your browser. The original Node/SQLite backend remains optional classroom source code.",
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
  const math = mathAnswer(question.slice(0,400));
  if (math) return math;
  const normalized = normalize(question.slice(0, 400));
  if (/who are you|your name|what can you do|help me|^help$|persona|nova/.test(normalized)) return {text:"I’m Nova, your digital portfolio helper. I can guide you around Youssef’s website, explain security concepts, calculate simple math, and read my replies aloud. Try 15% of 240, sqrt(81), or ‘open the lab’. I use local rules and curated answers, not a generative AI service."};
  if (/open the lab|take me to.*lab/.test(normalized)) return {text:"Let’s try the Security Lab! Create a browser notebook, save a note, then lock and unlock it. No installation needed.",page:"security-lab.html",id:"notes"};
  if (/^(hi|hello|hey|good morning|good evening)$/.test(normalized))
    return {
      text: "Hello! I’m Nova. I can help you explore Youssef’s portfolio, do simple math, or explain the Security Lab. Try “How are notes protected?” or “What career interests him?”",
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
      text: "Authentication verifies who you are (signing in with your password). Authorization checks what you can do (reading or deleting only your own notes). The optional backend enforces both. The live browser notebook demonstrates unlocking only; a hidden button alone is not authorization.",
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
  const speechSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  function stopSpeech() { if(speechSupported) speechSynthesis.cancel(); document.querySelectorAll('.read-aloud').forEach(b=>{b.textContent='Read aloud';b.setAttribute('aria-pressed','false');}); }
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
    if (!user) {
      const read = document.createElement('button'); read.className = 'read-aloud'; read.textContent = speechSupported ? 'Read aloud' : 'Voice unavailable'; read.disabled = !speechSupported; read.setAttribute('aria-pressed','false');
      read.addEventListener('click', () => {
        const playing = read.getAttribute('aria-pressed') === 'true'; stopSpeech(); if(playing)return;
        const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'en-US'; utterance.rate = 1;
        const voices = speechSynthesis.getVoices(); const voice = voices.find(v=>v.localService && v.lang.startsWith('en')); if(voice) utterance.voice=voice;
        read.textContent = 'Stop reading'; read.setAttribute('aria-pressed','true');
        utterance.onend = () => {read.textContent='Read aloud';read.setAttribute('aria-pressed','false');};
        utterance.onerror = () => {read.textContent='Voice unavailable — retry';read.setAttribute('aria-pressed','false');};
        speechSynthesis.speak(utterance);
      }); item.append(read);
    }
    messages.append(item);
    while (messages.children.length > 40) messages.firstElementChild.remove();
    messages.scrollTop = messages.scrollHeight;
  }
  window.addEventListener("pagehide", stopSpeech);
  function reset() {
    stopSpeech();
    previousTopic = null;
    messages.replaceChildren();
    addMessage(
      "Hi, I’m Nova ✳ Your digital portfolio helper. Ask about Youssef, explore the lab, or try “15% of 240”. Tap Read aloud on any reply to hear it. I use local rules, not a generative AI service.",
    );
  }
  function open(value) {
    if(!value) stopSpeech();
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
