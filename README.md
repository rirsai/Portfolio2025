# Renana Irsai - Portfolio Website



## Overview

An interactive portfolio website featuring cursor-responsive "eyes" and a clean, grid-based layout showcasing design work. The site emphasizes playful interactivity while maintaining professional presentation of projects.



## Design System



### Layout Structure

- **Grid System**: 12-column layout with 10px gap between columns

- **Column Numbering**: Columns numbered 1-12 from left to right

- **Viewport Margins**: 20px on all sides (top, bottom, left, right)

- **Responsive**: Adapts to different screen sizes



### Typography

- **Font Family**: Helvetica

- **Scale**: H1 to P ratio of 1.5:1

- **Units**: Rem-based sizing for accessibility

- **Alignment**: Text aligns to column grid structure



### Color Modes

- **Light Mode (Default)**: White background, black text

- **Dark Mode**: Black background, white text

- **Toggle**: Located next to H1, switches between modes



## Interactive Elements



### The Eyes

- **Position**: Centered in viewport

- **Structure**: Two circular outlines with solid black pupils

- **Behavior**: 

  - Pupils track cursor movement

  - Pupils move within circle bounds

  - 5px padding maintained between pupil edge and circle edge

  - Eyes remain interactive across all pages



### Cursor Trail

- **Visual**: A trail of cursor arrow duplicates following the main cursor

- **Behavior**:

  - Multiple cursor instances (suggest 5-8 copies)

  - Each follows the previous with slight delay

  - Creates smooth, snake-like motion trail

  - Fades slightly or maintains full opacity

  - Trail follows cursor everywhere on site

- **Technical Implementation**:

  - Track cursor position history

  - Render custom cursor elements at delayed positions

  - Use CSS transforms for smooth animation

  - Consider requestAnimationFrame for performance

  

#### Eyes in Project Pages

- Scale down to small size

- Relocate to top of page

- Maintain cursor-tracking functionality



### About Section

- **Default State**: Collapsed

- **Toggle Button**: 

  - Positioned at right edge of column 3

  - Default: `+` symbol

  - On click: Rotates 45° to form `×`

  - Opens/closes about content

- **Content Alignment**: Text aligns to top of viewport

- **Content Includes**: Bio, education, exhibitions, awards



### Project List

- **Alignment**: Bottom of viewport

- **Layout**: Organized in columns

- **Hover State**: 

  - Thumbnail preview appears

  - Preview position varies dynamically

- **Click Behavior**: Opens dedicated project page



### Project Pages

- **Structure**: 

  - Small interactive eyes at top center

  - Navigation: "< Back" (left) and "Next >" (right) at top

  - Project title and description (left side)

  - Image gallery (right side, large display area)

  - Project metadata tags at bottom left

- **Gallery**: 

  - Large display area spanning right portion of grid

  - Multiple images showcasing the work

  - Can display single large images or multiple images in grid

  - Images can vary in aspect ratio and composition

- **Layout**:

  - Eyes remain small and centered at top

  - Left content area (approximately columns 1-4): Title, type, year, description text, metadata tags

  - Right content area (approximately columns 5-12): Large gallery space for project images

  - Navigation controls remain accessible at top left



## Page Structure



### Home Page

```
Header

├── Name (H1) + Dark mode toggle

└── About toggle (+/×)



Center

└── Interactive Eyes



Footer

├── Project List (left columns)

└── Contact/CV links (right column)

```



### Project Pages

```
Header

├── Small Interactive Eyes (centered)

└── Navigation: < Back | Next >



Content (Two Column)

├── Left Column (Info)

│   ├── Project Title (H1)

│   ├── Project Type

│   ├── Year

│   ├── Description (paragraph)

│   └── Metadata Tags [category, type]

│

└── Right Column (Gallery)

    └── Large Image Display Area

        ├── Single large images, or

        └── Multiple images in grid

```



## Technical Specifications



### Column Usage Guide

- **Columns 1-2**: Left project list

- **Column 3**: About toggle button placement

- **Columns 4-9**: Center content area / Eyes

- **Columns 10-12**: Right project list / Contact info



### Project Page Column Usage

- **Columns 1-4**: Project information (title, type, year, description, tags)

- **Columns 5-12**: Gallery space for large project images

- **Top center**: Small interactive eyes (spanning approximately columns 5-8)



### Responsive Breakpoints

- Adapt column count for mobile/tablet

- Maintain eye interactivity across all sizes

- Stack project lists vertically on smaller screens

- Preserve 20px margins at all breakpoints



## Content Structure



### Projects to Include

1. Docu.Text - Documentary Festival, NLI (2018)

2. Lightricks Design Guild - Posters & Events (2021-2025)

3. Design Lab - Identity & Event (2024)

4. Design for AI - Identity (2025)

5. Lightricks Internal Brand - Branding & event design (2023-2024)

6. Highlights - Design Guild Newsletter (2025)

7. Lockdown Chronicles - Illustration (2021)

8. AI Workshop - Website (2023)

9. Shelters - Illustration (2025)

10. Code/Play - Experimental (2023-2025)

11. Guns & Roses - AI Animation (2025)

12. Daphne V.0 - Audio Visual Synth (2025)

13. GenZ Factune - Website (2025)

14. AI Reader - Website (2025)

15. BauNow - Identity, Exhibition (2018)

16. Brand Hub - Website (2025)

17. Stories Made by God - Catalog (2016)

18. Across From - Exhibition (2017)

19. Villa & Jungle - Exhibition (2018)

20. M.des Bezalel - Identities (2016-2019)



### About Content

- Professional bio

- Current roles (Design Operations Lead at Lightricks, Lecturer at Bezalel)

- Education (BA Bezalel 2015, BA Hebrew University 2010)

- Exhibitions and awards

- Specializations and interests



## Development Notes

- Implement smooth transitions for all interactive elements

- Optimize eye-tracking calculations for performance

- Ensure thumbnail loading is optimized (lazy loading)

- Test eye behavior across different cursor speeds

- Consider prefers-reduced-motion for accessibility

- Maintain semantic HTML structure for accessibility
