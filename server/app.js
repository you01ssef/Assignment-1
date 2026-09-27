import express from "express";
import { DatabaseSync } from "node:sqlite";
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  chmodSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import {
  token,
  digest,
  hashPassword,
  verifyPassword,
  encrypt,
  decrypt,
} from "./security.js";
const root = fileURLToPath(new URL("../", import.meta.url));
const SESSION_MS = 30 * 60 * 1000;

export async function createApp({
  dataDir = path.join(root, "data"),
  production = false,
  origin = "http://localhost:3000",
  encryptionKey,
  now = Date.now,
  authLimit = 20,
} = {}) {
  if (production && !origin.startsWith("https://"))
    throw new Error("Production requires an HTTPS APP_ORIGIN.");
  mkdirSync(dataDir, { recursive: true, mode: 0o700 });
  const keyFile = path.join(dataDir, "encryption.key");
  const databaseFile = path.join(dataDir, "portfolio.sqlite");
  if (!encryptionKey && production)
    throw new Error("Set DATA_KEY in production (64 hex characters).");
  if (!encryptionKey && !existsSync(keyFile)) {
    if (existsSync(databaseFile))
      throw new Error(
        "Encryption key missing: restore the original key before starting.",
      );
    writeFileSync(keyFile, randomBytes(32).toString("hex"), {
      mode: 0o600,
      flag: "wx",
    });
  }
  const keyText = encryptionKey || readFileSync(keyFile, "utf8").trim();
  if (!/^[a-f0-9]{64}$/i.test(keyText))
    throw new Error("DATA_KEY must contain exactly 64 hex characters.");
  const key = Buffer.from(keyText, "hex");
  const db = new DatabaseSync(databaseFile);
  chmodSync(databaseFile, 0o600);
  db.exec(`PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id INTEGER REFERENCES users(id), csrf TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), body TEXT NOT NULL, created TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS attempts (ip TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);`);
  // Also perform a real password derivation for unknown usernames.
  const dummyPassword = await hashPassword(token());
  const app = express();
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.set({
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    });
    if (production) res.set("Strict-Transport-Security", "max-age=31536000");
    next();
  });
  app.use("/api", (req, res, next) => {
    res.set("Cache-Control", "no-store");
    if (!["GET", "HEAD"].includes(req.method) && req.get("origin") !== origin)
      return res
        .status(403)
        .json({ error: "Request origin rejected. Refresh and try again." });
    next();
  });
  app.use(express.json({ limit: "8kb" }));
  const cookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: production,
    path: "/",
  };
  const cookieName = production ? "__Host-portfolio" : "portfolio";
  function readSession(req) {
    const raw = (req.headers.cookie || "")
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith(`${cookieName}=`))
      ?.slice(cookieName.length + 1);
    if (!raw || !/^[a-f0-9]{64}$/.test(raw)) return null;
    return db
      .prepare("SELECT * FROM sessions WHERE id = ? AND expires > ?")
      .get(digest(raw), now());
  }
  function issueSession(req, res, userId = null) {
    const previous = readSession(req);
    if (previous)
      db.prepare("DELETE FROM sessions WHERE id = ?").run(previous.id);
    db.prepare("DELETE FROM sessions WHERE expires <= ?").run(now());
    const raw = token(),
      csrf = token(),
      expires = now() + SESSION_MS;
    db.prepare(
      "INSERT INTO sessions (id, user_id, csrf, expires) VALUES (?, ?, ?, ?)",
    ).run(digest(raw), userId, csrf, expires);
    res.cookie(cookieName, raw, { ...cookieOptions, maxAge: SESSION_MS });
    return { user_id: userId, csrf, expires };
  }
  function requireUser(req, res, next) {
    req.session = readSession(req);
    if (!req.session?.user_id)
      return res
        .status(401)
        .json({ error: "Please sign in. Your session may have expired." });
    next();
  }
  function csrf(req, res, next) {
    const session = readSession(req);
    if (!session || req.get("x-csrf-token") !== session.csrf)
      return res
        .status(403)
        .json({
          error: "Security token expired. Refresh the page and try again.",
        });
    next();
  }
  function rateLimit(req, res, next) {
    db.prepare("DELETE FROM attempts WHERE expires <= ?").run(now());
    // Do not trust arbitrary X-Forwarded-For headers. Behind a proxy this is a shared limit.
    const ip = req.ip;
    db.prepare(
      `INSERT INTO attempts VALUES (?, 1, ?) ON CONFLICT(ip) DO UPDATE SET count = count + 1`,
    ).run(ip, now() + 15 * 60 * 1000);
    const attempt = db.prepare("SELECT * FROM attempts WHERE ip = ?").get(ip);
    if (attempt.count > authLimit) {
      res.set(
        "Retry-After",
        String(Math.ceil((attempt.expires - now()) / 1000)),
      );
      return res
        .status(429)
        .json({ error: "Too many attempts. Please try again in 15 minutes." });
    }
    next();
  }
  function credentials(body) {
    if (
      !body ||
      typeof body.username !== "string" ||
      typeof body.password !== "string"
    )
      return null;
    const username = body.username.trim().toLowerCase(),
      password = body.password;
    if (
      !/^[a-z0-9_]{3,24}$/.test(username) ||
      password.length < 12 ||
      password.length > 128
    )
      return null;
    return { username, password };
  }
  app.get("/api/session", (req, res) => {
    const session = readSession(req) || issueSession(req, res);
    const user = session.user_id
      ? db
          .prepare("SELECT id, username FROM users WHERE id = ?")
          .get(session.user_id)
      : null;
    res.json({ user, csrf: session.csrf, expires: session.expires });
  });
  app.post("/api/register", rateLimit, csrf, async (req, res) => {
    const input = credentials(req.body);
    if (!input)
      return res
        .status(400)
        .json({
          error:
            "Use a 3–24 character username (letters, numbers, underscores) and a 12–128 character password.",
        });
    const password = await hashPassword(input.password);
    try {
      const user = db
        .prepare("INSERT INTO users (username, password) VALUES (?, ?)")
        .run(input.username, password);
      const session = issueSession(req, res, Number(user.lastInsertRowid));
      res
        .status(201)
        .json({
          user: { username: input.username },
          csrf: session.csrf,
          expires: session.expires,
        });
    } catch (error) {
      if (error.message.includes("UNIQUE constraint"))
        return res
          .status(409)
          .json({
            error: "That username is unavailable. Please choose another.",
          });
      throw error;
    }
  });
  app.post("/api/login", rateLimit, csrf, async (req, res) => {
    const input = credentials(req.body);
    if (!input)
      return res
        .status(400)
        .json({
          error: "Enter a valid username and a 12–128 character password.",
        });
    const user = db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(input.username);
    const valid = await verifyPassword(
      input.password,
      user?.password || dummyPassword,
    );
    if (!user || !valid)
      return res
        .status(401)
        .json({ error: "Username or password is incorrect." });
    const session = issueSession(req, res, user.id);
    res.json({
      user: { username: user.username },
      csrf: session.csrf,
      expires: session.expires,
    });
  });
  app.post("/api/logout", csrf, (req, res) => {
    const session = readSession(req);
    db.prepare("DELETE FROM sessions WHERE id = ?").run(session.id);
    res.clearCookie(cookieName, cookieOptions);
    res.json({ ok: true });
  });
  app.get("/api/notes", requireUser, (req, res) => {
    const notes = db
      .prepare("SELECT * FROM notes WHERE user_id = ? ORDER BY id DESC")
      .all(req.session.user_id);
    res.json({
      notes: notes.map((n) => ({
        id: n.id,
        body: decrypt(n.body, key, n.user_id),
        created: n.created,
      })),
    });
  });
  app.post("/api/notes", requireUser, csrf, (req, res) => {
    const body = req.body?.body;
    if (typeof body !== "string" || !body.trim() || body.length > 1000)
      return res
        .status(400)
        .json({ error: "Write a note between 1 and 1,000 characters." });
    if (
      db
        .prepare("SELECT count(*) AS total FROM notes WHERE user_id = ?")
        .get(req.session.user_id).total >= 50
    )
      return res
        .status(400)
        .json({
          error:
            "Your notebook is full (50 notes). Delete a note to make room.",
        });
    const result = db
      .prepare("INSERT INTO notes (user_id, body, created) VALUES (?, ?, ?)")
      .run(
        req.session.user_id,
        encrypt(body.trim(), key, req.session.user_id),
        new Date(now()).toISOString(),
      );
    res.status(201).json({ id: Number(result.lastInsertRowid) });
  });
  app.delete("/api/notes/:id", requireUser, csrf, (req, res) => {
    if (!/^[1-9][0-9]{0,14}$/.test(req.params.id))
      return res.status(400).json({ error: "Invalid note ID." });
    // Ownership is enforced in SQL, even if someone changes an ID in their browser.
    const result = db
      .prepare("DELETE FROM notes WHERE id = ? AND user_id = ?")
      .run(Number(req.params.id), req.session.user_id);
    if (!result.changes)
      return res.status(404).json({ error: "Note not found." });
    res.json({ ok: true });
  });
  app.use("/api", (req, res) =>
    res.status(404).json({ error: "Endpoint not found." }),
  );
  // Explicit public-file allowlist: never expose server code, keys, database or dependencies.
  for (const page of [
    "index",
    "about",
    "tech-interests",
    "cybersecurity",
    "threat-model",
    "architecture",
    "security-lab",
  ])
    app.get(
      page === "index" ? ["/", "/index.html"] : `/${page}.html`,
      (req, res) => res.sendFile(path.join(root, `${page}.html`)),
    );
  app.use("/css", express.static(path.join(root, "css"), { dotfiles: "deny" }));
  app.use((req, res) => res.status(404).send("Page not found."));
  app.use((error, req, res, next) => {
    const status =
      error.type === "entity.too.large"
        ? 413
        : error.type === "entity.parse.failed"
          ? 400
          : 500;
    res
      .status(status)
      .json({
        error:
          status === 413
            ? "Request is too large."
            : status === 400
              ? "Invalid JSON."
              : "Something went wrong. Please try again.",
      });
  });
  return { app, db };
}
