import {
  animate as animateMotion,
  inView as inViewMotion,
  stagger as staggerMotion,
  scroll as scrollMotion,
} from "https://cdn.jsdelivr.net/npm/motion@13.1.1/+esm";

const reduceMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const root = document.documentElement;
const motionEase = [0.23, 1, 0.32, 1];
const activeAnimations = new WeakMap();
const activeControls = new Set();

let stopMotionEffects = [];

root.dataset.motionLibrary = "loaded";

function rememberStopEffect(stopEffect) {
  if (typeof stopEffect === "function") {
    stopMotionEffects.push(stopEffect);
  }
}

function stopActiveAnimation(owner) {
  const animation = activeAnimations.get(owner);
  if (!animation) return;

  if (typeof animation.stop === "function") {
    animation.stop();
  } else if (typeof animation.cancel === "function") {
    animation.cancel();
  }

  activeAnimations.delete(owner);
  activeControls.delete(animation);
}

function animateElement(owner, target, keyframes, options) {
  stopActiveAnimation(owner);

  const animation = animateMotion(target, keyframes, options);
  activeAnimations.set(owner, animation);
  activeControls.add(animation);

  return animation;
}

function getProjectMotionParts(card) {
  return {
    media: card.querySelector(".project-media"),
    content: card.querySelector(".project-content"),
    details: card.querySelectorAll(
      ".project-topline, .project-content h3, .project-content h3 + p, .project-tags, .project-link, .project-status",
    ),
  };
}

function revealProjectCard(card, delay = 0) {
  const { media, content, details } = getProjectMotionParts(card);

  animateElement(
    card,
    card,
    {
      opacity: [null, 1],
      clipPath: [null, "inset(0% 0% 0% 0% round 18px)"],
    },
    {
      duration: 0.68,
      ease: motionEase,
      delay,
    },
  );

  if (media) {
    animateElement(
      media,
      media,
      {
        transform: [
          null,
          "perspective(1100px) translateY(0px) rotateX(0deg) scale(1)",
        ],
      },
      {
        type: "spring",
        duration: 0.82,
        bounce: 0.16,
        delay: delay + 0.04,
      },
    );
  }

  if (content && details.length) {
    animateElement(
      content,
      details,
      {
        opacity: [null, 1],
        transform: [null, "translateY(0px)"],
      },
      {
        duration: 0.48,
        ease: motionEase,
        delay: staggerMotion(0.045, { startDelay: delay + 0.14 }),
      },
    );
  }
}

function resetProjectCard(card) {
  const { media, content, details } = getProjectMotionParts(card);

  animateElement(
    card,
    card,
    {
      opacity: [null, 0],
      clipPath: [null, "inset(0% 0% 100% 0% round 18px)"],
    },
    {
      duration: 0.22,
      ease: motionEase,
    },
  );

  if (media) {
    animateElement(
      media,
      media,
      {
        transform: [
          null,
          "perspective(1100px) translateY(20px) rotateX(7deg) scale(0.96)",
        ],
      },
      {
        duration: 0.18,
        ease: motionEase,
      },
    );
  }

  if (content && details.length) {
    animateElement(
      content,
      details,
      {
        opacity: [null, 0],
        transform: [null, "translateY(16px)"],
      },
      {
        duration: 0.16,
        ease: motionEase,
      },
    );
  }
}

function revealElement(element, delay = 0) {
  if (element.matches(".project-card")) {
    revealProjectCard(element, delay);
    return;
  }

  animateElement(
    element,
    element,
    {
      opacity: [null, 1],
      transform: [null, "translateY(0px)"],
    },
    {
      duration: 0.56,
      ease: motionEase,
      delay,
    },
  );
}

function resetElement(element) {
  if (element.matches(".project-card")) {
    resetProjectCard(element);
    return;
  }

  animateElement(
    element,
    element,
    {
      opacity: [null, 0],
      transform: [null, "translateY(28px)"],
    },
    {
      duration: 0.18,
      ease: motionEase,
    },
  );
}

function tearDownMotion() {
  stopMotionEffects.forEach((stopEffect) => stopEffect());
  stopMotionEffects = [];

  activeControls.forEach((animation) => {
    if (typeof animation.cancel === "function") {
      animation.cancel();
    } else if (typeof animation.stop === "function") {
      animation.stop();
    }
  });

  activeControls.clear();
  root.classList.remove("motion-ready");
  delete root.dataset.motionInitialized;

  document.querySelectorAll("[data-parallax]").forEach((layer) => {
    layer.style.removeProperty("transform");
  });
}

