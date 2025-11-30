/* ============================================
   GLOBAL VARIABLES
   ============================================ */

let mouseX = 0;
let mouseY = 0;
let cursorHistory = []; // Array to store cursor positions for trail
const TRAIL_LENGTH = 12; // Number of cursor arrows in trail (pack of cursors)
const TRAIL_DELAY = 100; // Delay between each cursor in trail (ms) - increased for larger spread
const PACK_SPREAD = 80; // Maximum distance cursors can spread from main cursor (in pixels)

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
        arrow.style.opacity = '1'; // All cursors fully visible (no opacity fade)
        trailContainer.appendChild(arrow);
    }
}

/**
 * Update cursor trail positions - linear trail with no opacity fade
 */
function updateCursorTrail() {
    const arrows = document.querySelectorAll('.cursor-arrow');
    
    arrows.forEach((arrow, index) => {
        // Get position from history with delay for trail effect
        const historyIndex = cursorHistory.length - 1 - (index * 5);
        
        if (historyIndex >= 0 && historyIndex < cursorHistory.length) {
            const pos = cursorHistory[historyIndex];
            // Position cursor at the historical position (linear trail)
            arrow.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            arrow.style.opacity = '1'; // No opacity fade - all cursors fully visible
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
            // Get project ID from data attribute
            const projectId = item.getAttribute('data-project');
            const projectTitle = item.querySelector('.project-title').textContent;
            
            // Load thumbnail image based on project ID
            let imagePath = '';
            if (projectId === 'design-for-ai') {
                imagePath = 'images/design-for-ai-thumb.jpeg';
            } else if (projectId === 'gpt-workshop') {
                imagePath = 'images/gpt-workshop-thumb.gif';
            } else if (projectId === 'shelters') {
                imagePath = 'images/shelters-thumb.gif';
            } else if (projectId === 'daphne-v0') {
                imagePath = 'images/Daphne-thumb.gif';
            }
            // Add more projects here as needed
            
            // Position preview at random position in defined area
            // Area: below header section and above project item texts
            const headerHeight = 60; // Header height (padding-top: 15px + content)
            const projectAreaHeight = 350; // Space reserved for project texts at bottom (increased padding)
            const minY = headerHeight + 20; // Start below header with some margin
            const maxY = window.innerHeight - projectAreaHeight - 400; // End above project area (400px is thumbnail height)
            const minX = 20; // Left margin
            const maxX = window.innerWidth - 400 - 20; // Right margin (400px is thumbnail width)
            
            // Ensure valid range
            const validMaxY = Math.max(minY, maxY);
            const validMaxX = Math.max(minX, maxX);
            
            // Random position within the defined area
            const previewX = Math.random() * (validMaxX - minX) + minX;
            const previewY = Math.random() * (validMaxY - minY) + minY;
            
            thumbnailPreview.style.left = `${previewX}px`;
            thumbnailPreview.style.top = `${previewY}px`;
            
            // Load and display image if path exists
            if (imagePath) {
                thumbnailPreview.innerHTML = `<img src="${imagePath}" alt="${projectTitle}" style="width: 100%; height: 100%; object-fit: contain;">`;
                thumbnailPreview.classList.add('visible');
            } else {
                thumbnailPreview.classList.remove('visible');
            }
        });
        
        item.addEventListener('mouseleave', () => {
            thumbnailPreview.classList.remove('visible');
        });
        
        // Removed mousemove handler - thumbnails stay in random position, don't follow cursor
    });
}

/* ============================================
   INITIALIZATION
   ============================================ */

