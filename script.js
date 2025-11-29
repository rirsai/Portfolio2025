/* ============================================
   GLOBAL VARIABLES
   ============================================ */

let mouseX = 0;
let mouseY = 0;
let cursorHistory = []; // Array to store cursor positions for trail
const TRAIL_LENGTH = 12; // Number of cursor arrows in trail (increased for larger distribution)
const TRAIL_DELAY = 100; // Delay between each cursor in trail (ms) - increased for larger spread

// Eye elements
const leftEye = document.querySelector('.eye-left');
const leftPupil = document.querySelector('.eye-left .pupil');
const rightEye = document.querySelector('.eye-right');
const rightPupil = document.querySelector('.eye-right .pupil');

// Toggle elements
const aboutToggle = document.getElementById('aboutToggle');
const aboutSection = document.getElementById('aboutSection');
const darkModeToggle = document.getElementById('darkModeToggle');

// Thumbnail preview
const thumbnailPreview = document.getElementById('thumbnailPreview');

// Animation frame ID for smooth updates
let animationFrameId = null;

/* ============================================
   CURSOR TRAIL IMPLEMENTATION
   ============================================ */

/**
 * Creates a cursor element using the custom cursor SVG
 */
function createCursorArrow() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-arrow';
    // The cursor SVG is applied via CSS background-image
    return cursor;
}

/**
 * Initialize cursor trail elements
 */
function initCursorTrail() {
    const trailContainer = document.getElementById('cursorTrail');
    
    // Create cursor arrows for the trail
    for (let i = 0; i < TRAIL_LENGTH; i++) {
        const arrow = createCursorArrow();
        arrow.style.opacity = `${1 - (i * 0.15)}`; // Fade older cursors slightly
        trailContainer.appendChild(arrow);
    }
}

/**
 * Update cursor trail positions
 */
function updateCursorTrail() {
    const arrows = document.querySelectorAll('.cursor-arrow');
    
    arrows.forEach((arrow, index) => {
        // Get position from history with larger delay for more spread
        const historyIndex = cursorHistory.length - 1 - (index * 5); // Increased from 2 to 5 for larger distribution
        
        if (historyIndex >= 0 && historyIndex < cursorHistory.length) {
            const pos = cursorHistory[historyIndex];
            // Position cursor so the tip (top-left corner) is at the cursor position
            arrow.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            arrow.style.opacity = `${1 - (index * 0.08)}`; // Adjusted opacity fade for more cursors
        } else {
            // Hide if no history available
            arrow.style.opacity = '0';
        }
    });
}

/* ============================================
   EYE TRACKING IMPLEMENTATION
   ============================================ */

/**
 * Calculate pupil position within eye bounds
 * @param {HTMLElement} eye - The eye element
 * @param {HTMLElement} pupil - The pupil element
 * @param {number} mouseX - Mouse X position
 * @param {number} mouseY - Mouse Y position
 */
function updatePupilPosition(eye, pupil, mouseX, mouseY) {
    // Get eye position and dimensions
    const eyeRect = eye.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;
    
    // Calculate distance and angle from eye center to cursor
    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Eye radius (half of eye width minus border)
    const eyeRadius = (eyeRect.width / 2) - 1; // -1 for border
    
    // Pupil radius
    const pupilRadius = pupil.offsetWidth / 2;
    
    // Maximum movement distance (eye radius - pupil radius - 5px padding)
    const maxMove = eyeRadius - pupilRadius - 5;
    
    // Calculate new pupil position
    let pupilX = 0;
    let pupilY = 0;
    
    if (distance > maxMove) {
        // Cursor is outside the max movement area - constrain to edge
        const angle = Math.atan2(deltaY, deltaX);
        pupilX = Math.cos(angle) * maxMove;
        pupilY = Math.sin(angle) * maxMove;
    } else {
        // Cursor is within bounds - follow directly
        pupilX = deltaX;
        pupilY = deltaY;
    }
    
    // Apply transform (pupil is centered, so we translate from center)
    pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
}

/**
 * Update both eyes in sync using requestAnimationFrame
 */
function updateEyes() {
    if (leftEye && leftPupil && rightEye && rightPupil) {
        updatePupilPosition(leftEye, leftPupil, mouseX, mouseY);
        updatePupilPosition(rightEye, rightPupil, mouseX, mouseY);
    }
}

/* ============================================
   MOUSE TRACKING
   ============================================ */

