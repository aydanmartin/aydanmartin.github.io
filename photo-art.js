(function () {
  const shell = document.getElementById("page-shell");
  if (!shell) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timing = {
    scatter: prefersReducedMotion ? 0.55 : 1.35,
    pulse: prefersReducedMotion ? 0.55 : 1.05,
  };

  const textSelector =
    ".site-name, .site-nav a, .nav-sep, .section-title, .about-text p, .about-links a, .link-sep, .footer-updated, .footer-clock";

  const unitSelector = ".social-icon, .email-copy-btn";

  let active = false;

  function wrapTextElement(el) {
    if (el.dataset.rainbowWrapped) return;

    const text = el.textContent;
    if (!text.trim()) return;

    el.dataset.rainbowOriginal = el.innerHTML;
    el.textContent = "";

    for (const char of text) {
      if (char === " " || char === "\n" || char === "\t") {
        el.appendChild(document.createTextNode(char === "\n" ? " " : char));
        continue;
      }

      const span = document.createElement("span");
      span.className = "rainbow-char";
      span.textContent = char;
      el.appendChild(span);
    }

    el.dataset.rainbowWrapped = "true";
  }

  function unwrapTextElement(el) {
    if (!el.dataset.rainbowOriginal) return;
    el.innerHTML = el.dataset.rainbowOriginal;
    delete el.dataset.rainbowOriginal;
    delete el.dataset.rainbowWrapped;
  }

  function isInActiveView(el) {
    const view = el.closest(".page-view");
    return view && view.classList.contains("is-active");
  }

  function wrapAllText() {
    shell.querySelectorAll(textSelector).forEach((el) => {
      if (!isInActiveView(el)) return;
      wrapTextElement(el);
    });
  }

  function unwrapAllText() {
    shell.querySelectorAll(textSelector).forEach(unwrapTextElement);
  }

  function applyRandomDelays(scatterWindow) {
    shell.querySelectorAll(".rainbow-char").forEach((char) => {
      char.style.setProperty("--rainbow-delay", `${Math.random() * scatterWindow}s`);
    });

    shell.querySelectorAll(unitSelector).forEach((el) => {
      el.classList.add("rainbow-unit");
      el.style.setProperty("--rainbow-delay", `${Math.random() * scatterWindow}s`);
    });
  }

  function clearDelays() {
    shell.querySelectorAll(".rainbow-char").forEach((char) => {
      char.style.removeProperty("--rainbow-delay");
    });

    shell.querySelectorAll(".rainbow-unit").forEach((el) => {
      el.classList.remove("rainbow-unit");
      el.style.removeProperty("--rainbow-delay");
    });
  }

  function finishRainbowEffect() {
    shell.classList.remove("is-rainbow-flush");
    shell.style.removeProperty("--rainbow-pulse");
    clearDelays();
    unwrapAllText();
    active = false;
    if (window.updateClock) window.updateClock();
  }

  function runRainbowEffect() {
    if (active) return;
    active = true;

    const { scatter, pulse } = timing;
    const totalDuration = (scatter + pulse) * 1000;

    wrapAllText();
    applyRandomDelays(scatter);

    shell.classList.remove("is-rainbow-flush");
    void shell.offsetWidth;
    shell.classList.add("is-rainbow-flush");
    shell.style.setProperty("--rainbow-pulse", `${pulse}s`);

    setTimeout(finishRainbowEffect, totalDuration);
  }

  function bindTrigger() {
    const trigger = document.getElementById("photo-trigger");
    if (!trigger || trigger.dataset.rainbowBound) return;

    trigger.dataset.rainbowBound = "true";
    trigger.addEventListener("click", runRainbowEffect);
  }

  bindTrigger();
})();
