const menu = document.querySelector("#navigation");
const toggle = document.querySelector(".mobile-toggle");
toggle?.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu?.classList.contains("open")) {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  }
});
// A clearly labelled concept demo, separate from actual account authentication.
let demoCode = "",
  expires = 0;
const generate = document.querySelector("#generate-2fa-btn");
const result = document.querySelector("#otp-result-msg");
generate?.addEventListener("click", () => {
  demoCode = String(
    (crypto.getRandomValues(new Uint32Array(1))[0] % 900000) + 100000,
  );
  expires = Date.now() + 30000;
  document.querySelector("#current-otp-display").textContent = demoCode;
  result.textContent =
    "Demo code ready. Enter it within 30 seconds; it works once.";
});
document.querySelector("#verify-2fa-btn")?.addEventListener("click", () => {
  if (!demoCode || Date.now() > expires) {
    result.textContent =
      "Generate a new demo code first (codes expire after 30 seconds).";
    return;
  }
  const value = document.querySelector("#otp-user-input").value.trim();
  if (value === demoCode) {
    result.textContent =
      "Demo code matched! In a real system, the server would verify your second factor.";
    demoCode = "";
    document.querySelector("#current-otp-display").textContent = "------";
    document.querySelector("#otp-user-input").value = "";
  } else result.textContent = "That code does not match. Please try again.";
});