/**
 * Track mouse movement and update cursor history
 */
function handleMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    
    // Add current position to history
    cursorHistory.push({
        x: mouseX,
        y: mouseY,
        timestamp: Date.now()
    });
    
    // Keep only recent positions (increased buffer for larger trail)
    if (cursorHistory.length > TRAIL_LENGTH * 6) {
        cursorHistory.shift();
    }
    
    // Update everything in the next animation frame for smooth performance
    if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
            updateEyes();
            updateCursorTrail();
            animationFrameId = null;
        });
    }
}

/* ============================================
   DARK MODE TOGGLE
   ============================================ */

function initDarkMode() {
    // Check for saved preference or default to light mode
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.classList.add('active');
    }
    
    let isDragging = false;
    let startX = 0;
    let startLeft = 0;
    const toggleTrack = darkModeToggle.querySelector('.toggle-track');
    const toggleThumb = darkModeToggle.querySelector('.toggle-thumb');
    
    // Function to update dark mode based on toggle position
    function updateDarkMode(shouldBeActive) {
        const isActive = darkModeToggle.classList.contains('active');
        
        // Only change mode if toggle actually moved to the other side
        if (shouldBeActive !== isActive) {
            document.body.classList.toggle('dark-mode');
            darkModeToggle.classList.toggle('active');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark.toString());
        }
    }
    
    // Click/tap to toggle - move ball to opposite side
    darkModeToggle.addEventListener('click', (e) => {
        // Only toggle on click if not dragging
        if (!isDragging) {
            const isActive = darkModeToggle.classList.contains('active');
            const shouldBeActive = !isActive;
            
            // Move ball to opposite side
            if (shouldBeActive) {
                toggleThumb.style.transform = 'translateX(21px) translateY(-50%)';
            } else {
                toggleThumb.style.transform = 'translateX(0px) translateY(-50%)';
            }
            
            // Update mode only when ball reaches the other side
            updateDarkMode(shouldBeActive);
        }
    });
    
    // Mouse drag functionality
    toggleThumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startLeft = darkModeToggle.classList.contains('active') ? 21 : 0;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const trackRect = toggleTrack.getBoundingClientRect();
        const trackWidth = trackRect.width;
        const thumbWidth = 18;
        const maxLeft = trackWidth - thumbWidth - 2; // 2px for borders
        
        const deltaX = e.clientX - startX;
        let newLeft = startLeft + deltaX;
        
        // Constrain to track bounds
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        
        // Update position
        toggleThumb.style.transform = `translateX(${newLeft}px) translateY(-50%)`;
        toggleThumb.style.transition = 'none'; // Disable transition during drag
    });
    
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        
        isDragging = false;
        toggleThumb.style.transition = 'transform 0.3s ease'; // Re-enable transition
        
        // Determine final state based on position
        const trackRect = toggleTrack.getBoundingClientRect();
        const thumbRect = toggleThumb.getBoundingClientRect();
        const thumbCenter = thumbRect.left + thumbRect.width / 2;
        const trackCenter = trackRect.left + trackRect.width / 2;
        
        const shouldBeActive = thumbCenter > trackCenter;
        
        // Snap to correct position and update mode
        if (shouldBeActive) {
            toggleThumb.style.transform = 'translateX(23px) translateY(-50%)';
        } else {
            toggleThumb.style.transform = 'translateX(0px) translateY(-50%)';
        }
        
        // Only update mode if toggle actually moved to the other side
        updateDarkMode(shouldBeActive);
    });
    
    // Touch support for mobile
    toggleThumb.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        startLeft = darkModeToggle.classList.contains('active') ? 21 : 0;
        e.preventDefault();
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const trackRect = toggleTrack.getBoundingClientRect();
        const trackWidth = trackRect.width;
        const thumbWidth = 18;
        const maxLeft = trackWidth - thumbWidth - 2;
        
        const deltaX = e.touches[0].clientX - startX;
        let newLeft = startLeft + deltaX;
        
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        
        toggleThumb.style.transform = `translateX(${newLeft}px) translateY(-50%)`;
        toggleThumb.style.transition = 'none';
    });
    
    document.addEventListener('touchend', () => {
        if (!isDragging) return;
        
        isDragging = false;
        toggleThumb.style.transition = 'transform 0.3s ease';
        
        const trackRect = toggleTrack.getBoundingClientRect();
        const thumbRect = toggleThumb.getBoundingClientRect();
        const thumbCenter = thumbRect.left + thumbRect.width / 2;
        const trackCenter = trackRect.left + trackRect.width / 2;
        
        const shouldBeActive = thumbCenter > trackCenter;
        
        // Snap to correct position and update mode
        if (shouldBeActive) {
            toggleThumb.style.transform = 'translateX(23px) translateY(-50%)';
        } else {
            toggleThumb.style.transform = 'translateX(0px) translateY(-50%)';
        }
        
        // Only update mode if toggle actually moved to the other side
        updateDarkMode(shouldBeActive);
    });
}

