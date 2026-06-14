const views = document.querySelectorAll(".page-view");
const handBtn = document.getElementById("hand-btn");
const handCardsEl = document.getElementById("hand-cards");

const pages = {
  about: { title: "Aydan Martin" },
  education: { title: "Education — Aydan Martin" },
};

let currentPage = null;

const SUITS = ["spades", "hearts", "diamonds", "clubs"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUIT_SYMBOL = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};
const RANK_NAMES = {
  A: "Ace",
  J: "Jack",
  Q: "Queen",
  K: "King",
};

let handDealing = false;

function createDeck() {
  return SUITS.flatMap((suit) => RANKS.map((rank) => ({ rank, suit })));
}

function shuffleDeck(deck) {
  const copy = [...deck];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function dealTwoCards() {
  return shuffleDeck(createDeck()).slice(0, 2);
}

function formatCardName({ rank, suit }) {
  const rankName = RANK_NAMES[rank] || rank;
  return `${rankName} of ${suit}`;
}

function renderCard({ rank, suit }) {
  const card = document.createElement("span");
  card.className = "playing-card";
  card.dataset.rank = rank;
  card.dataset.suit = suit;

  const rankEl = document.createElement("span");
  rankEl.className = "card-rank";
  rankEl.textContent = rank;

  const suitEl = document.createElement("span");
  suitEl.className = "card-suit";
  suitEl.textContent = SUIT_SYMBOL[suit];

  card.append(rankEl, suitEl);
  return card;
}

function updateHandLabel(cards) {
  if (!handBtn) return;

  const names = cards.map(formatCardName).join(", ");
  handBtn.setAttribute("aria-label", `${names}. Deal new hand`);
}

function dealHand({ animate = true } = {}) {
  if (handDealing || !handCardsEl || !handBtn) return;
  handDealing = true;

  const cards = dealTwoCards();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shouldAnimate = animate && !prefersReducedMotion;

  handCardsEl.replaceChildren(...cards.map(renderCard));
  updateHandLabel(cards);

  if (!shouldAnimate) {
    handDealing = false;
    return;
  }

  handCardsEl.classList.remove("is-dealing");
  void handCardsEl.offsetWidth;
  handCardsEl.classList.add("is-dealing");

  window.setTimeout(() => {
    handCardsEl.classList.remove("is-dealing");
    handDealing = false;
  }, 450);
}

if (handBtn) {
  handBtn.addEventListener("click", () => dealHand({ animate: true }));
}

dealHand({ animate: true });

/* Light mode — kept for later; no toggle in UI while disabled. */
const LIGHT_MODE_ENABLED = false;

function initTheme() {
  if (!LIGHT_MODE_ENABLED) return;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

function toggleTheme() {
  if (!LIGHT_MODE_ENABLED) return;

  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  if (isLight) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("theme");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
}

initTheme();

function updateClock() {
  const footerClock = document.getElementById("footer-clock");
  if (!footerClock || footerClock.dataset.rainbowWrapped) return;

  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date());

  footerClock.textContent = `${formatted}.`;
}

window.updateClock = updateClock;

updateClock();
setInterval(updateClock, 1000);

function showPage(pageKey) {
  if (!pages[pageKey] || pageKey === currentPage) return;

  views.forEach((view) => {
    const active = view.dataset.page === pageKey;
    view.classList.toggle("is-active", active);
    view.hidden = !active;
  });

  document.title = pages[pageKey].title;
  currentPage = pageKey;
}

document.querySelectorAll("[data-page]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(link.dataset.page);
  });
});

showPage("about");

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

let copyTooltipHideTimer = null;
let copyTooltipExitTimer = null;

function hideCopyTooltip(target) {
  target.classList.add("is-leaving");

  if (copyTooltipExitTimer) {
    window.clearTimeout(copyTooltipExitTimer);
  }

  copyTooltipExitTimer = window.setTimeout(() => {
    target.classList.remove("is-copied", "is-leaving");
    copyTooltipExitTimer = null;
  }, 150);
}

function handleEmailCopy(event) {
  const target = event.target.closest(".email-copy-btn");
  if (!target) return;

  event.preventDefault();
  event.stopPropagation();

  if (copyTooltipHideTimer) {
    window.clearTimeout(copyTooltipHideTimer);
    copyTooltipHideTimer = null;
  }

  if (copyTooltipExitTimer) {
    window.clearTimeout(copyTooltipExitTimer);
    copyTooltipExitTimer = null;
  }

  target.classList.remove("is-leaving");

  copyText("aydan.martin@usc.edu");
  target.classList.add("is-copied");

  copyTooltipHideTimer = window.setTimeout(() => {
    hideCopyTooltip(target);
    copyTooltipHideTimer = null;
  }, 1500);
}

document.addEventListener("click", handleEmailCopy);
