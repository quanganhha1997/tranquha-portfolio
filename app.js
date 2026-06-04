/* ─── 1. Active nav on scroll ─────────────────────────────────── */
const sections = document.querySelectorAll("header, main section");
const navItems = document.querySelectorAll("#desktop-nav .nav-links li");

function updateActiveNav() {
  let currentId = "home";

  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - section.clientHeight / 3) {
      currentId = section.getAttribute("id");
    }
  });

  navItems.forEach((li) => {
    li.classList.toggle("active", li.classList.contains(currentId));
  });
}

if (sections.length && navItems.length) {
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();
}

/* ─── 2. Project filter buttons ───────────────────────────────── */
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".portfolio-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active-filter"));
    button.classList.add("active-filter");

    projectCards.forEach((card) => {
      const match =
        filter === "all" || (card.dataset.category || "").includes(filter);

      card.classList.toggle("hide-project", !match);
    });
  });
});

/* ─── 3. Footer year ──────────────────────────────────────────── */
const yearEl = document.getElementById("footer-year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ─── 4. Portland local time in footer ────────────────────────── */
function updateLocalTime() {
  const timeElement = document.getElementById("timezone-display");

  if (!timeElement) return;

  const time = new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  timeElement.textContent = `Portland, OR • ${time}`;
}

updateLocalTime();
setInterval(updateLocalTime, 1000);

/* ─── 5. Visitor counter using CountAPI ───────────────────────── */
async function loadVisitorCount() {
  const counter = document.getElementById("visitor-count");

  if (!counter) return;

  try {
    const response = await fetch(
      "https://api.countapi.xyz/hit/anhha-portfolio/visits",
    );

    const data = await response.json();

    counter.textContent = data.value.toLocaleString();
  } catch (error) {
    counter.textContent = "Unavailable";
  }
}

loadVisitorCount();

/* ─── 6. Typed.js ─────────────────────────────────────────────── */
if (document.getElementById("typed-output") && typeof Typed !== "undefined") {
  new Typed("#typed-output", {
    strings: ["Developer", "Designer", "Learner", "Dog Lover"],
    typeSpeed: 100,
    backSpeed: 80,
    loop: true,
  });
}

/* ─── 7. Contact form validation ──────────────────────────────── */
const form = document.getElementById("contact-form");

if (form) {
  const formStatus = document.getElementById("form-status");

  const fields = [
    {
      input: document.getElementById("name"),
      errorId: "name-error",
      validate: (v) => v.trim().length >= 2,
      message: "Please enter at least 2 characters for your name.",
    },
    {
      input: document.getElementById("email"),
      errorId: "email-error",
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: "Please enter a valid email address.",
    },
    {
      input: document.getElementById("subject"),
      errorId: "subject-error",
      validate: (v) => v.trim().length >= 3,
      message: "Please enter at least 3 characters for the subject.",
    },
    {
      input: document.getElementById("message"),
      errorId: "message-error",
      validate: (v) => v.trim().length >= 10,
      message: "Please enter a message with at least 10 characters.",
    },
  ];

  function validateField(field) {
    const valid = field.validate(field.input.value);
    const errorEl = document.getElementById(field.errorId);

    field.input.classList.toggle("input-error", !valid);
    field.input.classList.toggle("input-success", valid);

    if (errorEl) {
      errorEl.textContent = valid ? "" : field.message;
    }

    return valid;
  }

  fields.forEach((field) => {
    field.input.addEventListener("input", () => {
      if (formStatus) {
        formStatus.textContent = "";
        formStatus.className = "form-status";
      }

      validateField(field);
    });
  });

  form.addEventListener("submit", (event) => {
    if (formStatus) {
      formStatus.textContent = "";
      formStatus.className = "form-status";
    }

    const formIsValid = fields.every(validateField);

    if (!formIsValid) {
      event.preventDefault();

      if (formStatus) {
        formStatus.textContent =
          "Please fix the highlighted fields before sending.";
        formStatus.classList.add("error");
      }

      form.querySelector(".input-error")?.focus();
      return;
    }

    if (formStatus) {
      formStatus.textContent = "Looks good! Sending your message...";
      formStatus.classList.add("success");
    }
  });
}
