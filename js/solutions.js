document.addEventListener('DOMContentLoaded', () => {
    // Reveal elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Select elements to reveal
    const elementsToReveal = document.querySelectorAll('.service-card, .visual-break h2, .section-title, .hz-card');

    elementsToReveal.forEach(el => {
        // Set initial state via JS to ensure they are hidden before observing if CSS didn't catch them
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

/* ===== CURSOR MINI IMAGE PREVIEW ===== */
const cursorPreview = document.querySelector('.cursor-preview');
const previewImg = document.getElementById('preview-img');
const serviceCards = document.querySelectorAll('.service-card[data-img]');

/* Follow the cursor — image appears to the right of cursor */
document.addEventListener('mousemove', (e) => {
    cursorPreview.style.left = '0';
    cursorPreview.style.top = '0';
    cursorPreview.style.transform = `translate(calc(27px + ${e.clientX}px), calc(-50% - 30px + ${e.clientY}px))`;
});

/* Show / hide preview on card hover */
serviceCards.forEach(card => {

    /* ── DESKTOP: mouse events ── */
    card.addEventListener('mouseenter', () => {
        previewImg.src = card.dataset.img;
        cursorPreview.style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
        cursorPreview.style.opacity = '0';
    });

    /* ── MOBILE: image centered on tap, follows finger on drag ── */
    card.addEventListener('touchstart', () => {
        const img = card.querySelector('.card-img');
        if (!img) return;
        /* place at center of card on initial tap */
        img.style.left = '50%';
        img.style.top = '50%';
        img.classList.add('show');
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
        const img = card.querySelector('.card-img');
        if (!img) return;
        const rect = card.getBoundingClientRect();
        const touch = e.touches[0];
        img.style.left = (touch.clientX - rect.left) + 'px';
        img.style.top = (touch.clientY - rect.top) + 'px';
    }, { passive: true });

    card.addEventListener('touchend', () => {
        const img = card.querySelector('.card-img');
        if (img) img.classList.remove('show');
    });

});
