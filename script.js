/* ============================================
   PORTFOLIO INTERACTIVITY
   ============================================ */

// Wait for the page to fully load before running scripts
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ============================================
    // This makes clicking on links scroll smoothly instead of jumping
    
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default if it's an anchor link (starts with #)
            if (href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ============================================
    // PROJECT ITEM INTERACTIONS
    // ============================================
    // Adds hover effects and prepares for future project page links
    
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach(item => {
        // Add a subtle animation on hover
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
        
        // Make project items clickable (ready for future project pages)
        item.addEventListener('click', function() {
            const projectTitle = this.querySelector('.project-title').textContent;
            console.log('Project clicked:', projectTitle);
            // TODO: Add navigation to project detail pages
            // window.location.href = `/projects/${projectTitle.toLowerCase().replace(/\s+/g, '-')}`;
        });
    });

    // ============================================
    // EYE GRAPHICS ANIMATION
    // ============================================
    // Makes the eyes follow mouse movement (subtle effect)
    
    const eyes = document.querySelectorAll('.eye');
    let mouseX = 0;
    let mouseY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateEyePosition();
    });
    
    function updateEyePosition() {
        eyes.forEach(eye => {
            const rect = eye.getBoundingClientRect();
            const eyeCenterX = rect.left + rect.width / 2;
            const eyeCenterY = rect.top + rect.height / 2;
            
            // Calculate distance from mouse to eye center
            const deltaX = mouseX - eyeCenterX;
            const deltaY = mouseY - eyeCenterY;
            
            // Limit movement to stay within eye bounds
            const maxMove = 35; // Maximum pixels the pupil can move (increased for more dramatic effect)
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const moveDistance = Math.min(distance, maxMove);
            
            // Calculate angle and new position
            const angle = Math.atan2(deltaY, deltaX);
            const moveX = Math.cos(angle) * moveDistance;
            const moveY = Math.sin(angle) * moveDistance;
            
            // Update pupil position
            const pupil = eye.querySelector('::after') || eye;
            eye.style.setProperty('--pupil-x', `${moveX}px`);
            eye.style.setProperty('--pupil-y', `${moveY}px`);
        });
    }
    
    // Eye movement is handled via CSS custom properties set above

    // ============================================
    // SCROLL-BASED ANIMATIONS
    // ============================================
    // Fade in content as user scrolls (subtle entrance effect)
    
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation slightly before element enters viewport
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections for fade-in effect
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // ============================================
    // RESPONSIVE MENU (Future enhancement)
    // ============================================
    // Placeholder for mobile menu if needed in future
    
    // Check if we're on mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Log viewport size for debugging (remove in production)
    window.addEventListener('resize', function() {
        console.log('Viewport size:', window.innerWidth, 'x', window.innerHeight);
    });

});

