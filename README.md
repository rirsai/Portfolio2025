# Portfolio 2025 - Renana Irsai

A minimalist, responsive portfolio website built with HTML, CSS, and JavaScript, featuring a 12-column grid system.

## 📋 Overview

This portfolio website showcases the work of Renana Irsai, a graphic designer based in Jerusalem. The design is based on a clean, grid-based layout that emphasizes typography and content hierarchy.

## 🎨 Design Features

- **12-Column Grid System**: Flexible, responsive grid layout that adapts to all screen sizes
- **Minimalist Aesthetic**: Clean typography and spacing with black text on white background
- **Responsive Design**: Fully responsive with breakpoints for desktop, tablet, and mobile devices
- **Interactive Elements**: Smooth animations, hover effects, and eye graphics that follow mouse movement
- **Accessibility**: Built with semantic HTML and keyboard navigation support

## 📁 Project Structure

```
Portfolio2025/
├── index.html          # Main HTML structure
├── styles.css          # All CSS styles and grid system
├── script.js           # JavaScript for interactivity
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites

No build tools or dependencies required! This is a pure HTML/CSS/JS website that can be opened directly in a browser.

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
   - **Option 1**: Double-click `index.html` to open in your default browser
   - **Option 2**: Use a local server (recommended for development):
     ```bash
     # Using Python 3
     python3 -m http.server 8000
     
     # Using Node.js (if you have http-server installed)
     npx http-server
     ```
3. Navigate to `http://localhost:8000` in your browser

## 🏗️ How It Works

### The 12-Column Grid System

The website uses CSS Grid to create a flexible 12-column layout:

- **Desktop (>1024px)**: 4 columns, each spanning 3 grid columns (3+3+3+3 = 12)
- **Tablet (768px-1024px)**: 2 columns per row, each spanning 6 grid columns (6+6 = 12)
- **Mobile (<768px)**: Single column, all content spans full width (12 columns)

**Key CSS Classes:**
- `.container`: Centers content and sets max-width
- `.grid-12`: Creates the 12-column grid
- `.col-1` through `.col-12`: Column span classes

### Responsive Breakpoints

1. **Desktop**: Default styles (4 columns)
2. **Tablet** (`@media max-width: 1024px`): 2 columns per row
3. **Mobile** (`@media max-width: 768px`): Single column layout
4. **Small Mobile** (`@media max-width: 480px`): Optimized for small screens

### Interactive Features

1. **Smooth Scrolling**: All anchor links scroll smoothly to their targets
2. **Project Hover Effects**: Projects have subtle hover animations
3. **Eye Graphics**: The eyes at the bottom follow mouse movement (subtle effect)
4. **Scroll Animations**: Content fades in as you scroll down the page

## 🎯 Current Features

### ✅ Implemented

- [x] 12-column responsive grid system
- [x] Header with name and title
- [x] Four-column layout for main content
- [x] Introduction section with symbol
- [x] Education, Awards, Exhibitions sections
- [x] Project listings across all columns
- [x] Contact links section
- [x] Eye graphics at bottom
- [x] Responsive design (desktop, tablet, mobile)
- [x] Smooth scrolling
- [x] Hover effects on projects
- [x] Scroll-based fade-in animations
- [x] Eye mouse-tracking animation

### 🔜 Future Enhancements

- [ ] Individual project detail pages
- [ ] Image galleries for projects
- [ ] Contact form
- [ ] CV download functionality
- [ ] Social media links integration
- [ ] Dark mode toggle
- [ ] Loading animations
- [ ] Performance optimizations

## 📝 Customization Guide

### Updating Content

**To update your information:**

1. **Name and Title**: Edit the header section in `index.html`:
   ```html
   <h1 class="name">Renana Irsai</h1>
   <p class="title">Graphic Designer</p>
   ```

2. **Introduction**: Edit the intro text in the first column:
   ```html
   <p class="intro-text">Your introduction text here...</p>
   ```

3. **Projects**: Add or remove project items:
   ```html
   <div class="project-item">
       <h3 class="project-title">Project Name</h3>
       <p class="project-details">Project details, year</p>
   </div>
   ```

4. **Contact Links**: Update contact section with your actual links:
   ```html
   <a href="https://instagram.com/yourhandle" class="contact-link">Instagram</a>
   <a href="mailto:your.email@example.com" class="contact-link">Email</a>
   ```

### Changing Colors

The design uses a minimalist black-on-white color scheme. To change colors, edit `styles.css`:

- **Text Color**: Change `color: #000;` in the `body` selector
- **Background**: Change `background-color: #fff;` in the `body` selector
- **Accent Colors**: Modify hover states and link colors

### Adjusting Spacing

- **Grid Gap**: Change `gap: 20px;` in `.grid-12` selector
- **Section Spacing**: Modify `margin-bottom` values in section selectors
- **Container Padding**: Adjust `padding: 0 40px;` in `.container` selector

### Typography

- **Font Family**: Change `font-family` in the `body` selector
- **Font Sizes**: Adjust `font-size` values throughout the CSS
- **Line Height**: Modify `line-height` for better readability

## 🛠️ Technical Details

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid support required (all modern browsers)
- JavaScript ES6+ features used

### Performance

- No external dependencies or frameworks
- Lightweight CSS (minimal file size)
- Vanilla JavaScript (no libraries)
- Optimized for fast loading

### Accessibility

- Semantic HTML5 elements
- Keyboard navigation support
- Focus indicators for interactive elements
- Screen reader friendly structure

## 📱 Testing

To test responsiveness:

1. Open the website in your browser
2. Use browser DevTools (F12 or Cmd+Option+I)
3. Toggle device toolbar (Cmd+Shift+M)
4. Test different screen sizes:
   - Desktop: 1920px, 1440px, 1280px
   - Tablet: 1024px, 768px
   - Mobile: 480px, 375px, 320px

## 🐛 Troubleshooting

**Issue**: Grid not displaying correctly
- **Solution**: Ensure your browser supports CSS Grid (all modern browsers do)

**Issue**: Eye graphics not animating
- **Solution**: Check browser console for JavaScript errors. Ensure `script.js` is loaded.

**Issue**: Content overlapping on mobile
- **Solution**: Check that responsive media queries are working. Clear browser cache.

## 📚 Learning Resources

### CSS Grid
- [MDN CSS Grid Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [CSS-Tricks Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)

### Responsive Design
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev Responsive Design](https://web.dev/responsive-web-design-basics/)

## 📄 License

This project is for personal portfolio use.

## 👤 Author

**Renana Irsai**
- Graphic Designer
- Based in Jerusalem
- Design Operations Lead at Lightricks
- Lecturer at Bezalel Academy of Arts and Design

---

## 🔄 Changelog

### Version 1.0.0 (Initial Release)
- ✅ 12-column grid system implemented
- ✅ Responsive design for all screen sizes
- ✅ All content sections added
- ✅ Interactive features (hover effects, animations)
- ✅ Eye graphics with mouse tracking
- ✅ Smooth scrolling and scroll animations

---

**Last Updated**: January 2025
