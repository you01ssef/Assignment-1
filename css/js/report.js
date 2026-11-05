const fields = [...document.querySelectorAll("[data-report-field]")];
const status = document.getElementById("save-status");
const storageKey = "lab1-identity-security-report-v1";
let entries = {};
try { entries = JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch { entries = {}; }
for (const field of fields) {
  const key = field.dataset.reportField;
  if (typeof entries[key] === "string") field.value = entries[key];
  field.addEventListener("input", () => {
    entries[key] = field.value;
    try {
      localStorage.setItem(storageKey, JSON.stringify(entries));
      status.textContent = "Saved in this browser only. Print or save a PDF to keep a separate copy.";
    } catch {
      status.textContent = "Browser storage is unavailable. Print or save a PDF before leaving this page.";
    }
  });
}
document.getElementById("print-report")?.addEventListener("click", () => window.print());
document.getElementById("clear-report")?.addEventListener("click", () => {
  if (!window.confirm("Clear all entries in this Lab 1 report on this browser?")) return;
  for (const field of fields) field.value = "";
  entries = {};
  try { localStorage.removeItem(storageKey); } catch {}
  status.textContent = "Entries cleared from this browser.";
});
