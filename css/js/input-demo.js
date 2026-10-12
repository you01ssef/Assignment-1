const form = document.querySelector("#sql-demo-form");

if (form) {
  const input = document.querySelector("#demo-username");
  const unsafe = document.querySelector("#unsafe-query");
  const safe = document.querySelector("#safe-query");
  const status = document.querySelector("#demo-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = input.value;
    if (username.length > 48) {
      status.textContent = "Use 48 characters or fewer for this display-only example.";
      return;
    }
    // Show the unsafe shape for teaching; never send or execute it.
    unsafe.textContent = `SELECT id FROM users WHERE username = '${username}'`;
    safe.textContent = `SELECT id FROM users WHERE username = ?  ·  bound value: ${JSON.stringify(username)}`;
    status.textContent = "Displayed only. No SQL executes and nothing leaves this page.";
  });
}
