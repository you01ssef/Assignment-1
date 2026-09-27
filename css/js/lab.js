let csrf = "",
  mode = "login",
  sessionTimer;
const $ = (id) => document.getElementById(id);
async function api(path, method = "GET", body) {
  const response = await fetch(`api/${path}`, {
    method,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const type = response.headers.get("content-type") || "";
  if (!type.includes("application/json"))
    throw new Error("The security server is not available here.");
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401 && path !== "login") expire();
    throw new Error(data.error || "The request could not be completed.");
  }
  return data;
}
function expire() {
  clearTimeout(sessionTimer);
  $("notebook").hidden = true;
  $("notes").replaceChildren();
  $("note-body").value = "";
  $("note-count").textContent = "0 / 1,000 characters";
  $("auth-area").hidden = false;
  $("lab-status").textContent =
    "Your session ended. Sign in again to continue.";
  api("session")
    .then((data) => {
      csrf = data.csrf;
    })
    .catch(() => {
      $("lab-status").textContent = "Connection lost. Refresh to reconnect.";
    });
}
async function showSession(data) {
  csrf = data.csrf;
  clearTimeout(sessionTimer);
  $("offline").hidden = true;
  $("auth-area").hidden = Boolean(data.user);
  $("notebook").hidden = !data.user;
  $("auth-message").textContent = "";
  $("password").value = "";
  if (data.user) {
    $("welcome").textContent = `${data.user.username}’s notes`;
    $("session-info").textContent =
      `Session ends at ${new Date(data.expires).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`;
    $("lab-status").textContent =
      "Signed in · Your notes are private to this account.";
    sessionTimer = setTimeout(expire, Math.max(0, data.expires - Date.now()));
    await loadNotes();
  } else {
    $("notes").replaceChildren();
    $("note-body").value = "";
    $("note-count").textContent = "0 / 1,000 characters";
    $("lab-status").textContent =
      "Lab connected · Sign in or create an account to begin.";
  }
}
async function connect() {
  try {
    await showSession(await api("session"));
  } catch {
    $("auth-area").hidden = true;
    $("notebook").hidden = true;
    $("offline").hidden = false;
    $("lab-status").textContent =
      "The security lab is offline. The public portfolio and assistant still work.";
  }
}
for (const selectedMode of ["login", "register"])
  $(selectedMode + "-tab").addEventListener("click", () => {
    mode = selectedMode;
    for (const tab of ["login", "register"]) {
      $(tab + "-tab").classList.toggle("selected", tab === mode);
      $(tab + "-tab").setAttribute("aria-pressed", String(tab === mode));
    }
    $("auth-title").textContent =
      mode === "login" ? "Welcome back." : "Make room for new ideas.";
    $("auth-description").textContent =
      mode === "login"
        ? "Sign in to open your private notes."
        : "Create a simple account for your security notebook.";
    $("auth-submit").textContent =
      mode === "login" ? "Sign in →" : "Create account →";
    $("password").autocomplete =
      mode === "login" ? "current-password" : "new-password";
    $("auth-message").textContent = "";
  });
$("auth-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("auth-submit").disabled = true;
  $("auth-message").textContent = "";
  try {
    // Refresh the anonymous CSRF token in case a visitor left the form open.
    const state = await api("session");
    csrf = state.csrf;
    const data = await api(mode, "POST", {
      username: $("username").value.trim(),
      password: $("password").value,
    });
    await showSession(data);
    $("note-body").focus();
  } catch (error) {
    $("auth-message").textContent = error.message;
  } finally {
    $("auth-submit").disabled = false;
  }
});
$("logout").addEventListener("click", async () => {
  $("logout").disabled = true;
  try {
    await api("logout", "POST", {});
    await showSession(await api("session"));
    $("username").focus();
  } catch (error) {
    $("note-message").textContent = error.message;
  } finally {
    $("logout").disabled = false;
  }
});
$("note-body").addEventListener("input", () => {
  $("note-count").textContent =
    `${$("note-body").value.length} / 1,000 characters`;
});
$("note-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("save-note").disabled = true;
  $("note-message").textContent = "";
  try {
    await api("notes", "POST", { body: $("note-body").value });
    $("note-body").value = "";
    $("note-count").textContent = "0 / 1,000 characters";
    await loadNotes();
    $("note-message").textContent = "Note saved.";
  } catch (error) {
    $("note-message").textContent = error.message;
  } finally {
    $("save-note").disabled = false;
  }
});
async function loadNotes() {
  const { notes } = await api("notes");
  $("notes").replaceChildren();
  if (!notes.length) {
    const empty = document.createElement("div");
    empty.className = "empty-notes";
    const heading = document.createElement("strong");
    heading.textContent = "A fresh page for your learning.";
    const hint = document.createElement("p");
    hint.textContent = "Your first private note will appear here.";
    empty.append(heading, hint);
    $("notes").append(empty);
    return;
  }
  for (const note of notes) {
    const item = document.createElement("article");
    item.className = "note";
    const text = document.createElement("p");
    text.textContent = note.body;
    const meta = document.createElement("div");
    meta.className = "note-meta";
    const time = document.createElement("time");
    time.dateTime = note.created;
    time.textContent = new Date(note.created).toLocaleString();
    const remove = document.createElement("button");
    remove.className = "delete-note";
    remove.textContent = "Delete";
    remove.setAttribute("aria-label", `Delete note from ${time.textContent}`);
    remove.addEventListener("click", async () => {
      if (!confirm("Delete this study note? This cannot be undone.")) return;
      remove.disabled = true;
      try {
        await api(`notes/${note.id}`, "DELETE");
        await loadNotes();
        $("note-message").textContent = "Note deleted.";
      } catch (error) {
        $("note-message").textContent = error.message;
        remove.disabled = false;
      }
    });
    meta.append(time, remove);
    item.append(text, meta);
    $("notes").append(item);
  }
}
$("retry-lab").addEventListener("click", connect);
// Recheck when returning from another tab (including after logout in another tab).
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) connect();
});
connect();
