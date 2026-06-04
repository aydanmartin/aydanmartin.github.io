const themeToggle = document.getElementById("theme-toggle");
const footerClock = document.getElementById("footer-clock");
const footerTime = document.getElementById("footer-time");

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
}

themeToggle.addEventListener("click", () => {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const next = isLight ? "dark" : "light";
  if (next === "dark") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("theme");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
});

function updateClock() {
  const now = new Date();
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);

  const timeText = `${formatted}.`;

  if (footerClock) {
    if (footerClock.dataset.rainbowWrapped) return;
    footerClock.textContent = timeText;
    return;
  }

  if (footerTime) {
    if (footerTime.dataset.rainbowWrapped) return;
    footerTime.textContent = `Los Angeles, CA. ${timeText}`;
  }
}

updateClock();
setInterval(updateClock, 1000);
