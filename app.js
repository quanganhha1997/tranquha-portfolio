document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobileNavigation = window.matchMedia("(max-width: 860px)");
const mobileProjects = window.matchMedia("(max-width: 760px)");

/* Navigation */
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const pageRegions = [
  document.querySelector("header"),
  document.querySelector("main"),
  document.querySelector("footer"),
].filter(Boolean);

function setMenuState(open, returnFocus = false) {
  if (!menuToggle || !navigation) return;

  const shouldOpen = open && mobileNavigation.matches;
  menuToggle.setAttribute("aria-expanded", String(shouldOpen));
  navigation.classList.toggle("is-open", shouldOpen);
  document.body.classList.toggle("menu-open", shouldOpen);
  pageRegions.forEach((region) => {
    region.inert = shouldOpen;
  });

  if (shouldOpen) {
    window.requestAnimationFrame(() => navLinks[0]?.focus());
  } else if (returnFocus) {
    menuToggle.focus();
  }
}

menuToggle?.addEventListener("click", () => {
  setMenuState(menuToggle.getAttribute("aria-expanded") !== "true");
});

navLinks.forEach((link) => link.addEventListener("click", () => setMenuState(false)));

document.addEventListener("keydown", (event) => {
  const menuIsOpen = menuToggle?.getAttribute("aria-expanded") === "true";

  if (event.key === "Escape" && menuIsOpen) {
    event.preventDefault();
    setMenuState(false, true);
    return;
  }

  if (event.key !== "Tab" || !menuIsOpen || !menuToggle) return;
  const focusable = [menuToggle, ...navLinks];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

document.addEventListener("pointerdown", (event) => {
  if (menuToggle?.getAttribute("aria-expanded") !== "true") return;
  if (!event.target.closest(".site-nav")) setMenuState(false);
});

mobileNavigation.addEventListener("change", () => setMenuState(false));

const observedSections = [...document.querySelectorAll("[data-section]")];

if ("IntersectionObserver" in window && observedSections.length) {
  const navObserver = new IntersectionObserver(
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
    { rootMargin: "-26% 0px -58%", threshold: [0, 0.1, 0.35] },
  );

  observedSections.forEach((section) => navObserver.observe(section));
}

/* Scroll-linked details */
let scrollTicking = false;
const projectsMotion = document.querySelector(".projects");

function sectionProgress(element) {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  const distance = window.innerHeight + rect.height;
  return Math.min(Math.max((window.innerHeight - rect.top) / distance, 0), 1);
}

function updateScrollEffects() {
  const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
  const heroShift = Math.max(-24, window.scrollY * -0.028);
  const projectsProgress = sectionProgress(projectsMotion);

  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
  document.documentElement.style.setProperty("--scroll-px", `${window.scrollY}px`);
  document.documentElement.style.setProperty("--hero-shift", `${heroShift.toFixed(2)}px`);
  projectsMotion?.style.setProperty(
    "--projects-spot-x",
    `${((projectsProgress - 0.5) * 110).toFixed(2)}px`,
  );
  projectsMotion?.style.setProperty(
    "--projects-spot-y",
    `${((projectsProgress - 0.5) * 70).toFixed(2)}px`,
  );
  scrollTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateScrollEffects);
  },
  { passive: true },
);

window.addEventListener("resize", updateScrollEffects, { passive: true });
updateScrollEffects();

/* Reveal motion */
document.querySelectorAll(".skills-heading, .about-heading, .projects-heading, .contact-intro").forEach((item) => {
  item.classList.add("reveal-left");
});

document.querySelectorAll(".hero-visual-wrap").forEach((item) => {
  item.classList.add("reveal-scale");
});

document.querySelectorAll(".skill-group").forEach((item, index) => {
  item.classList.add("reveal-scale");
  item.style.setProperty("--reveal-delay", `${index * 80}ms`);
});

document.querySelectorAll(".timeline-item").forEach((item, index) => {
  item.classList.add("reveal-right");
  item.style.setProperty("--reveal-delay", `${index * 55}ms`);
});