function initializeMotion() {
  if (reduceMotionPreference.matches || root.dataset.motionInitialized === "true") return;

  root.dataset.motionInitialized = "true";
  root.classList.add("motion-ready");

  const hero = document.querySelector(".hero");
  const heroItems = document.querySelectorAll(".hero-reveal");

  if (hero && heroItems.length) {
    rememberStopEffect(
      inViewMotion(
        hero,
        () => {
          animateElement(
            hero,
            heroItems,
            {
              opacity: [null, 1],
              transform: [null, "translateY(0px)"],
            },
            {
              duration: 0.6,
              ease: motionEase,
              delay: staggerMotion(0.075),
            },
          );

          return () => {
            animateElement(
              hero,
              heroItems,
              {
                opacity: [null, 0],
                transform: [null, "translateY(28px)"],
              },
              {
                duration: 0.18,
                ease: motionEase,
              },
            );
          };
        },
        { amount: 0.16, margin: "-5% 0px -8% 0px" },
      ),
    );
  }

  const revealItems = [...document.querySelectorAll(".reveal-item")];
  const revealDelay = new WeakMap();

  document.querySelectorAll(".reveal-group").forEach((group) => {
    const items = group.querySelectorAll(":scope > .reveal-item, :scope > * > .reveal-item");

    items.forEach((item, index) => {
      const delay = item.matches(".project-card") ? (index % 2) * 0.1 : Math.min(index, 2) * 0.06;
      revealDelay.set(item, delay);
    });
  });

  if (revealItems.length) {
    rememberStopEffect(
      inViewMotion(
        revealItems,
        (item) => {
          revealElement(item, revealDelay.get(item) ?? 0);

          return () => resetElement(item);
        },
        { amount: 0.12, margin: "-6% 0px -14% 0px" },
      ),
    );
  }

  document.querySelectorAll(".section-transition").forEach((transition) => {
    const line = transition.querySelector(".section-transition-line");
    const mark = transition.querySelector(".section-transition-mark");
    if (!line || !mark) return;

    rememberStopEffect(
      inViewMotion(
        transition,
        () => {
          animateElement(
            line,
            line,
            { transform: [null, "scaleX(1)"] },
            { duration: 0.62, ease: motionEase },
          );
          animateElement(
            mark,
            mark,
            {
              opacity: [null, 1],
              transform: [null, "translate(-50%, -50%) scale(1)"],
            },
            { duration: 0.34, ease: motionEase, delay: 0.2 },
          );

          return () => {
            animateElement(
              line,
              line,
              { transform: [null, "scaleX(0)"] },
              { duration: 0.18, ease: motionEase },
            );
            animateElement(
              mark,
              mark,
              {
                opacity: [null, 0],
                transform: [null, "translate(-50%, -50%) scale(0.55)"],
              },
              { duration: 0.16, ease: motionEase },
            );
          };
        },
        { amount: 0.72, margin: "-5% 0px -8% 0px" },
      ),
    );
  });

  const timelineFrame = document.querySelector(".timeline-frame");
  const timelineTrackFill = document.querySelector(".timeline-track-fill");

  if (timelineFrame && timelineTrackFill) {
    const timelineNodes = [...timelineFrame.querySelectorAll(".timeline-node")];

    rememberStopEffect(
      inViewMotion(
        timelineFrame,
        () => {
          animateElement(
            timelineTrackFill,
            timelineTrackFill,
            { transform: [null, "scaleY(1)"] },
            { duration: 0.68, ease: motionEase },
          );

          timelineNodes.forEach((node, index) => {
            animateElement(
              node,
              node,
              { opacity: [null, 1], transform: [null, "scale(1)"] },
              { type: "spring", duration: 0.42, bounce: 0.06, delay: 0.08 + index * 0.055 },
            );
          });

          return () => {
            animateElement(
              timelineTrackFill,
              timelineTrackFill,
              { transform: [null, "scaleY(0)"] },
              { duration: 0.2, ease: motionEase },
            );

            timelineNodes.forEach((node) => {
              animateElement(
                node,
                node,
                { opacity: [null, 0.45], transform: [null, "scale(0.88)"] },
                { duration: 0.16, ease: motionEase },
              );
            });
          };
        },
        { amount: 0.12, margin: "-5% 0px -10% 0px" },
      ),
    );
  }

  document.querySelectorAll("[data-parallax]").forEach((layer) => {
    const target = layer.closest(".hero-portrait, .project-media");
    if (!target) return;

    const distance = layer.dataset.parallax === "hero" ? 30 : 22;
    const animation = animateElement(
      layer,
      layer,
      { transform: [`translateY(${-distance}px)`, `translateY(${distance}px)`] },
      { ease: "linear" },
    );

    rememberStopEffect(
      scrollMotion(animation, {
        target,
        offset: ["start end", "end start"],
      }),
    );
  });
}

reduceMotionPreference.addEventListener("change", (event) => {
  if (event.matches) {
    tearDownMotion();
  } else {
    initializeMotion();
  }
});

initializeMotion();
