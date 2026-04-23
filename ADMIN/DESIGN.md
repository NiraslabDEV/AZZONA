---
name: Azzona
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0d0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#d0cdcd'
  on-tertiary: '#313030'
  tertiary-container: '#b4b2b2'
  on-tertiary-container: '#454544'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-xl:
    fontFamily: Noto Serif
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Epilogue
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.15em
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 80px
  section-gap: 120px
---

## Brand & Style

This design system is built to evoke the high-end, exclusive atmosphere of Maputo’s Polana district—a place where colonial heritage meets modern African luxury. The brand personality is enigmatic, sophisticated, and deeply intentional. It caters to a discerning clientele that values privacy, culinary artistry, and a seamless transition from a daytime espresso culture to an evening lounge experience.

The visual style is **Minimalist with High-Contrast accents**. It utilizes heavy blocks of dark space to create an "atmospheric lighting" effect, allowing gold typography and high-fidelity imagery to emerge from the shadows. The aesthetic is architectural and structured, leaning into the fusion of bistro warmth and lounge-bar mystery.

## Colors

The palette is anchored by "Midnight Charcoal," a deep, near-black neutral that serves as the canvas for the entire experience. The primary accent is "Polana Gold"—a metallic, sophisticated hue used sparingly for critical actions, branding elements, and decorative flourishes.

To maintain legibility in a high-contrast dark environment, we use "Bone Ivory" (#E5E5E5) for body text rather than pure white, reducing eye strain while maintaining a premium feel. Tertiary layers use subtle shifts in charcoal depth (#1A1A1A) to create a sense of physical space and "lit" surfaces without relying on traditional borders.

## Typography

The typography strategy relies on the tension between a timeless serif and a precision-engineered sans-serif. **Noto Serif** is used for all headlines and brand moments, providing the "literary" and "sophisticated" feel essential for a luxury bistro. 

**Manrope** provides a balanced and neutral functional layer for menu descriptions and interface body text. To add an editorial, "lounge" character, **Epilogue** is used exclusively for labels, micro-copy, and navigation items—always set in uppercase with generous letter spacing to mimic high-end fashion or architectural signage.

## Layout & Spacing

This design system employs a **Fixed Grid** model to ensure the layout feels as stable and curated as a physical menu. On desktop, a 12-column grid is used with expansive margins to create "breathing room," suggesting that space is a luxury. 

The rhythm is governed by an 8px base unit. Vertical rhythm is intentionally loose; sections are separated by large gaps (#section-gap) to allow the atmospheric photography and gold accents to command attention. Content should never feel crowded; if a screen feels busy, increase the negative space rather than reducing the font size.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Light Bloom**. Instead of traditional drop shadows, depth is created by placing elements on slightly lighter charcoal backgrounds (moving from #121212 to #1A1A1A). 

A unique "atmospheric" effect is achieved using **Low-Opacity Gold Glows**. When an element is focused or elevated, it should emit a soft, diffused gold bloom (15-20% opacity) rather than a dark shadow. Glassmorphism is applied to modal overlays and navigation bars—using a heavy backdrop blur (20px+) to simulate the frosted glass and polished surfaces found in a premium lounge.

## Shapes

To mirror the colonial architecture and modern interior design of the Polana district, this design system uses **Sharp (0)** geometry. 

Hard 90-degree corners convey a sense of precision, discipline, and high-end construction. This applies to buttons, image containers, and input fields. The only exception to this rule is the use of perfect circles for purely decorative icons or avatar masks, creating a stark contrast with the otherwise rectilinear layout.

## Components

### Buttons
Primary buttons are charcoal with a 1px solid gold border and gold text. There is no fill. On hover, the button fills with a subtle gold gradient (low opacity) and the text remains sharp. This "Ghost Gold" style ensures buttons feel like jewelry rather than plastic.

### Inputs
Input fields are minimalist underlines in Gold (#D4AF37). Labels sit above the line in **Epilogue** caps. There are no containing boxes, maintaining the "light and airy" luxury feel within the dark mode.

### Cards & Menu Items
Cards use a "no-border" approach. They are distinguished from the background only by a shift in tonal charcoal or a thin, vertical gold line on the left edge for featured "Chef's Specials."

### Lists
Menu lists are spaced generously. Item names are in **Noto Serif**, while prices are in **Manrope** Bold, positioned to the far right. A subtle dotted leader line may connect the name and price to guide the eye across the dark space.

### Glass Overlays
For "Lounge Bar" moments (e.g., drink selections), use high-blur translucent cards that allow the background photography to peak through, mimicking the distortion of a wine glass.