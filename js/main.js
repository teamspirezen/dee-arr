document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initScrollAnimations();
  initHeader();
  initCounters();
});

// --- LOADER LOGIC ---
function initLoader() {
  const loader = document.getElementById('loader');
  const visited = localStorage.getItem('visited');

  if (visited) {
    loader.style.display = 'none';
  } else {
    setTimeout(() => {
      loader.classList.add('fade-out');
      localStorage.setItem('visited', 'true');
    }, 2500); // 2.5s simulated load
  }
}

// --- HEADER SCROLL ---
function initHeader() {
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu
  const ham = document.querySelector('.hamburger');
  // Simple toggle for now, in a real app would be a full overlay
  ham.addEventListener('click', () => {
    // toggle menu logic here if needed
    alert('Mobile menu toggle - Implemented in full version');
  });
}

// --- SCROLL ANIMATIONS (INTERSECTION OBSERVER) ---
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: stop observing once visible
        // observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-text, .intro-image, .step-card, .project-row').forEach(el => {
    el.classList.add('reveal-text'); // reused class for fade-up
    observer.observe(el);
  });
  
  // Parallax Hero
  const heroBg = document.querySelector('.hero-bg');
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if(scroll < window.innerHeight) {
        heroBg.style.transform = `scale(1.1) translateY(${scroll * 0.5}px)`;
    }
  });
}

// --- COUNTER DATA SIMULATION ---
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  // Simple increment logic when visible could be added here
}
