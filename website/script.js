// The Imaginatorium Website Script

// Logo file names (in order)
const logoFiles = [
    'The Imaginatorium Logo 1.jpg',
    'The Imaginatorium Logo 2.jpg',
    'The Imaginatorium Logo 3.jpg',
    'The Imaginatorium Logo 4.jpg',
    'The Imaginatorium Logo 5.jpg',
    'The Imaginatorium Logo 6.jpg',
    'The Imaginatorium Logo 7.jpg',
    'The Imaginatorium Logo 8.jpg',
    'The Imaginatorium Logo 9.jpg',
    'The Imaginatorium Logo 10.jpg'
];

// Shuffle array function
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize logo carousel
function initLogoCarousel() {
    const carousel = document.getElementById('logoCarousel');
    if (!carousel) return;

    // Shuffle logos for random initial order
    const shuffledLogos = shuffleArray(logoFiles);
    
    // Create image elements
    shuffledLogos.forEach((logoFile, index) => {
        const img = document.createElement('img');
        img.src = `assets/logos/${logoFile}`;
        img.alt = 'The Imaginatorium Logo';
        img.classList.add('logo-img');
        
        // First logo is visible
        if (index === 0) {
            img.classList.add('active', 'pulsing');
        }
        
        carousel.appendChild(img);
    });

    // Start rotation
    let currentIndex = 0;
    const images = carousel.querySelectorAll('img');
    
    function rotateLogo() {
        // Remove active class from current
        images[currentIndex].classList.remove('active', 'pulsing');
        
        // Pick random next logo (not the current one)
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * images.length);
        } while (nextIndex === currentIndex && images.length > 1);
        
        // Add active class to next
        images[nextIndex].classList.add('active', 'pulsing');
        currentIndex = nextIndex;
    }
    
    // Rotate every 2-3.5 seconds
    function scheduleNextRotation() {
        const delay = Math.random() * 1500 + 2000; // 2000-3500ms
        setTimeout(() => {
            rotateLogo();
            scheduleNextRotation();
        }, delay);
    }
    
    scheduleNextRotation();
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initLogoCarousel();
    initSmoothScroll();
});

