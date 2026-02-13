// ---------- Surprise modal + hearts burst ----------
const surpriseBtn = document.getElementById("surpriseBtn");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModalBtn");
const confettiBtn = document.getElementById("confettiBtn");

function openModal() {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  burstHearts(18);
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

surpriseBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

// click outside to close
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

confettiBtn.addEventListener("click", () => burstHearts(28));

function burstHearts(count = 16) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "burst-heart";
    heart.textContent = Math.random() > 0.5 ? "💖" : "💗";

    const x = (window.innerWidth / 2) + rand(-120, 120);
    const y = (window.innerHeight / 2) + rand(-80, 80);

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.transform = `translate(-50%, -50%) scale(${rand(0.8, 1.4)})`;

    document.body.appendChild(heart);

    const dx = rand(-220, 220);
    const dy = rand(-260, -120);
    const rot = rand(-40, 40);

    heart.animate(
      [
        { transform: `translate(-50%, -50%) scale(1) rotate(0deg)`, opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.9) rotate(${rot}deg)`, opacity: 0 }
      ],
      { duration: rand(900, 1400), easing: "cubic-bezier(.2,.8,.2,1)" }
    );

    setTimeout(() => heart.remove(), 1500);
  }
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// Inject styles for burst hearts (keeps CSS file simpler)
const style = document.createElement("style");
style.textContent = `
  .burst-heart{
    position: fixed;
    z-index: 60;
    font-size: 22px;
    pointer-events: none;
    filter: drop-shadow(0 14px 18px rgba(0,0,0,.15));
  }
`;
document.head.appendChild(style);

// ---------- Simple audio player ----------
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");
const timeText = document.getElementById("timeText");
const songTitle = document.getElementById("songTitle");

// Optional: change displayed title
songTitle.textContent = "Your Favorite Song";

let isSeeking = false;

playBtn.addEventListener("click", async () => {
  if (!audio.src) return;

  if (audio.paused) {
    try { await audio.play(); } catch (e) {}
  } else {
    audio.pause();
  }
  syncPlayIcon();
});

audio.addEventListener("play", syncPlayIcon);
audio.addEventListener("pause", syncPlayIcon);

audio.addEventListener("loadedmetadata", () => {
  updateTime();
});

audio.addEventListener("timeupdate", () => {
  if (isSeeking) return;
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  progress.value = String(pct);
  updateTime();
});

progress.addEventListener("input", () => {
  isSeeking = true;
});

progress.addEventListener("change", () => {
  if (!audio.duration) return;
  const pct = Number(progress.value) / 100;
  audio.currentTime = pct * audio.duration;
  isSeeking = false;
});

function syncPlayIcon() {
  playBtn.textContent = audio.paused ? "▶" : "❚❚";
}

function updateTime() {
  const cur = formatTime(audio.currentTime || 0);
  const dur = formatTime(audio.duration || 0);
  timeText.textContent = `${cur} / ${dur}`;
}

function formatTime(seconds) {
  const s = Math.floor(seconds % 60);
  const m = Math.floor(seconds / 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Like buttons (tiny interaction)
document.getElementById("likeBtn").addEventListener("click", () => burstHearts(10));
document.getElementById("heartOutlineBtn").addEventListener("click", () => burstHearts(10));