document.querySelectorAll(".contact-form").forEach((item) => {
  item.classList.add("reveal-scale");
  item.style.setProperty("--reveal-delay", "100ms");
});

const revealItems = [...document.querySelectorAll(".reveal")];

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -7%", threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const projectCards = [...document.querySelectorAll(".project-card")];

if (reduceMotion || !("IntersectionObserver" in window)) {
  projectCards.forEach((card) => card.classList.add("scroll-visible"));
} else {
  const projectObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("scroll-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -5%", threshold: 0.12 },
  );

  projectCards.forEach((card) => projectObserver.observe(card));
}

/* Hero text morph primitive */
const rotatingWord = document.getElementById("rotating-word");
const rotatingWords = ["operations.", "systems.", "data.", "teams."];
const MotionLib = window.Motion || null;
const animateMotion = MotionLib?.animate;
const pressMotion = MotionLib?.press;
const styleEffect = MotionLib?.styleEffect;
const motionValue = MotionLib?.motionValue;
const animateView = MotionLib?.animateView;

if (rotatingWord) {
  rotatingWord.classList.remove("typewriter-word");
  rotatingWord.classList.add("morph-word");

  if (!reduceMotion && animateMotion) {
    let wordIndex = 0;
    let morphTimer = null;

    const scheduleMorph = () => {
      window.clearTimeout(morphTimer);
      if (document.hidden) return;
      morphTimer = window.setTimeout(async () => {
        await animateMotion(
          rotatingWord,
          { opacity: 0, y: -8, filter: "blur(5px)" },
          { duration: 0.18, ease: "ease-in" },
        );

        wordIndex = (wordIndex + 1) % rotatingWords.length;
        rotatingWord.textContent = rotatingWords[wordIndex];
        rotatingWord.style.transform = "translateY(8px)";

        await animateMotion(
          rotatingWord,
          { opacity: 1, y: 0, filter: "blur(0px)" },
          { type: "spring", bounce: 0, duration: 0.36 },
        );
        scheduleMorph();
      }, 1900);
    };

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) window.clearTimeout(morphTimer);
      else scheduleMorph();
    });

    scheduleMorph();
  }
}

/* Graceful image fallbacks */
document.querySelectorAll("figure img").forEach((image) => {
  const showFallback = () => image.closest("figure")?.classList.add("image-missing");
  image.addEventListener("error", showFallback, { once: true });
  if (image.complete && image.naturalWidth === 0) showFallback();
});

/* Mobile project carousel — direct drag + momentum projection + spring settle */
const projectStage = document.querySelector(".project-stage");
const projectTrack = document.querySelector(".project-track");
const previousButton = document.querySelector('[data-direction="prev"]');
const nextButton = document.querySelector('[data-direction="next"]');
const projectCount = document.querySelector(".project-count");
let carouselAnimation = null;

function cardStep() {
  const card = projectCards[0];
  if (!card || !projectTrack) return projectStage?.clientWidth || 0;
  const trackStyles = window.getComputedStyle(projectTrack);
  const gap = Number.parseFloat(trackStyles.gap || trackStyles.columnGap || "0");
  return card.getBoundingClientRect().width + gap;
}

function currentProjectIndex() {
  if (!projectStage || !mobileProjects.matches) return 0;
  const step = cardStep();
  if (!step) return 0;
  return Math.min(Math.max(Math.round(projectStage.scrollLeft / step), 0), projectCards.length - 1);
}

function updateCarouselState() {
  if (!projectStage) return;
  const index = currentProjectIndex();
  const maxScroll = Math.max(projectStage.scrollWidth - projectStage.clientWidth, 0);

  if (previousButton) previousButton.disabled = !mobileProjects.matches || projectStage.scrollLeft <= 4;
  if (nextButton) {
    nextButton.disabled =
      !mobileProjects.matches || projectStage.scrollLeft >= maxScroll - 4 || projectCards.length <= 1;
  }

  if (projectCount) {
    const current = String(projectCards.length ? index + 1 : 0).padStart(2, "0");
    const total = String(projectCards.length).padStart(2, "0");
    const currentNode = projectCount.querySelector("strong");
    if (currentNode) currentNode.textContent = current;
    projectCount.lastChild.textContent = ` / ${total}`;
  }
}

