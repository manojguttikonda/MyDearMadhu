document.addEventListener('DOMContentLoaded', () => {
  // 1. Typewriter Effect
  const words = [
    "Happy Birthday, my beautiful Madhu!",
    "Manoj & Madhu: A cab ride that changed everything.",
    "No distance can separate us, Madhu.",
    "You make my world so much brighter, my love."
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typewriterSpan = document.getElementById('typewriter-text');
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenWords = 2500;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typewriterSpan.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterSpan.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(type, delayBetweenWords);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, 500);
    } else {
      setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
    }
  }
  
  if (typewriterSpan) {
    type();
  }

  // 2. Floating Heart Particle Generator (Hero Background)
  const heartsContainer = document.getElementById('heart-particles');
  const maxHearts = 20;

  function createHeart() {
    if (!heartsContainer) return;
    
    // SVG path of a standard heart
    const heartSvg = `
      <svg class="heart-particle" viewBox="0 0 24 24" width="${Math.random() * 20 + 10}" height="auto">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = heartSvg.trim();
    const heartNode = wrapper.firstChild;

    // Randomize properties
    const startLeft = Math.random() * 100; // start horizontal position
    const sizeMultiplier = Math.random() * 0.6 + 0.6; // random size
    const duration = Math.random() * 4 + 5; // float duration (5-9s)
    const delay = Math.random() * 2; // delay start

    heartNode.style.left = `${startLeft}%`;
    heartNode.style.animationDuration = `${duration}s`;
    heartNode.style.animationDelay = `${delay}s`;
    heartNode.style.transform = `scale(${sizeMultiplier})`;
    
    // HSL pink colors
    const hue = Math.floor(Math.random() * 20) + 340; // 340 to 360 (romantic pinks/reds)
    const lightness = Math.floor(Math.random() * 20) + 60; // 60% to 80%
    heartNode.style.color = `hsl(${hue}, 85%, ${lightness}%)`;

    heartsContainer.appendChild(heartNode);

    // Remove particle after animation ends
    setTimeout(() => {
      if (heartNode && heartNode.parentNode) {
        heartNode.parentNode.removeChild(heartNode);
      }
    }, (duration + delay) * 1000);
  }

  // Seed initial hearts
  if (heartsContainer) {
    for (let i = 0; i < maxHearts; i++) {
      createHeart();
    }
    // Continuously generate hearts
    setInterval(createHeart, 800);
  }

  // 3. Scroll Reveal Handler (Fade in elements on scroll)
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Keep observing in case we want re-entrance, or unobserve for one-time load
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  reveals.forEach(reveal => revealObserver.observe(reveal));

  // 4. Click Heart Sparks (Add decorative exploding hearts when user clicks)
  document.body.addEventListener('click', (e) => {
    // Avoid spawning when clicking interactive buttons
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.envelope-wrapper')) {
      return;
    }

    const clickHeart = document.createElement('div');
    clickHeart.classList.add('click-heart');
    clickHeart.innerHTML = '❤';
    clickHeart.style.left = `${e.clientX}px`;
    clickHeart.style.top = `${e.clientY + window.scrollY}px`;

    // Random hue
    const hue = Math.floor(Math.random() * 30) + 335;
    clickHeart.style.color = `hsl(${hue}, 90%, 65%)`;

    document.body.appendChild(clickHeart);

    setTimeout(() => {
      if (clickHeart && clickHeart.parentNode) {
        clickHeart.parentNode.removeChild(clickHeart);
      }
    }, 800);
  });

  // 5. Envelope Opening Interaction
  const envelope = document.getElementById('envelope-wrapper');
  if (envelope) {
    envelope.addEventListener('click', (e) => {
      // Toggle open state
      envelope.classList.toggle('open');
      
      // If envelope is opened, play a cute little burst of hearts
      if (envelope.classList.contains('open')) {
        spawnBurstHearts(envelope);
      }
    });
  }

  function spawnBurstHearts(target) {
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + window.scrollY;

    for (let i = 0; i < 8; i++) {
      const burstHeart = document.createElement('div');
      burstHeart.classList.add('click-heart');
      burstHeart.innerHTML = '♥';
      burstHeart.style.left = `${centerX}px`;
      burstHeart.style.top = `${centerY}px`;

      // Set random movement directions
      const angle = (i / 8) * Math.PI * 2;
      const velocity = Math.random() * 80 + 40;
      const xDiff = Math.cos(angle) * velocity;
      const yDiff = Math.sin(angle) * velocity - 50; // shift upwards

      burstHeart.style.setProperty('--x', `${xDiff}px`);
      burstHeart.style.setProperty('--y', `${yDiff}px`);
      
      // Inject inline animation for directional burst
      burstHeart.style.animation = 'none';
      burstHeart.offsetHeight; // Reflow
      
      const uniqueAnimName = `burst-${Math.random().toString(36).substr(2, 9)}`;
      const keyframes = `
        @keyframes ${uniqueAnimName} {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
          100% { transform: translate(calc(-50% + ${xDiff}px), calc(-50% + ${yDiff}px)) scale(1.3); opacity: 0; }
        }
      `;
      
      const styleSheet = document.createElement('style');
      styleSheet.innerHTML = keyframes;
      document.head.appendChild(styleSheet);
      
      burstHeart.style.animation = `${uniqueAnimName} 1s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`;

      document.body.appendChild(burstHeart);

      setTimeout(() => {
        burstHeart.remove();
        styleSheet.remove();
      }, 1000);
    }
  }

  // 6. Background Music — Innerbloom by Rufus Du Sol (starts at exactly 5:46)
  const bgMusic   = document.getElementById('bg-music');
  const musicBtn  = document.getElementById('music-btn');
  const musicIcon = document.getElementById('music-icon');
  const musicWave = document.getElementById('music-wave');
  const enterBtn  = document.getElementById('enter-btn');

  const START_TIME = 346; // 5 min 46 sec
  let firstPlay = true;  // track if music has ever been started

  function setPlayingUI(playing) {
    if (musicIcon) musicIcon.textContent = playing ? '⏸' : '▶';
    if (musicWave) musicWave.classList.toggle('playing', playing);
  }

  function doPlay() {
    bgMusic.play()
      .then(() => setPlayingUI(true))
      .catch(err => console.warn('Audio play blocked:', err));
  }

  function playMusic() {
    if (!bgMusic) return;

    if (firstPlay) {
      firstPlay = false;
      // Force seek to 5:46 then play
      const seekAndPlay = () => {
        bgMusic.currentTime = START_TIME;
        // Wait for seeked event to confirm position, then play
        bgMusic.addEventListener('seeked', doPlay, { once: true });
      };

      if (bgMusic.readyState >= 3) {
        // Audio already ready — seek straight away
        seekAndPlay();
      } else {
        // Wait until audio is ready to be played
        bgMusic.addEventListener('canplay', seekAndPlay, { once: true });
        bgMusic.load(); // kick off loading if not started
      }
    } else {
      // Resume from paused position (user paused mid-song)
      doPlay();
    }
  }

  function pauseMusic() {
    if (!bgMusic) return;
    bgMusic.pause();
    setPlayingUI(false);
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      bgMusic.paused ? playMusic() : pauseMusic();
    });
  }

  // Auto-start when she clicks "Enter Our Story"
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      setTimeout(playMusic, 400);
    });
  }
});

// Remove any leftover YouTube API global (cleanup)
window.onYouTubeIframeAPIReady = undefined;
