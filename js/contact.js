/* Reveal Animation */
const revealItems = document.querySelectorAll(".reveal");

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

revealItems.forEach(item => observer.observe(item));

/* Form Feedback */
const form = document.getElementById("contactForm");
const message = document.querySelector(".form-message");

form.addEventListener("submit", e => {
  e.preventDefault();
  message.textContent = "Thank you! We’ll contact you shortly.";
  message.style.color = "#f5c400";
  form.reset();
});