/* ============================================
   ABOUT SECTION TOGGLE
   ============================================ */

function initAboutToggle() {
    // About section is closed by default
    // Clicking "+" rotates it 45 degrees to form "×"
    // Clicking again rotates it back to "+"
    const toggleIcon = aboutToggle.querySelector('.toggle-icon');
    
    // Set initial state: closed (show "+")
    toggleIcon.textContent = '+';
    
    aboutToggle.addEventListener('click', () => {
        aboutSection.classList.toggle('visible');
        aboutToggle.classList.toggle('active');
        // The CSS handles the rotation with transform: rotate(45deg)
    });
}

/* ============================================
   PROJECT HOVER PREVIEWS
   ============================================ */

function initProjectHovers() {
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            // Show thumbnail preview
            // For now, we'll just position it dynamically
            // Later, you can add actual thumbnail images
            const rect = item.getBoundingClientRect();
            
            // Position preview away from eyes and text
            let previewX = mouseX + 50;
            let previewY = mouseY + 50;
            
            // Keep preview within viewport
            if (previewX + 300 > window.innerWidth) {
                previewX = mouseX - 350;
            }
            if (previewY + 300 > window.innerHeight) {
                previewY = mouseY - 350;
            }
            
            thumbnailPreview.style.left = `${previewX}px`;
            thumbnailPreview.style.top = `${previewY}px`;
            thumbnailPreview.classList.add('visible');
            
            // TODO: Load actual thumbnail image based on data-project attribute
            // const projectId = item.getAttribute('data-project');
            // thumbnailPreview.innerHTML = `<img src="images/${projectId}-thumb.jpg" alt="${item.querySelector('.project-title').textContent}">`;
        });
        
        item.addEventListener('mouseleave', () => {
            thumbnailPreview.classList.remove('visible');
        });
        
        item.addEventListener('mousemove', (e) => {
            // Update preview position as cursor moves
            let previewX = e.clientX + 50;
            let previewY = e.clientY + 50;
            
            if (previewX + 300 > window.innerWidth) {
                previewX = e.clientX - 350;
            }
            if (previewY + 300 > window.innerHeight) {
                previewY = e.clientY - 350;
            }
            
            thumbnailPreview.style.left = `${previewX}px`;
            thumbnailPreview.style.top = `${previewY}px`;
        });
    });
}

/* ============================================
   INITIALIZATION
   ============================================ */

function init() {
    // Force custom cursor on all elements (prevent browser from resetting it)
    function enforceCustomCursor() {
        const cursorStyle = "url('images/cursor.png') 0 0, none";
        document.documentElement.style.cursor = cursorStyle;
        document.body.style.cursor = cursorStyle;
        // Apply to all elements
        document.querySelectorAll('*').forEach(el => {
            el.style.cursor = cursorStyle;
        });
    }
    
    // Enforce cursor immediately and after a short delay
    enforceCustomCursor();
    setTimeout(enforceCustomCursor, 100);
    setTimeout(enforceCustomCursor, 500);
    
    // Initialize cursor trail with system cursor style
    initCursorTrail();
    
    // Initialize dark mode
    initDarkMode();
    
    // Initialize about toggle
    initAboutToggle();
    
    // Initialize project hovers
    initProjectHovers();
    
    // Track mouse movement
    document.addEventListener('mousemove', handleMouseMove);
    
    // Initial eye position (center of screen)
    if (window.innerWidth && window.innerHeight) {
        mouseX = window.innerWidth / 2;
        mouseY = window.innerHeight / 2;
        updateEyes();
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Recalculate eye positions on resize
        updateEyes();
    });
    
    // Re-enforce cursor on mouse move (in case browser resets it)
    document.addEventListener('mousemove', enforceCustomCursor);
}

// Start everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

