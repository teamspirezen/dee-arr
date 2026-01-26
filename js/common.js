document.addEventListener('DOMContentLoaded', () => {
    initHeader();
});

// --- HEADER SCROLL & MOBILE MENU ---
function initHeader() {
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu
    const ham = document.querySelector('.hamburger');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const closeBtn = document.querySelector('.close-menu');
    const menuLinks = document.querySelectorAll('.mobile-nav a');

    if (!ham || !menuOverlay) return; // Guard clause if elements missing

    function openMenu() {
        menuOverlay.classList.add('active');
        ham.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuOverlay.classList.remove('active');
        ham.classList.remove('active');
        document.body.style.overflow = '';
    }

    ham.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // Close when clicking outside
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) closeMenu();
    });

    // Close when clicking a link
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}