function init() {
    // Force custom cursor on all elements (prevent browser from resetting it)
    // This function is called continuously to prevent browser from resetting cursor
    // Using data URI for more persistent cursor (embedded in code, no file loading)
    const CURSOR_DATA_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA0xJREFUeNrEV11IU3EUP3cfui3za9lcQgzELLDmiySBIg0RX6qHQGPLXQk/0GBQIOmDGqS+++Br88FgQfXQQ2mIMkXwZX7Vktpy2WhubGNzn7o7/50tFJWN0nZvvz9n/3Huf3fnnt/5ugBpoNfrL3ncXqf50+cuYBG8dBfEYjG/4GzBeWm+tHLTtqnq7OgUsWGA4E8His4VteHWFttlFLh/58wD+5h4MQGa+xrQqDUj1q/WXs4NWFpeAsNLA8jl8nsXSkoaOTcggT1cFdcqoLr6+g2fzxdyuVx9nMXAbxBg4jEIhoL8xcVFSXZ2dpnb7a4TCoXLeXl5PtY9sA+r1QoNDQ0wNTVF4x/P8Hi8Sk4oOI65uTkYHBwEk8mk9fv99H8xYGhoCKLRKC0SibQcxEBq6HQ6qEREIpGZeDw+npOTo+eUgPX1dcA4yDcajXVYOW3b29s2VC/n5ub6WKXgMMxmczIwJycnaYlEMsMwTCXrMZAK6AUYGBiAlZUV7dbWVi8nFBwPzITU1tbSWVlZAVSNcGrAPrq7uwGpEIfDYaPD4XhXWlo6wqkBFosF+Hy+AItWjdPptLe3tyswVbdGR0ejJ7qRwWC4srdDyCPdY0IBRZL1+ITS1NREYrEYQU+oWA/CdBkyPDwMCwsLd/F7FycUHMba2lpSXr960ykrKnahaow1A9RqNbTcbwEqhVOVV5WopzIXhIWFhSCVSsFutwOW4aROoVCA6qYKQoHwNybGhI7/BucIb8YM6OjogP7+fqivr4f5+fnjs8MDaXHhLCuVUCaTQU9PD5SVlc1SFPW0sbHR1tzcfFCInmGHNJmWtD83Hf8+O6ZKQ6VSSbDWk2AwOJg4g8VmZnp6+lDqUWTq/Qfi8/oDGS7FFIzrx0FeLF8NBIK63d0dW/rhDRchGWzHiefCVVVVlQg0n+SM+IBfnAGScmSA3dtLSsYoYCIMiYSipJVuvZjq3MbGRk04GCa9T/oOqBAIBCQajhKrxfr81B7A9Ap6fJ63h54skpIcigKhIAv4PP4RvZAvxJ4gOD0FNE3/wO3WaT1IDj5YbsdfEF6Pt7X8cvntsbGxOziiATag0OrH1Yf4AmMBrpBITZySSUI8Hs9fp+EvAQYAEASQ3VqhT+UAAAAASUVORK5CYII=";
    
    function enforceCustomCursor() {
        // Use file path instead of data URI for better browser compatibility
        const cursorValue = `url('images/cursor.png') 0 0, none`;
        
        // Apply to document root with highest priority
        document.documentElement.style.setProperty('cursor', cursorValue, 'important');
        document.body.style.setProperty('cursor', cursorValue, 'important');
        
        // Apply to all elements using style attribute for maximum priority
        // Only update elements that don't have the cursor set (for performance)
        // Use a more efficient check to avoid unnecessary updates
        const allElements = document.querySelectorAll('*');
        const maxElements = 100; // Limit to first 100 elements per call for performance
        const startIndex = Math.floor(Math.random() * Math.max(0, allElements.length - maxElements));
        
        for (let i = startIndex; i < Math.min(startIndex + maxElements, allElements.length); i++) {
            const el = allElements[i];
            // Only update if cursor is not already set correctly
            if (!el.style.cursor || !el.style.cursor.includes('cursor.png')) {
                el.style.setProperty('cursor', cursorValue, 'important');
            }
        }
        
        // Also inject a style tag as a fallback (highest CSS priority)
        // This ensures CSS-level enforcement
        let styleTag = document.getElementById('force-cursor-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'force-cursor-style';
            document.head.appendChild(styleTag);
        }
        // Update style tag content to ensure it's always active
        styleTag.textContent = `
            html, body, html *, body *,
            html *:hover, body *:hover,
            html *:active, body *:active,
            html *:focus, body *:focus {
                cursor: url('images/cursor.png') 0 0, none !important;
            }
        `;
    }
    
    // Preload cursor image to ensure it's available
    const cursorImg = new Image();
    cursorImg.src = 'images/cursor.png';
    cursorImg.onload = () => {
        console.log('Cursor image loaded successfully');
        enforceCustomCursor();
    };
    cursorImg.onerror = () => {
        console.error('Failed to load cursor image');
    };
    
    // Enforce cursor immediately and repeatedly
    enforceCustomCursor();
    setTimeout(enforceCustomCursor, 50);
    setTimeout(enforceCustomCursor, 100);
    setTimeout(enforceCustomCursor, 200);
    setTimeout(enforceCustomCursor, 500);
    
    // Also enforce on any DOM mutations (elements added dynamically)
    const observer = new MutationObserver(() => {
        enforceCustomCursor();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
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
    
    // Re-enforce cursor on key events (in case browser resets it)
    // Only essential events to avoid performance issues
    document.addEventListener('mousemove', enforceCustomCursor);
    document.addEventListener('click', enforceCustomCursor);
    document.addEventListener('mousedown', enforceCustomCursor);
    
    // Lightweight cursor enforcement - throttled to avoid performance issues
    let cursorEnforcementFrameId = null;
    let lastEnforceTime = 0;
    function continuousCursorEnforcement() {
        const now = Date.now();
        // Throttle to every 200ms to avoid performance issues
        if (now - lastEnforceTime > 200) {
            enforceCustomCursor();
            lastEnforceTime = now;
        }
        cursorEnforcementFrameId = requestAnimationFrame(continuousCursorEnforcement);
    }
    continuousCursorEnforcement();
    
    // Also enforce periodically as a backup (every 500ms - less aggressive)
    setInterval(enforceCustomCursor, 500);
}

// Start everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

