/* ═══════════════════════════════════════════════════
   PEARL — 1 MONTH ANNIVERSARY · Scripts
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initSlideshow();
  initScrollReveal();
  initNavHighlight();
  initMusicPlayer();
  initFloatingHearts();
  initManifestations();
  initLightbox();
});

/* ──────────── HERO SLIDESHOW ──────────── */
function initSlideshow() {
  const slides = document.querySelectorAll('.hero-slideshow .slide');
  if (slides.length === 0) return;

  let current = 0;
  const INTERVAL = 4000; // change photo every 4 seconds

  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, INTERVAL);
}

/* ──────────── SCROLL REVEAL ──────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ──────────── ACTIVE NAV LINK ──────────── */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((l) => l.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ──────────── MUSIC PLAYER (YouTube Shuffled Playlist) ──────────── */
function initMusicPlayer() {
  const btn = document.getElementById('musicToggle');
  const label = document.getElementById('musicLabel');
  let playing = false;
  let player = null;
  let playerReady = false;

  // YouTube video IDs — shuffled on load
  const songs = ['u9raS7-NisU', '-BjZmE2gtdo', 'FNEoPctNIUE'];
  for (let i = songs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [songs[i], songs[j]] = [songs[j], songs[i]];
  }
  let currentIndex = 0;

  // Create YouTube player when API is ready
  function createPlayer() {
    player = new YT.Player('ytPlayer', {
      height: '1',
      width: '1',
      videoId: songs[0],
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1
      },
      events: {
        onReady: () => { playerReady = true; },
        onStateChange: (event) => {
          // When a video ends, play the next one
          if (event.data === YT.PlayerState.ENDED) {
            currentIndex = (currentIndex + 1) % songs.length;
            player.loadVideoById(songs[currentIndex]);
            label.textContent = `Now playing (${currentIndex + 1}/${songs.length}) 🎵`;
          }
        }
      }
    });
  }

  // YouTube API calls onYouTubeIframeAPIReady globally
  if (window.YT && window.YT.Player) {
    createPlayer();
  } else {
    window.onYouTubeIframeAPIReady = createPlayer;
  }

  btn.addEventListener('click', () => {
    if (!playerReady) {
      label.textContent = 'Loading music… try again 🎵';
      return;
    }
    if (playing) {
      player.pauseVideo();
      btn.classList.remove('playing');
      label.textContent = 'Taylor Swift — Click to play 🎶';
    } else {
      player.playVideo();
      btn.classList.add('playing');
      label.textContent = `Now playing (${currentIndex + 1}/${songs.length}) 🎵`;
    }
    playing = !playing;
  });
}

/* ──────────── FLOATING HEARTS ──────────── */
function initFloatingHearts() {
  const canvas = document.getElementById('heartsCanvas');
  const ctx = canvas.getContext('2d');
  let hearts = [];
  const MAX_HEARTS = 18;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Heart {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = Math.random() * 14 + 8;
      this.speed = Math.random() * 0.6 + 0.3;
      this.opacity = Math.random() * 0.35 + 0.1;
      this.drift = (Math.random() - 0.5) * 0.4;
      this.wobbleAmp = Math.random() * 20 + 10;
      this.wobbleSpeed = Math.random() * 0.02 + 0.01;
      this.phase = Math.random() * Math.PI * 2;
    }
    update() {
      this.y -= this.speed;
      this.phase += this.wobbleSpeed;
      this.x += Math.sin(this.phase) * 0.4 + this.drift;
      if (this.y < -30) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.fillStyle = `hsl(${340 + Math.random() * 20}, 90%, 72%)`;
      ctx.beginPath();
      const s = this.size;
      ctx.moveTo(0, s * 0.35);
      ctx.bezierCurveTo(-s * 0.5, -s * 0.2, -s, s * 0.1, 0, s);
      ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.2, 0, s * 0.35);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < MAX_HEARTS; i++) {
    const h = new Heart();
    h.y = Math.random() * canvas.height; // spread initially
    hearts.push(h);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach((h) => {
      h.update();
      h.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ──────────── MANIFESTATIONS · Press Enter to Reveal ──────────── */
function initManifestations() {
  const items = document.querySelectorAll('.manifest-item');
  const prompt = document.getElementById('manifestPrompt');
  const counter = document.getElementById('manifestCounter');
  const section = document.getElementById('manifestations');
  const intimateSection = document.getElementById('intimateSection');
  const intimateTrigger = document.getElementById('intimateTrigger');
  const intimateCards = document.getElementById('intimateCards');
  if (!items.length) return;

  let revealed = 0;
  const total = items.length;

  // Assign numbered badges (skip finale)
  items.forEach((item, i) => {
    if (!item.classList.contains('manifest-finale')) {
      item.setAttribute('data-num', i + 1);
    }
  });

  function updateCounter() {
    if (revealed > 0 && revealed < total) {
      counter.textContent = `${revealed} of ${total} revealed`;
    } else if (revealed >= total) {
      counter.textContent = 'All manifestations revealed 💕';
    }
  }

  function revealNext() {
    if (revealed >= total) return;

    const item = items[revealed];
    item.style.display = 'flex'; // make it render in DOM
    // Force reflow so the transition actually fires
    void item.offsetWidth;
    item.classList.add('shown');
    revealed++;
    updateCounter();

    // Scroll the new item into view smoothly
    setTimeout(() => {
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    // Hide prompt & show intimate section when all revealed
    if (revealed >= total) {
      prompt.classList.add('done');
      // Show the "one more thing" button after a short delay
      setTimeout(() => {
        intimateSection.classList.add('visible');
        intimateSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 800);
    }
  }

  // Intimate trigger button
  intimateTrigger.addEventListener('click', () => {
    intimateTrigger.classList.add('hidden');
    intimateCards.classList.add('visible');
    setTimeout(() => {
      intimateCards.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  });

  // Check if the manifestations section is in view
  function isSectionInView() {
    const rect = section.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  // Listen for Enter key (only when section is in view)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && isSectionInView()) {
      e.preventDefault();
      revealNext();
    }
  });

  // Listen for click/tap on the prompt
  prompt.addEventListener('click', () => {
    revealNext();
  });
}

/* ──────────── LIGHTBOX ──────────── */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const memoryImages = document.querySelectorAll('.memory-img-wrap img');

  memoryImages.forEach((img) => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
    });
  });

  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      lightbox.classList.remove('active');
    }
  });
}