function stopCarouselAnimation() {
  carouselAnimation?.stop?.();
  carouselAnimation = null;
  projectStage?.classList.remove("is-settling");
}

function springScrollTo(target, velocity = 0) {
  if (!projectStage) return;
  const maxScroll = Math.max(projectStage.scrollWidth - projectStage.clientWidth, 0);
  const clampedTarget = Math.min(Math.max(target, 0), maxScroll);

  stopCarouselAnimation();
  projectStage.classList.add("is-settling");

  if (reduceMotion || !animateMotion) {
    projectStage.scrollTo({ left: clampedTarget, behavior: "auto" });
    projectStage.classList.remove("is-settling");
    return;
  }

  carouselAnimation = animateMotion(projectStage.scrollLeft, clampedTarget, {
    type: "spring",
    bounce: Math.abs(velocity) > 450 ? 0.16 : 0,
    duration: 0.42,
    velocity,
    onUpdate: (value) => {
      projectStage.scrollLeft = value;
    },
    onComplete: () => {
      carouselAnimation = null;
      projectStage.classList.remove("is-settling");
      updateCarouselState();
    },
  });
}

function moveProjects(direction) {
  if (!projectStage || !mobileProjects.matches) return;
  const step = cardStep() || projectStage.clientWidth * 0.88;
  const currentIndex = currentProjectIndex();
  const nextIndex = Math.min(Math.max(currentIndex + direction, 0), projectCards.length - 1);
  springScrollTo(nextIndex * step);
}

previousButton?.addEventListener("click", () => moveProjects(-1));
nextButton?.addEventListener("click", () => moveProjects(1));

projectStage?.addEventListener("keydown", (event) => {
  if (!mobileProjects.matches) return;
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    moveProjects(event.key === "ArrowLeft" ? -1 : 1);
  }
});

let carouselTicking = false;
projectStage?.addEventListener(
  "scroll",
  () => {
    if (carouselTicking) return;
    carouselTicking = true;
    window.requestAnimationFrame(() => {
      updateCarouselState();
      carouselTicking = false;
    });
  },
  { passive: true },
);

let dragStartX = 0;
let dragStartScroll = 0;
let dragHistory = [];
let didDrag = false;

projectStage?.addEventListener("pointerdown", (event) => {
  if (!mobileProjects.matches || event.pointerType !== "mouse" || event.button !== 0) return;
  stopCarouselAnimation();
  dragStartX = event.clientX;
  dragStartScroll = projectStage.scrollLeft;
  dragHistory = [{ x: event.clientX, time: performance.now() }];
  didDrag = false;
  projectStage.classList.add("is-dragging");
  projectStage.setPointerCapture(event.pointerId);
});

projectStage?.addEventListener("pointermove", (event) => {
  if (!projectStage.classList.contains("is-dragging")) return;
  const distance = event.clientX - dragStartX;
  if (Math.abs(distance) > 6) didDrag = true;
  projectStage.scrollLeft = dragStartScroll - distance;

  const now = performance.now();
  dragHistory.push({ x: event.clientX, time: now });
  dragHistory = dragHistory.filter((sample) => now - sample.time <= 90).slice(-6);
});

function projectDistance(initialVelocity, decelerationRate = 0.998) {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}

