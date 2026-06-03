/**
 * app.js — Anh Ha Portfolio
 *
 * Features:
 *  1. Active nav link highlight based on scroll position
 *  2. Dynamic footer copyright year
 *  3. Typed.js initialisation
 */

/* ─── 1. Active nav on scroll ─────────────────────────────────── */

(function initNavHighlight() {
  const sections = document.querySelectorAll("main section");
  const navItems = document.querySelectorAll("#desktop-nav .nav-links li");

  if (!sections.length || !navItems.length) return;

  function updateActiveNav() {
    let currentId = "";

    sections.forEach((section) => {
      // Activate a section when its top edge is within the top third of the viewport
      if (window.scrollY >= section.offsetTop - section.clientHeight / 3) {
        currentId = section.getAttribute("id");
      }
    });

    navItems.forEach((li) => {
      li.classList.toggle("active", li.classList.contains(currentId));
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });

  // Set correct state on page load (handles direct hash links)
  updateActiveNav();
})();

/* ─── 2. Footer year ──────────────────────────────────────────── */

(function setFooterYear() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ─── 3. Typed.js ─────────────────────────────────────────────── */

(function initTyped() {
  const el = document.getElementById("typed-output");
  if (!el || typeof Typed === "undefined") return;

  new Typed("#typed-output", {
    strings: ["Programmer", "Problem Solver", "Developer", "Dog Lover"],
    typeSpeed: 100,
    backSpeed: 80,
    loop: true,
  });
})();
