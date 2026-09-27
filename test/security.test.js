import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createApp } from "../server/app.js";
import { answerQuestion } from "../css/js/chatbot.js";
const origin = "http://localhost:3000";
async function fixture(options = {}) {
  const dataDir = mkdtempSync(path.join(tmpdir(), "portfolio-test-"));
  const { app, db } = await createApp({ dataDir, ...options });
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  function client() {
    let cookie = "",
      csrf = "";
    return {
      get cookie() {
        return cookie;
      },
      get csrf() {
        return csrf;
      },
      async request(route, method = "GET", body, extraHeaders = {}) {
        const response = await fetch(url + route, {
          method,
          headers: {
            origin,
            cookie,
            "content-type": "application/json",
            "x-csrf-token": csrf,
            ...extraHeaders,
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        });
        const setCookie = response.headers.get("set-cookie");
        if (setCookie) cookie = setCookie.split(";")[0];
        const value = await response.json();
        if (value.csrf) csrf = value.csrf;
        return { response, value };
      },
    };
  }
  return {
    db,
    url,
    client,
    cleanup: async () => {
      await new Promise((resolve) => server.close(resolve));
      db.close();
      rmSync(dataDir, { recursive: true });
    },
  };
}
const account = (username) => ({
  username,
  password: "a long classroom passphrase",
});
test("accounts, encrypted storage, ownership checks, sessions and logout", async () => {
  const f = await fixture();
  try {
    const alice = f.client(),
      bob = f.client();
    assert.equal((await alice.request("/api/notes")).response.status, 401);
    const initial = await alice.request("/api/session");
    assert.match(initial.response.headers.get("set-cookie"), /HttpOnly/);
    assert.match(initial.response.headers.get("set-cookie"), /SameSite=Strict/);
    const anonymousCookie = alice.cookie;
    assert.equal(
      (await alice.request("/api/register", "POST", account("alice"))).response
        .status,
      201,
    );
    assert.notEqual(alice.cookie, anonymousCookie);
    const storedPassword = f.db
      .prepare("SELECT password FROM users WHERE username = ?")
      .get("alice").password;
    assert.notEqual(storedPassword, account("alice").password);
    const body =
      "<img src=x onerror=alert(1)> private SQL test: '; DROP TABLE users;--";
    const saved = await alice.request("/api/notes", "POST", { body });
    assert.equal(saved.response.status, 201);
    const stored = f.db.prepare("SELECT body FROM notes").get().body;
    assert.ok(!stored.includes("private SQL test"));
    assert.equal((await alice.request("/api/notes")).value.notes[0].body, body);
    await bob.request("/api/session");
    await bob.request("/api/register", "POST", account("bob"));
    assert.deepEqual((await bob.request("/api/notes")).value.notes, []);
    assert.equal(
      (await bob.request(`/api/notes/${saved.value.id}`, "DELETE")).response
        .status,
      404,
    );
    const authenticatedCookie = alice.cookie;
    assert.equal(
      (await alice.request("/api/logout", "POST", {})).response.status,
      200,
    );
    assert.equal(
      (
        await alice.request("/api/notes", "GET", undefined, {
          cookie: authenticatedCookie,
        })
      ).response.status,
      401,
    );
    await alice.request("/api/session");
    assert.equal(
      (
        await alice.request("/api/login", "POST", {
          ...account("alice"),
          password: "a wrong long password",
        })
      ).response.status,
      401,
    );
    assert.equal(
      (await alice.request("/api/login", "POST", account("alice"))).response
        .status,
      200,
    );
    assert.equal((await alice.request("/api/notes")).value.notes.length, 1);
    assert.equal(
      (await alice.request(`/api/notes/${saved.value.id}`, "DELETE")).response
        .status,
      200,
    );
  } finally {
    await f.cleanup();
  }
});
test("rejects CSRF, foreign origins, malformed input, SQL injection and oversized requests", async () => {
  const f = await fixture();
  try {
    const client = f.client();
    await client.request("/api/session");
    assert.equal(
      (
        await client.request("/api/register", "POST", account("alice"), {
          "x-csrf-token": "wrong",
        })
      ).response.status,
      403,
    );
    assert.equal(
      (
        await client.request("/api/register", "POST", account("alice"), {
          origin: "https://evil.example",
        })
      ).response.status,
      403,
    );
    for (const bad of [
      { username: "admin'--", password: "long enough password" },
      { username: "alice", password: "short" },
      { username: ["alice"], password: "long enough password" },
    ])
      assert.equal(
        (await client.request("/api/register", "POST", bad)).response.status,
        400,
      );
    await client.request("/api/register", "POST", account("alice"));
    for (const body of ["", " ", "a".repeat(1001), {}, 12])
      assert.equal(
        (await client.request("/api/notes", "POST", { body })).response.status,
        400,
      );
    assert.equal(
      (await client.request("/api/notes", "POST", { body: "a".repeat(9000) }))
        .response.status,
      413,
    );
    assert.equal(
      (await client.request("/api/notes/1abc", "DELETE")).response.status,
      400,
    );
    const malformed = await fetch(f.url + "/api/notes", {
      method: "POST",
      headers: { origin, "content-type": "application/json" },
      body: "{",
    });
    assert.equal(malformed.status, 400);
  } finally {
    await f.cleanup();
  }
});
test("sessions expire on the server and attempts are rate limited", async () => {
  let now = Date.now();
  const f = await fixture({ now: () => now, authLimit: 3 });
  try {
    const client = f.client();
    await client.request("/api/session");
    await client.request("/api/register", "POST", account("alice"));
    now += 30 * 60 * 1000 + 1;
    assert.equal((await client.request("/api/notes")).response.status, 401);
    await client.request("/api/session");
    for (let i = 0; i < 3; i++)
      await client.request("/api/login", "POST", account("missing"));
    const limited = await client.request(
      "/api/login",
      "POST",
      account("alice"),
    );
    assert.equal(limited.response.status, 429);
    assert.ok(limited.response.headers.get("retry-after"));
  } finally {
    await f.cleanup();
  }
});
test("public files have security headers; private server files cannot be downloaded", async () => {
  const f = await fixture();
  try {
    for (const resource of [
      "/",
      "/architecture.html",
      "/security-lab.html",
      "/css/style.css",
    ]) {
      const res = await fetch(f.url + resource);
      assert.equal(res.status, 200);
      assert.match(
        res.headers.get("content-security-policy"),
        /script-src 'self'/,
      );
    }
    for (const resource of [
      "/data/portfolio.sqlite",
      "/data/encryption.key",
      "/server/app.js",
      "/.env",
      "/package.json",
    ])
      assert.equal((await fetch(f.url + resource)).status, 404);
  } finally {
    await f.cleanup();
  }
});
test("production requires HTTPS and key, and uses Secure cookies", async () => {
  await assert.rejects(createApp({ production: true }), /HTTPS/);
  const f = await fixture({
    production: true,
    origin: "https://portfolio.example",
    encryptionKey: "a".repeat(64),
  });
  try {
    const response = await fetch(f.url + "/api/session");
    assert.match(
      response.headers.get("set-cookie"),
      /__Host-portfolio=.*Secure/,
    );
    assert.ok(response.headers.get("strict-transport-security"));
  } finally {
    await f.cleanup();
  }
});
test("assistant recognizes topics without substring greetings, compares concepts and admits unknowns", () => {
  assert.equal(answerQuestion("Explain authorization").id, "authorization");
  assert.equal(
    answerQuestion(
      "What is the difference between authentication and authorization?",
    ).id,
    "authorization",
  );
  assert.equal(answerQuestion("How are notes encrypted?").id, "encryption");
  assert.equal(answerQuestion("Who is Youssef?").id, "bio");
  assert.match(
    answerQuestion("Which languages does he speak?").text,
    /doesn’t list/,
  );
  assert.match(
    answerQuestion("Which is his favorite restaurant?").text,
    /don’t have a reliable answer/,
  );
  assert.match(answerQuestion("hi").text, /Hello/);
  assert.equal(answerQuestion("Tell me more", "sessions").id, "sessions");
});
