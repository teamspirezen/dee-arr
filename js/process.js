document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('process-track');
    const intro = document.querySelector('.process-intro');
    const steps = document.querySelectorAll('.process-step');
    const progressBar = document.querySelector('.progress-bar-fill');

    if (!track || !steps.length) return;

    const totalSteps = steps.length;

    function update() {
        const rect = track.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const trackHeight = rect.height;

        // Calculate progress 0 to 1 within the track
        // Logic: 
        // 0 = Track top at Viewport top
        // 1 = Track bottom at Viewport bottom (scrolled past)
        // Actually, we want sticky behavior to last while track is traversing.
        // Progress = distance scrolled relative to available scrollable height (trackHeight - viewHeight)

        let progress = -rect.top / (trackHeight - viewHeight);

        // Clamp progress
        // We allow a bit of overflow for smoother entry/exit interactions if needed, 
        // but for step calculation we clamp.
        let clampedProgress = Math.max(0, Math.min(1, progress));

        // Update Progress Bar
        if (progressBar) {
            progressBar.style.width = `${clampedProgress * 100}%`;
        }

        // Intro Logic
        // Visible in the first 5% of scroll
        if (intro) {
            if (clampedProgress > 0.05) {
                intro.classList.add('hidden');
            } else {
                intro.classList.remove('hidden');
            }
        }

        // Step Logic
        // We map the remaining 95% of scroll to the 5 steps.
        const startThreshold = 0.05;
        const availableProgress = 1 - startThreshold;

        // Normalized progress for steps (0 to 1)
        let stepProgress = (clampedProgress - startThreshold) / availableProgress;

        // If we are in the intro zone, treat stepProgress as 0 (or -1)
        if (clampedProgress <= startThreshold) {
            // All steps waiting
            steps.forEach(step => {
                step.classList.remove('prev', 'active');
                step.classList.add('next');
            });
            return;
        }

        // Determine active index
        // Map 0..1 to 0..totalSteps (exclusive of max)
        let activeIndex = Math.floor(stepProgress * totalSteps);

        // Safety clamp
        if (activeIndex >= totalSteps) activeIndex = totalSteps - 1;
        if (activeIndex < 0) activeIndex = 0;

        steps.forEach((step, index) => {
            // Reset classes
            step.classList.remove('active', 'prev', 'next');

            if (index === activeIndex) {
                step.classList.add('active');
            } else if (index < activeIndex) {
                step.classList.add('prev'); // Passed steps
            } else {
                step.classList.add('next'); // Upcoming steps
            }
        });
    }

    // Listen to scroll
    window.addEventListener('scroll', () => {
        requestAnimationFrame(update);
    });

    // Also run on resize to recalculate heights if needed
    window.addEventListener('resize', update);

    // Initial run
    update();
});