function releaseCarousel(event) {
  if (!projectStage?.classList.contains("is-dragging")) return;
  projectStage.classList.remove("is-dragging");

  if (event?.pointerId !== undefined && projectStage.hasPointerCapture(event.pointerId)) {
    projectStage.releasePointerCapture(event.pointerId);
  }

  if (!didDrag) return;

  const recent = dragHistory[0];
  const last = dragHistory[dragHistory.length - 1];
  const elapsedSeconds = Math.max(((last?.time || 0) - (recent?.time || 0)) / 1000, 0.001);
  const pointerVelocity = recent && last ? (last.x - recent.x) / elapsedSeconds : 0;
  const scrollVelocity = -pointerVelocity;
  const projected = projectStage.scrollLeft + projectDistance(scrollVelocity);
  const step = cardStep() || projectStage.clientWidth * 0.88;
  const targetIndex = Math.min(
    Math.max(Math.round(projected / step), 0),
    Math.max(projectCards.length - 1, 0),
  );

  springScrollTo(targetIndex * step, scrollVelocity);
}

projectStage?.addEventListener("pointerup", releaseCarousel);
projectStage?.addEventListener("pointercancel", releaseCarousel);
projectStage?.addEventListener("lostpointercapture", releaseCarousel);
projectStage?.addEventListener(
  "click",
  (event) => {
    if (!didDrag) return;
    event.preventDefault();
    event.stopPropagation();
    didDrag = false;
  },
  true,
);

mobileProjects.addEventListener("change", () => {
  stopCarouselAnimation();
  projectStage?.scrollTo({ left: 0, behavior: "auto" });
  if (projectStage) projectStage.tabIndex = mobileProjects.matches ? 0 : -1;
  updateCarouselState();
});

window.addEventListener("resize", updateCarouselState, { passive: true });
if (projectStage) projectStage.tabIndex = mobileProjects.matches ? 0 : -1;
updateCarouselState();

/* Motion primitives — press, magnetic CTA, tilt, morphing project details */
if (!reduceMotion && MotionLib && motionValue && styleEffect) {
  const uiSpring = { type: "spring", bounce: 0, duration: 0.34 };

  /* Pressable: immediate pointer/keyboard response */
  pressMotion?.(
    ".button, .project-arrow, .project-link, .text-link, .nav-links a, .menu-toggle",
    (element) => {
      animateMotion(element, { scale: 0.97 }, { type: "spring", bounce: 0, duration: 0.18 });
      return () => animateMotion(element, { scale: 1 }, uiSpring);
    },
  );

  /* Magnetic primary CTA: direct manipulation in, spring home out */
  const magneticButton = document.querySelector(".button-primary");
  const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  if (magneticButton && precisePointer.matches) {
    const magneticX = motionValue(0);
    const magneticY = motionValue(0);
    styleEffect(magneticButton, { x: magneticX, y: magneticY });

    magneticButton.addEventListener("pointermove", (event) => {
      const rect = magneticButton.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      magneticX.set(Math.max(-8, Math.min(8, dx * 0.14)));
      magneticY.set(Math.max(-6, Math.min(6, dy * 0.16)));
    });

    magneticButton.addEventListener("pointerleave", () => {
      animateMotion(magneticX, 0, uiSpring);
      animateMotion(magneticY, 0, uiSpring);
    });
  }

  /* Tilt: pointer position maps 1:1 to a small 3D response, spring returns */
  if (precisePointer.matches) {
    projectCards.forEach((card) => {
      const rotateX = motionValue(0);
      const rotateY = motionValue(0);
      const cardScale = motionValue(1);
      let tiltRenderer = null;

      card.addEventListener("pointerenter", () => {
        if (mobileProjects.matches || tiltRenderer) return;
        tiltRenderer = styleEffect(card, { rotateX, rotateY, scale: cardScale });
      });

      card.addEventListener("pointermove", (event) => {
        if (mobileProjects.matches) return;
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        rotateX.set(py * -4);
        rotateY.set(px * 6);
        cardScale.set(1.01);
      });

      card.addEventListener("pointerleave", () => {
        animateMotion(rotateX, 0, uiSpring);
        animateMotion(rotateY, 0, uiSpring);
        animateMotion(cardScale, 1, uiSpring);
      });
    });
  }
}

