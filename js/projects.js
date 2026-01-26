// Scroll reveal for project cards
const cards = document.querySelectorAll(".project-card");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

cards.forEach(card => observer.observe(card));
