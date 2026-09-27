# Youssef’s IT portfolio

A simple portfolio for Kean University computer security coursework. It keeps the personal pages, adds a clearer design and local assistant, and demonstrates security with a small private notebook.

## Run it

Install **Node.js 24.13 or newer**, then open a terminal in this folder:

```sh
npm install
npm start
```

Open **http://localhost:3000**. Use the Security Lab to create your own account. There are no default passwords, API keys, or paid services to configure for the local demo.

The app creates a `data/` directory automatically. It contains the SQLite database and a local encryption key; neither belongs in Git. Keep both to preserve your notes between restarts.

## What’s included

- Responsive portfolio with About, Technology, and Cybersecurity pages.
- A private notebook: register, sign in, save and delete your own study notes, sign out.
- An Architecture page explaining all nine assignment components.
- An updated STRIDE threat model.
- A local assistant with topic matching, suggested questions, page links, follow-up context, and honest fallback answers. It does **not** call a generative AI service. Messages stay in the current page and disappear on refresh.
- A clearly labelled 2FA concept demo. It is separate from real login and is not real MFA or TOTP.

## The nine requirements

| Component          | Simple implementation                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Frontend           | HTML, CSS, and vanilla JavaScript                                                                                           |
| Web server         | Node.js and Express serve pages and API requests                                                                            |
| Application layer  | Express handlers validate requests and apply security checks                                                                |
| Database           | One SQLite file with users, sessions, notes, and rate-limit counters                                                        |
| Authentication     | Username/password login; salted scrypt password hashes                                                                      |
| Authorization      | The session’s user ID restricts each note query to its owner                                                                |
| Encryption         | AES-256-GCM encrypts note text; HTTPS is required for public deployment                                                     |
| Session management | Random tokens, hashed at rest; HttpOnly and SameSite=Strict cookies; 30-minute expiry; login rotation and logout revocation |
| Input validation   | Server-side type and length checks, prepared SQL, text-only rendering, origin and CSRF checks                               |

**Class explanation:** “The browser sends a request to my Express application. The server checks the session, permission, and input before accessing SQLite. Private note text is encrypted before storage. Authentication proves who a user is, and authorization limits them to their own notes.”

## Quick classroom demonstration

1. Open **Architecture** and walk through the three-part diagram and nine components.
2. Create an account in **Security Lab** with a username and a 12-character-or-longer passphrase.
3. Save a note and refresh to show that it is stored in the database.
4. Sign out and create a second account. The first account’s notes are not visible.
5. Sign back into the first account to retrieve and delete its note.
6. Ask the assistant “What is the difference between authentication and authorization?”

## Check the implementation

```sh
npm test
npm audit --omit=dev
```

Tests cover login/logout, ownership isolation, encrypted storage, session expiry, cookie flags, rate limits, input validation, CSRF/origin rejection, private-file protection, and assistant matching. Tests use disposable databases and never modify real notes.

## Files to understand

- `server/index.js`: starts the server.
- `server/app.js`: routes, SQLite tables, session and access checks.
- `server/security.js`: password hashing and note encryption.
- `css/js/lab.js`: sign-in and notebook interface.
- `css/js/chatbot.js`: local knowledge and assistant interface.
- `architecture.html`: explanation for the assignment.

## Hosting

**GitHub Pages only hosts the public pages and assistant. It cannot run this backend.** On Pages, the lab explains how to start the local server instead of pretending sign-in works.

For a class presentation, running `npm start` locally is enough to demonstrate all components. For a public full-stack deployment, use a Node-capable host with HTTPS and persistent storage:

- `NODE_ENV=production`
- `APP_ORIGIN=https://your-exact-domain` (no trailing slash)
- `DATA_DIR=/path/to/persistent/private/data`
- `DATA_KEY`: a private 64-character hex key (32 random bytes)
- `HOST=0.0.0.0` when your host requires listening on all interfaces
- `PORT`: supplied by your host, or 3000

Generate a key locally with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`, then store it in the hosting provider’s secret settings. Never put it in the repository. Back up the key and database separately; replacing or losing the key makes existing notes unreadable. If moving an existing local database, preserve its original key.

Production starts only with an HTTPS origin and an explicit key. Cookies use Secure in production. HTTPS termination itself is the host’s responsibility; the included server runs HTTP behind it. No public backend is deployed by this repository alone.

This remains a classroom project: no password recovery, email verification, admin panel, real MFA, or full audit log. Encryption protects note contents in a leaked database, not against a compromised application server; usernames and timestamps are not encrypted. The login limit is 20 attempts per IP per 15 minutes and does not trust forwarded IP headers, so visitors behind a reverse proxy can share that limit. Use one server process and add host-level abuse controls before opening registration widely.

## References

- [Node.js cryptography](https://nodejs.org/api/crypto.html)
- [Node.js SQLite](https://nodejs.org/api/sqlite.html)
- [Express security guidance](https://expressjs.com/en/advanced/best-practice-security/)
- [GitHub Pages is static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
