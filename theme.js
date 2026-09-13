(function () {
  let saved;
  try { saved = localStorage.getItem("theme"); } catch (_) { /* Storage is optional. */ }
  if (saved === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();

function toggleTheme(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const root = document.documentElement;
  const isLight = root.getAttribute("data-theme") === "light";
  root.setAttribute("data-theme", isLight ? "dark" : "light");
  try { localStorage.setItem("theme", isLight ? "dark" : "light"); } catch (_) { /* Storage is optional. */ }
}

function formatLastLogin() {
  const lang = document.documentElement.lang || "en";
  const locale = lang === "de" ? "de-DE" : "en-US";
  const now = new Date();

  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(now);
}

function initializeLastLogin() {
  document.querySelectorAll(".js-last-login").forEach((node) => {
    node.textContent = formatLastLogin();
  });
}

function initializeEntries() {
  document.querySelectorAll("[data-entry]").forEach((entry, index) => {
    const toggle = entry.querySelector("[data-entry-toggle]");
    if (!toggle) {
      return;
    }

    entry.classList.add("enhanced");
    const body = entry.querySelector(".entry-body");
    if (body) {
      body.id = body.id || `project-details-${index + 1}`;
      toggle.setAttribute("aria-controls", body.id);
    }

    const initiallyOpen = entry.getAttribute("data-open") === "true" || index === 0;
    entry.classList.toggle("open", initiallyOpen);
    toggle.setAttribute("aria-expanded", initiallyOpen ? "true" : "false");

    toggle.addEventListener("click", () => {
      const willOpen = !entry.classList.contains("open");
      entry.classList.toggle("open", willOpen);
      toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeLastLogin();
  initializeEntries();
});