/* Morphing project details dialog — progressively enhanced */
const projectDialog = document.createElement("dialog");
projectDialog.className = "project-dialog";
projectDialog.setAttribute("aria-labelledby", "project-dialog-title");
projectDialog.innerHTML = `
  <div class="project-dialog-surface">
    <button class="project-dialog-close" type="button" aria-label="Close project details">×</button>
    <div class="project-dialog-media" aria-hidden="true"></div>
    <div class="project-dialog-content">
      <p class="project-dialog-kicker"></p>
      <h2 id="project-dialog-title"></h2>
      <p class="project-dialog-description"></p>
      <ul class="project-dialog-tags"></ul>
      <div class="project-dialog-actions"></div>
    </div>
  </div>
`;
document.body.appendChild(projectDialog);

const dialogSurface = projectDialog.querySelector(".project-dialog-surface");
const dialogMedia = projectDialog.querySelector(".project-dialog-media");
const dialogKicker = projectDialog.querySelector(".project-dialog-kicker");
const dialogTitle = projectDialog.querySelector("#project-dialog-title");
const dialogDescription = projectDialog.querySelector(".project-dialog-description");
const dialogTags = projectDialog.querySelector(".project-dialog-tags");
const dialogActions = projectDialog.querySelector(".project-dialog-actions");
const dialogClose = projectDialog.querySelector(".project-dialog-close");
let activeProjectCard = null;
let activeProjectTrigger = null;

function populateProjectDialog(card) {
  const image = card.querySelector(".project-image img");
  const caption = card.querySelector(".project-image figcaption");
  const title = card.querySelector(".project-body h3");
  const description = card.querySelector(".project-body > p");
  const tags = [...card.querySelectorAll(".project-tags li")];
  const repository = card.querySelector(".project-link");
  const status = card.querySelector(".project-status");

  dialogMedia.innerHTML = image
    ? `<img src="${image.currentSrc || image.src}" alt="${image.alt.replaceAll('"', '&quot;')}" />`
    : "";
  dialogKicker.textContent = caption?.textContent || "Selected project";
  dialogTitle.textContent = title?.textContent || "Project details";
  dialogDescription.textContent = description?.textContent || "";
  dialogTags.innerHTML = tags.map((tag) => `<li>${tag.textContent}</li>`).join("");
  dialogActions.innerHTML = "";

  if (repository) {
    const link = repository.cloneNode(true);
    link.classList.add("project-dialog-link");
    dialogActions.appendChild(link);
  } else if (status) {
    const note = document.createElement("p");
    note.className = "project-dialog-status";
    note.textContent = status.textContent;
    dialogActions.appendChild(note);
  }
}

function openProjectDialog(card, trigger) {
  activeProjectCard = card;
  activeProjectTrigger = trigger;
  populateProjectDialog(card);

  const show = () => {
    projectDialog.showModal();
    document.body.classList.add("dialog-open");
  };

  if (!reduceMotion && animateView) {
    animateView(show, { type: "spring", bounce: 0, duration: 0.42 })
      .add(card, dialogSurface)
      .new({ opacity: 1 });
  } else {
    show();
  }
}

function closeProjectDialog() {
  if (!projectDialog.open) return;
  const returnFocus = activeProjectTrigger;
  const hide = () => {
    projectDialog.close();
    document.body.classList.remove("dialog-open");
  };

  if (!reduceMotion && animateView && activeProjectCard) {
    animateView(hide, { type: "spring", bounce: 0, duration: 0.38 })
      .add(dialogSurface, activeProjectCard)
      .old({ opacity: 1 })
      .then(() => returnFocus?.focus());
  } else {
    hide();
    returnFocus?.focus();
  }
}

