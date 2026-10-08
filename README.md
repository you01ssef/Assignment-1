# Youssef’s IT portfolio — GitHub Pages edition

**Open https://you01ssef.github.io/Assignment-1/ — no installation or local server needed.**

## Try it

1. Open Security Lab and choose **Create notebook**.
2. Choose a notebook name and a passphrase of at least 12 characters.
3. Save a practice note, press **Lock**, and unlock it again.
4. Open **Ask Nova**. Try `15% of 240`, `sqrt(81)`, `12 times 8`, or `Who are you?`.
5. Press **Read aloud** on a reply. Press **Stop reading** to cancel.

## Simple features

- Browser notebook with encrypted storage, safe text rendering, validation, and a 15-minute unlock session.
- Nova: a digital website helper with curated portfolio/security answers and page links. It uses local rules, not a generative AI model.
- Arithmetic, parentheses, powers, percentages, and square roots. The calculator never evaluates input as JavaScript. It does not solve general algebra or arbitrary word problems.
- Optional text to speech using browser speech synthesis. No microphone or API key. Voice availability depends on the browser; some voices may use an online service.
- Responsive cream, navy, and teal design, keyboard controls, and clear architecture and threat-model explanations.

## Where notes live

Notes stay in **this browser on this device**. They are not uploaded to GitHub and do not sync. Web Crypto derives an AES-256-GCM key from the passphrase using PBKDF2-SHA-256, 600,000 iterations, and a random salt. Each save uses a fresh IV. Only ciphertext, salt, IV, and a readable notebook name are persisted. The passphrase and key are not stored.

Lock, refresh, or 15 minutes ends the demo session and clears the in-memory key. Clearing site data deletes notes. Forgotten passphrases cannot be recovered. Browser storage may be unavailable or temporary in private browsing. Use practice notes only.

This is a **browser-only classroom demo**, not secure server accounts or real multi-user authorization. Someone who controls the page, browser, or an extension can interfere or read unlocked notes. Client validation is not a trusted security boundary.

## Assignment components

The live Architecture page maps all nine components honestly. GitHub Pages provides the web server; JavaScript provides the application layer; browser storage demonstrates persistence and encryption. A real database, server authentication, and server authorization require a backend.

The original `server/` Express/SQLite code remains available for coursework, with password hashing, ownership checks, cookie sessions, and parameterized queries. Its accounts/data are separate; the live browser notebook does not use or migrate them. `npm install` and `npm start` run that optional server, which also serves the current static frontend. Its API can be demonstrated with the automated tests. Running it is not needed for the live website.

## Tests

With Node.js 24.13 or newer:

```sh
npm install
npm test
```

Tests cover the optional server’s security controls, Nova’s matching and math, encryption round-trips, wrong passphrases, and tamper detection.

## Main files

- `security-lab.html`: browser notebook page
- `css/js/lab.js`: create/unlock/save/lock interface
- `css/js/vault.js`: Web Crypto encryption
- `css/js/chatbot.js`: Nova’s answers, persona, and speech controls
- `css/js/math.js`: safe arithmetic parser
- `architecture.html`: requirement mapping and limitations

References: [Web Crypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey), [speech synthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
