/**
 * app.js — Anh Ha Portfolio
 *
 * Features:
 *  1. Active nav link highlight based on scroll position
 *  2. Dynamic footer copyright year
 *  3. Typed.js initialisation
 *  4. Contact form validation
 */

/* ─── 1. Active nav on scroll ─────────────────────────────────── */

(function initNavHighlight() {
  const sections = document.querySelectorAll("main section");
  const navItems = document.querySelectorAll("#desktop-nav .nav-links li");

  if (!sections.length || !navItems.length) return;

  function updateActiveNav() {
    let currentId = "";

    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - section.clientHeight / 3) {
        currentId = section.getAttribute("id");
      }
    });

    navItems.forEach((li) => {
      li.classList.toggle("active", li.classList.contains(currentId));
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();
})();

/* ─── 2. Footer year ──────────────────────────────────────────── */

(function setFooterYear() {
  const yearEl = document.getElementById("footer-year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
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

/* ─── 4. Contact Form Validation ──────────────────────────────── */

(function initFormValidation() {
  const form = document.getElementById("contact-form");

  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");
  const formStatus = document.getElementById("form-status");

  const fields = [
    {
      input: nameInput,
      errorId: "name-error",
      validate: (value) => value.trim().length >= 2,
      message: "Please enter at least 2 characters for your name.",
    },
    {
      input: emailInput,
      errorId: "email-error",
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: "Please enter a valid email address.",
    },
    {
      input: subjectInput,
      errorId: "subject-error",
      validate: (value) => value.trim().length >= 3,
      message: "Please enter at least 3 characters for the subject.",
    },
    {
      input: messageInput,
      errorId: "message-error",
      validate: (value) => value.trim().length >= 10,
      message: "Please enter a message with at least 10 characters.",
    },
  ];

  function showError(field) {
    const errorElement = document.getElementById(field.errorId);

    field.input.classList.add("input-error");
    field.input.classList.remove("input-success");

    if (errorElement) {
      errorElement.textContent = field.message;
    }
  }

  function showSuccess(field) {
    const errorElement = document.getElementById(field.errorId);

    field.input.classList.remove("input-error");
    field.input.classList.add("input-success");

    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  function clearStatus() {
    formStatus.textContent = "";
    formStatus.classList.remove("error", "success");
  }

  function validateField(field) {
    if (field.validate(field.input.value)) {
      showSuccess(field);
      return true;
    }

    showError(field);
    return false;
  }

  fields.forEach((field) => {
    field.input.addEventListener("input", () => {
      clearStatus();
      validateField(field);
    });
  });

  form.addEventListener("submit", (event) => {
    let formIsValid = true;

    clearStatus();

    fields.forEach((field) => {
      const fieldIsValid = validateField(field);

      if (!fieldIsValid) {
        formIsValid = false;
      }
    });

    if (!formIsValid) {
      event.preventDefault();

      formStatus.textContent =
        "Please fix the highlighted fields before sending.";
      formStatus.classList.add("error");

      const firstInvalidInput = form.querySelector(".input-error");

      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }

      return;
    }

    formStatus.textContent = "Looks good! Sending your message...";
    formStatus.classList.add("success");
  });
})();
