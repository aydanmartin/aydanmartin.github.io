(function () {
  const trigger = document.getElementById("photo-trigger");
  if (!trigger) return;

  const shell = document.getElementById("page-shell");
  if (!shell) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scatterWindow = prefersReducedMotion ? 0.55 : 1.35;
  const pulseDuration = prefersReducedMotion ? 0.55 : 1.05;
  const totalDuration = (scatterWindow + pulseDuration) * 1000;

  const textSelector =
    ".site-name, .site-nav a, .nav-sep, .section-title, .about-text p, .about-links a, .link-sep, .footer-copy, .footer-location, .footer-clock";

  const unitSelector = ".theme-toggle, .social-icon";

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

  function wrapAllText() {
    shell.querySelectorAll(textSelector).forEach(wrapTextElement);
  }

  function unwrapAllText() {
    shell.querySelectorAll(textSelector).forEach(unwrapTextElement);
  }

  function applyRandomDelays() {
    const chars = shell.querySelectorAll(".rainbow-char");
    chars.forEach((char) => {
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

  trigger.addEventListener("click", () => {
    if (active) return;
    active = true;

    wrapAllText();
    applyRandomDelays();

    shell.classList.remove("is-rainbow-flush");
    void shell.offsetWidth;
    shell.classList.add("is-rainbow-flush");
    shell.style.setProperty("--rainbow-pulse", `${pulseDuration}s`);

    setTimeout(() => {
      shell.classList.remove("is-rainbow-flush");
      shell.style.removeProperty("--rainbow-pulse");
      clearDelays();
      unwrapAllText();
      active = false;
    }, totalDuration);
  });
})();