projectCards.forEach((card) => {
  const action = card.querySelector(".project-link, .project-status");
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "project-details-trigger";
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.innerHTML = 'Project details <span aria-hidden="true">↗</span>';

  if (action) action.insertAdjacentElement("beforebegin", trigger);
  else card.querySelector(".project-copy")?.appendChild(trigger);

  trigger.addEventListener("click", () => openProjectDialog(card, trigger));

  if (!reduceMotion && pressMotion && animateMotion) {
    pressMotion(trigger, (element) => {
      animateMotion(element, { scale: 0.97 }, { type: "spring", bounce: 0, duration: 0.18 });
      return () =>
        animateMotion(element, { scale: 1 }, { type: "spring", bounce: 0, duration: 0.34 });
    });
  }
});

if (!reduceMotion && dialogClose && pressMotion && animateMotion) {
  pressMotion(dialogClose, (element) => {
    animateMotion(element, { scale: 0.94 }, { type: "spring", bounce: 0, duration: 0.16 });
    return () => animateMotion(element, { scale: 1 }, { type: "spring", bounce: 0, duration: 0.3 });
  });
}

dialogClose?.addEventListener("click", closeProjectDialog);
projectDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeProjectDialog();
});
projectDialog.addEventListener("click", (event) => {
  if (event.target === projectDialog) closeProjectDialog();
});

/* Accessible async contact form */
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const formStatus = document.getElementById("form-status");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const submitLabel = submitButton?.querySelector(".button-label");
  const fields = [
    {
      input: document.getElementById("name"),
      error: document.getElementById("name-error"),
      isValid: (value) => value.trim().length >= 2,
      message: "Please enter at least two characters.",
    },
    {
      input: document.getElementById("email"),
      error: document.getElementById("email-error"),
      isValid: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: "Please enter a valid email address.",
    },
    {
      input: document.getElementById("subject"),
      error: document.getElementById("subject-error"),
      isValid: (value) => value.trim().length >= 3,
      message: "Please add a short subject.",
    },
    {
      input: document.getElementById("message"),
      error: document.getElementById("message-error"),
      isValid: (value) => value.trim().length >= 10,
      message: "Please write at least ten characters.",
    },
  ].filter((field) => field.input);

  function validateField(field) {
    const valid = field.isValid(field.input.value);
    field.input.classList.toggle("input-error", !valid);
    field.input.classList.toggle("input-success", valid);
    field.input.setAttribute("aria-invalid", String(!valid));
    if (field.error) field.error.textContent = valid ? "" : field.message;
    return valid;
  }

  fields.forEach((field) => {
    field.input.addEventListener("blur", () => validateField(field));
    field.input.addEventListener("input", () => {
      if (field.input.classList.contains("input-error")) validateField(field);
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
        formStatus.textContent = "Please check the highlighted fields.";
        formStatus.className = "form-status error";
      }
      contactForm.querySelector(".input-error")?.focus();
      return;
    }

    contactForm.setAttribute("aria-busy", "true");
    if (submitButton) submitButton.disabled = true;
    if (submitLabel) submitLabel.textContent = "Sending…";
    if (formStatus) {
      formStatus.textContent = "Sending your message…";
      formStatus.className = "form-status";
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) throw new Error("Submission failed");

      contactForm.reset();
      fields.forEach((field) => {
        field.input.classList.remove("input-error", "input-success");
        field.input.setAttribute("aria-invalid", "false");
        if (field.error) field.error.textContent = "";
      });

      if (formStatus) {
        formStatus.textContent = "Thanks — your message has been sent.";
        formStatus.className = "form-status success";
      }
    } catch {
      if (formStatus) {
        formStatus.textContent = "I couldn’t send that message. Please use the email link below.";
        formStatus.className = "form-status error";
      }
    } finally {
      contactForm.removeAttribute("aria-busy");
      if (submitButton) submitButton.disabled = false;
      if (submitLabel) submitLabel.textContent = "Send message";
    }
  });
}

/* Footer */
const year = document.getElementById("footer-year");
if (year) year.textContent = new Date().getFullYear();

function updatePacificTime() {
  const time = document.getElementById("timezone-display");
  if (!time) return;
  const currentTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date());
  time.textContent = `Eugene · ${currentTime}`;
}

updatePacificTime();
window.setInterval(updatePacificTime, 60_000);
