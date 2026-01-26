document.addEventListener('DOMContentLoaded', () => {

  /* --- HORIZONTAL SCROLL LOGIC --- */
  const container = document.querySelector('.projects-container');
  const stickyView = document.querySelector('.projects-sticky-view');
  const wrapper = document.querySelector('.horizontal-scroll-wrapper');
  const progressBar = document.querySelector('.progress-bar');
  const intro = document.querySelector('.projects-intro');

  // Only run horizontal scroll on Desktop (> 900px)
  let isDesktop = window.innerWidth > 900;

  window.addEventListener('resize', () => {
    isDesktop = window.innerWidth > 900;
    if (!isDesktop) {
      if (wrapper) wrapper.style.transform = 'none';
    }
  });

  function onScroll() {
    if (!isDesktop || !container || !wrapper) return;

    const rect = container.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    const containerHeight = rect.height;

    // Distance scrolled within the container
    // When rect.top is 0, we are at start.
    // When rect.top is -(containerHeight - viewHeight), we are at end.

    let progress = -rect.top / (containerHeight - viewHeight);

    // Clamp 0..1
    progress = Math.max(0, Math.min(1, progress));

    const scrollDist = wrapper.scrollWidth - window.innerWidth;

    // Move wrapper left based on progress
    // We start with some padding-left in CSS, so visual start is handled
    // Actually we want to scroll the entire width of wrapper minus viewport
    // But we can just use a large percentage or pixel value

    // Calculate exact translation needed
    const maxTranslate = -(wrapper.scrollWidth - window.innerWidth + 100); // 100px buffer

    const currentTranslate = maxTranslate * progress;

    wrapper.style.transform = `translateY(-50%) translateX(${currentTranslate}px)`;

    // Update Progress Bar
    if (progressBar) progressBar.style.width = `${progress * 100}%`;

    // Fade out intro
    if (intro) {
      if (progress > 0.1) {
        intro.classList.add('fade-out');
      } else {
        intro.classList.remove('fade-out');
      }
    }
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(onScroll);
  });

  // Initial call
  onScroll();

  /* --- MODAL LOGIC --- */
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body-content');

  // Project Data Mockup
  const projectData = {
    1: {
      title: "Azure Heights Villa",
      img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      category: "Residential luxury",
      problem: "The client requested a modern, sustainable luxury villa on a steep cliffside terrain, requiring creative structural engineering to ensure stability without compromising the ocean view.",
      solution: "We implemented a cantilevered steel foundation system that anchored deep into the bedrock. Using floor-to-ceiling thermal glass, we maximized views while maintaining energy efficiency.",
      result: "An award-winning cliffside residence that serves as a benchmark for sustainable luxury construction in challenging terrains.",
      stack: ["Steel Frame", "Thermal Glass", "Geothermal Heating", "Smart Home OS"]
    },
    2: {
      title: "Nexus Tech Park",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
      category: "Commercial Development",
      problem: "Creating a 50,000 sq ft office complex in a dense urban center with zero downtime allowance for surrounding infrastructure.",
      solution: "Utilized prefabricated modular concrete panels to speed up construction by 40%. Implemented noise-cancellation barriers during construction.",
      result: "Delivered 2 months ahead of schedule. The building is now LEED Platinum certified and houses 3 Fortune 500 companies.",
      stack: ["Prefab Concrete", "Solar Facade", "BMS System", "Fast-Track Build"]
    },
    3: {
      title: "The Skyline Lofts",
      img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      category: "Urban Residential",
      problem: "Revitalizing an abandoned industrial warehouse into premium residential lofts while preserving historical integrity.",
      solution: "Restored original brickwork and integrated exposed steel beams with modern minimalist interiors. Soundproofing was a key focus given the busy location.",
      result: "100% occupancy within 3 months of launch. Won the 'Urban Renewal Award 2025' for best adaptive reuse project.",
      stack: ["Adaptive Reuse", "Acoustic Insulation", "Heritage Restoration", "Mixed Use"]
    },
    4: {
      title: "Alpha Logistics Hub",
      img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
      category: "Industrial Infrastructure",
      problem: "Developing a high-capacity autonomous warehousing facility that supports heavy robotics and 24/7 operations.",
      solution: "Super-flat flooring technology was used for robot mobility. Reinforced roof structure supports massive solar arrays to power the facility.",
      result: "A fully autonomous net-zero logistics hub processing 50k packages daily with 99.9% efficiency.",
      stack: ["Super-flat Floors", "Solar Roofing", "Automated Systems", "Heavy Steel"]
    }
  };

  window.openProject = function (id) {
    if (!modal || !modalBody) return;

    const data = projectData[id];
    if (!data) return;

    // Generate Content
    modalBody.innerHTML = `
        <div class="modal-hero">
          <img src="${data.img}" alt="${data.title}">
        </div>
        <div class="modal-details">
          <h2>${data.title}</h2>
          <div class="meta">${data.category}</div>
          
          <div class="detail-grid">
            <div class="detail-block">
              <h4>The Challenge</h4>
              <p>${data.problem}</p>
            </div>
            <div class="detail-block">
              <h4>The Solution</h4>
              <p>${data.solution}</p>
            </div>
          </div>
          
          <div class="detail-block" style="margin-top: 40px;">
            <h4>The Result</h4>
            <p>${data.result}</p>
          </div>
  
          <div class="detail-block" style="margin-top: 30px;">
             <h4>Technologies & Materials</h4>
             <div class="tech-stack">
               ${data.stack.map(item => `<span class="tech-pill">${item}</span>`).join('')}
             </div>
          </div>
        </div>
      `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  window.closeProject = function () {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Close on click outside
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) window.closeProject();
    });
  }

  // Esc key close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      window.closeProject();
    }
  });
});
