document.documentElement.classList.add("js");

const reduceMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileNavigation = window.matchMedia("(max-width: 760px)");
let reduceMotion = reduceMotionPreference.matches;

const menuToggle = document.querySelector(".menu-toggle");
const menuToggleLabel = menuToggle?.querySelector(".sr-only");
const navigation = document.querySelector(".nav-links");
const navLinks = [...document.querySelectorAll(".nav-links a")];

function setMenuState(open, returnFocus = false) {
  if (!menuToggle || !navigation) return;

  const shouldOpen = open && mobileNavigation.matches;
  const shouldDisableNavigation = mobileNavigation.matches && !shouldOpen;

  menuToggle.setAttribute("aria-expanded", String(shouldOpen));
  navigation.classList.toggle("is-open", shouldOpen);
  navigation.toggleAttribute("inert", shouldDisableNavigation);
  navLinks.forEach((link) => {
    if (shouldDisableNavigation) link.setAttribute("tabindex", "-1");
    else link.removeAttribute("tabindex");
  });
  document.body.classList.toggle("menu-open", shouldOpen);

  if (menuToggleLabel) {
    menuToggleLabel.textContent = shouldOpen ? "Close navigation" : "Open navigation";
  }

  if (!shouldOpen && returnFocus) menuToggle.focus();
}

menuToggle?.addEventListener("click", () => {
  setMenuState(menuToggle.getAttribute("aria-expanded") !== "true");
});

navLinks.forEach((link) =>
  link.addEventListener("click", () => setMenuState(false, mobileNavigation.matches)),
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
    setMenuState(false, true);
  }
});

document.addEventListener("pointerdown", (event) => {
  if (menuToggle?.getAttribute("aria-expanded") !== "true") return;
  if (event.target instanceof Element && !event.target.closest(".site-nav")) setMenuState(false);
});

mobileNavigation.addEventListener("change", () => setMenuState(false));
setMenuState(false);

