# Cute Pixel Design Guidelines

## Design Approach
**Reference Style**: Modern Kawaii Pixel Games
Drawing inspiration from Stardew Valley, Animal Crossing, Kirby series, and Celeste. Focus on soft pastels, rounded pixel elements, friendly aesthetics, and charming UI patterns that feel cozy and welcoming.

**Core Principles**:
- Pixel-perfect alignment (8px grid)
- Soft, rounded pixelated elements
- Pastel color palette (pinks, mints, soft yellows, creamy whites, lavender)
- Gentle gradients using dithering patterns
- Clean, friendly, approachable design

## Typography

**Primary Font**: "Silkscreen" (Google Fonts) - smooth pixel font with softer edges
**Secondary Font**: "Grandstander" for body text (playful, readable, warm)

**Hierarchy**:
- H1: Silkscreen, text-5xl (mixed case for friendliness)
- H2: Silkscreen, text-3xl
- H3: Grandstander, text-2xl font-semibold
- Body: Grandstander, text-lg
- Captions: Grandstander, text-base

**Text Treatment**: Soft drop shadows with slight blur (2px offset, 20% opacity) for depth without harshness.

## Layout System

**Grid**: 8px base unit with emphasis on breathing room
**Common Spacing**: Tailwind units of 4, 6, 8, 12, 16, 20 (generous padding)
**Containers**: max-w-6xl with px-8, creating comfortable, uncluttered spaces

**Borders**: 
- Rounded pixelated corners using nested divs with stepped border-radius
- Border widths: border-3 or border-4
- Multi-layer borders for depth (outer pastel + inner white/cream)

**Sections**: 
- py-20 to py-32 spacing (airy, spacious)
- Alternating soft pastel backgrounds
- Decorative pixel elements (hearts, stars, flowers) as dividers

## Component Library

### Navigation
**Floating Pill Style**: Soft rounded pixel bar with blur backdrop
- Logo: Cute pixel icon with brand text
- Menu items: Rounded pill hover states, smooth transitions
- Heart or star counter for engagement metrics
- Soft shadow beneath nav (floating effect)

### Buttons
**Rounded Pixel Blocks**:
- Border-radius with pixel-stepped corners (nested div technique)
- Soft pastel fills with white text
- 4px soft shadow (colored, not black)
- Hover: Gentle lift with increased shadow
- On images: backdrop-blur-xl with semi-transparent pastel background
- Size: px-8 py-4 minimum for touch-friendly

### Cards
**Cozy Window Style**:
- Thick rounded pixel borders (border-4)
- Cream or white backgrounds
- Pastel accent headers
- Soft inner shadows for depth
- Pixel art icons (hearts, stars, flowers) as decorative elements
- Hover: Gentle scale (scale-105) with shadow increase

### Forms
**Input Fields**: 
- Rounded pixel borders (soft corners)
- Pastel border colors
- Focus states with glow effect (pastel ring)
- Placeholder text in muted pastels
- Labels with cute pixel icons

**Validation**: Pixel heart (success), pixel cloud (error) - all in pastels

### Hero Section
**Full-width immersive with large hero image**:
- Large pixel art illustration (1920x1080) - pastoral scene, cozy cafe, magical garden, or cute town
- Style: Soft isometric or side view, pastel palette, friendly characters
- No scanlines - clean, crisp presentation
- Title with soft glow effect (layered pastel shadows)
- Rounded pixel CTAs with backdrop blur
- Floating decorative elements (pixel hearts, stars, clouds)
- Height: 85vh for impact with smooth scroll reveal

### Feature Sections
**3-Column Grid** (grid-cols-1 md:grid-cols-3):
- Each feature in rounded pixel container
- Cute pixel icon (128x128) - hearts, stars, flowers, animals
- Pastel background with white border
- Title in Silkscreen, description in Grandstander
- Gentle hover animations (float up slightly)

### Testimonials
**Rounded Chat Bubbles**:
- Soft rounded pixel speech bubbles
- Pixel arrow pointer (rounded)
- Cute avatar illustrations (circular, pixel art)
- Pastel backgrounds alternating
- 2-column grid on desktop

### Footer
**Soft Pixel Garden**:
- Cream or soft mint background
- Pixel decorations (flowers, stars scattered)
- 4-column layout (desktop)
- Rounded pixel social icons
- Newsletter with cute illustration
- "Made with ♥" messaging

### Special Elements
**Animations**: 
- Gentle bounce on hover
- Soft fade-ins on scroll
- Floating/bobbing decorative elements
- Heart particles on interactions
- Progress bars with pixel hearts filling up

**Decorative**:
- Pixel flowers, hearts, stars as accents
- Soft cloud shapes
- Cute animal sprites
- Achievement badges with rounded pixel frames
- Confetti effects (pastel pixels)

## Images

### Hero Image
**Large immersive pixel art scene** (1920x1080):
- Style: Cozy isometric town, magical forest, cute cafe interior, or pastoral landscape
- Palette: Soft pastels (pinks, mints, cream, lavender, soft yellow)
- Characteristics: Friendly, inviting, detailed but not cluttered
- Treatment: Clean presentation, no overlays
- Placement: Full-width, 85vh height

### Supporting Images
**Feature Illustrations**: Cute pixel scenes (640x480 or square)
**Icons**: 128x128 pixel art (hearts, stars, flowers, animals) in pastel colors
**Backgrounds**: Subtle pixel patterns (tiny hearts, stars, dots) at low opacity
**Product Mockups**: Clean pixel art with soft shadows

All images maintain pixel-perfect clarity with pastel color harmony.