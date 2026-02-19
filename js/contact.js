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

// PLACEHOLDER: User needs to replace this URL after deploying the Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyMNW8OmYXxYvmmXiLkWBxx6ov1bTxU6aHMBqTokaCruv1uIq21lsJ7EP-spxV-ZFNhVg/exec";

form.addEventListener("submit", e => {
  e.preventDefault();

  message.textContent = "Submitting...";
  message.style.color = "#fff";

  fetch(SCRIPT_URL, {
    method: "POST",
    body: new FormData(form),
  })
    .then(response => {
      if (response.ok) {
        // Show Modal
        const modal = document.getElementById('successModal');
        const closeBtn = document.getElementById('closeModalBtn');

        modal.classList.add('active');

        // Close modal logic
        closeBtn.onclick = () => modal.classList.remove('active');
        window.onclick = (e) => {
          if (e.target === modal) modal.classList.remove('active');
        };

        form.reset();
        message.textContent = "";
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .catch(error => {
      console.error('Error!', error.message);
      message.textContent = "Something went wrong. Please try again later.";
      message.style.color = "#ff4d4d"; // Error color
    });
});