/* Active navigation */
const sections = [...document.querySelectorAll("[data-section]")];
if ("IntersectionObserver" in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const sectionId = visible.target.dataset.section;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${sectionId}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-28% 0px -58%", threshold: [0, 0.15, 0.4] },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

/* Scroll progress remains functional when the optional motion layer is unavailable. */
const progressBar = document.querySelector(".scroll-progress span");
let progressFrame = 0;

function updateProgress() {
  if (!progressBar) return;

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
}

function requestProgressUpdate() {
  if (progressFrame) return;

  progressFrame = window.requestAnimationFrame(() => {
    progressFrame = 0;
    updateProgress();
  });
}

if (progressBar) {
  window.addEventListener("scroll", requestProgressUpdate, { passive: true });
  window.addEventListener("resize", requestProgressUpdate);
  updateProgress();
}

/* Typewriter: the visible animation is decorative; assistive technology gets stable text in the HTML. */
const rotatingWord = document.getElementById("rotating-word");
const typewriterWords = ["operations.", "teams.", "data.", "systems."];
let wordIndex = 1;
let typewriterTimer;
let typewriterRunId = 0;
let typewriterRunning = false;

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function typeNextWord(runId) {
  if (!rotatingWord || reduceMotion || runId !== typewriterRunId) {
    typewriterRunning = false;
    return;
  }

  if (rotatingWord.textContent && typeof rotatingWord.animate === "function") {
    const exitAnimation = rotatingWord.animate(
      [
        { opacity: 1, transform: "translateY(0px)" },
        { opacity: 0, transform: "translateY(-6px)" },
      ],
      {
        duration: 160,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        fill: "forwards",
      },
    );

    try {
      await exitAnimation.finished;
    } catch {
      // The animation may be cancelled when the motion preference changes.
    }
    exitAnimation.cancel();
  }

  if (reduceMotion || runId !== typewriterRunId) {
    typewriterRunning = false;
    return;
  }

  const next = typewriterWords[wordIndex % typewriterWords.length];
  rotatingWord.textContent = "";
  rotatingWord.style.opacity = "1";
  rotatingWord.style.transform = "translateY(0px)";

  let built = "";
  for (const character of next) {
    if (reduceMotion || runId !== typewriterRunId) {
      typewriterRunning = false;
      return;
    }

    built += character;
    rotatingWord.textContent = built;
    await wait(52);
  }

  await wait(1250);
  if (reduceMotion || runId !== typewriterRunId) {
    typewriterRunning = false;
    return;
  }

  wordIndex = (wordIndex + 1) % typewriterWords.length;
  typewriterTimer = window.setTimeout(() => typeNextWord(runId), 0);
}

function startTypewriter() {
  if (!rotatingWord || reduceMotion || typewriterRunning) return;

  typewriterRunning = true;
  const runId = ++typewriterRunId;
  typewriterTimer = window.setTimeout(() => typeNextWord(runId), 1500);
}

function stopTypewriter() {
  typewriterRunId += 1;
  typewriterRunning = false;
  window.clearTimeout(typewriterTimer);

  if (rotatingWord) {
    rotatingWord.textContent = typewriterWords[0];
    rotatingWord.style.opacity = "1";
    rotatingWord.style.transform = "none";
  }
}

reduceMotionPreference.addEventListener("change", (event) => {
  reduceMotion = event.matches;
  if (reduceMotion) stopTypewriter();
  else startTypewriter();
});

startTypewriter();

/* Image fallbacks */
document.querySelectorAll("figure[data-fallback]").forEach((figure) => {
  const image = figure.querySelector("img");
  if (!image) return;

  const showFallback = () => figure.classList.add("image-missing");
  if (image.complete && image.naturalWidth === 0) showFallback();
  image.addEventListener("error", showFallback, { once: true });
});

/* Accessible async contact form */
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  const formStatus = document.getElementById("form-status");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const buttonLabel = submitButton?.querySelector(".button-label");
  const fields = [
    ...contactForm.querySelectorAll("input:not([type='hidden']):not([type='checkbox']), textarea"),
  ];

  function messageFor(field) {
    if (field.validity.valueMissing) return "Required.";
    if (field.validity.typeMismatch) return "Use a valid email.";
    if (field.validity.tooShort) return `Use at least ${field.minLength} characters.`;
    return "Check this field.";
  }

  function validateField(field) {
    const message = field.validity.valid ? "" : messageFor(field);
    const error = document.getElementById(`${field.id}-error`);
    field.classList.toggle("input-error", Boolean(message));
    field.classList.toggle("input-success", !message && field.value.trim().length > 0);
    field.setAttribute("aria-invalid", String(Boolean(message)));
    if (error) error.textContent = message;
    return !message;
  }

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("input-error")) validateField(field);
      if (formStatus) {
        formStatus.textContent = "";
        formStatus.className = "form-status";
      }
    });
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const valid = fields.map(validateField).every(Boolean);

    if (!valid) {
      if (formStatus) {
        formStatus.textContent = "Check the highlighted fields.";
        formStatus.className = "form-status error";
      }
      contactForm.querySelector(".input-error")?.focus();
      return;
    }

    contactForm.setAttribute("aria-busy", "true");
    if (submitButton) submitButton.disabled = true;
    if (buttonLabel) buttonLabel.textContent = "Sending…";
    if (formStatus) {
      formStatus.textContent = "Sending…";
      formStatus.className = "form-status";
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Message request failed");

      contactForm.reset();
      fields.forEach((field) => {
        field.classList.remove("input-error", "input-success");
        field.removeAttribute("aria-invalid");
      });

      if (formStatus) {
        formStatus.textContent = "Message sent. Thank you.";
        formStatus.className = "form-status success";

        if (!reduceMotion && typeof formStatus.animate === "function") {
          formStatus.animate(
            [
              { opacity: 0, transform: "translateY(6px)" },
              { opacity: 1, transform: "translateY(0px)" },
            ],
            {
              duration: 200,
              easing: "cubic-bezier(0.23, 1, 0.32, 1)",
            },
          );
        }
      }
    } catch {
      if (formStatus) {
        formStatus.textContent = "Couldn’t send. Please use the email link.";
        formStatus.className = "form-status error";
      }
    } finally {
      contactForm.removeAttribute("aria-busy");
      if (submitButton) submitButton.disabled = false;
      if (buttonLabel) buttonLabel.textContent = "Send message";
    }
  });
}

const footerYear = document.getElementById("footer-year");
if (footerYear) footerYear.textContent = new Date().getFullYear();
