---
name: Chicharitos Artisanal Churros
colors:
  surface: '#fdf9f0'
  surface-dim: '#dddad1'
  surface-bright: '#fdf9f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3ea'
  surface-container: '#f1eee5'
  surface-container-high: '#ece8df'
  surface-container-highest: '#e6e2d9'
  on-surface: '#1c1c16'
  on-surface-variant: '#50443e'
  inverse-surface: '#31302b'
  inverse-on-surface: '#f4f0e7'
  outline: '#83746d'
  outline-variant: '#d5c3bb'
  surface-tint: '#7c5641'
  primary: '#412311'
  on-primary: '#ffffff'
  primary-container: '#5a3825'
  on-primary-container: '#d2a289'
  inverse-primary: '#eebca2'
  secondary: '#885119'
  on-secondary: '#ffffff'
  secondary-container: '#fdb473'
  on-secondary-container: '#78440b'
  tertiary: '#342814'
  on-tertiary: '#ffffff'
  tertiary-container: '#4c3e28'
  on-tertiary-container: '#bda98c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#eebca2'
  on-primary-fixed: '#2f1405'
  on-primary-fixed-variant: '#623e2b'
  secondary-fixed: '#ffdcc1'
  secondary-fixed-dim: '#ffb778'
  on-secondary-fixed: '#2e1500'
  on-secondary-fixed-variant: '#6c3a01'
  tertiary-fixed: '#f6dfc0'
  tertiary-fixed-dim: '#d9c4a5'
  on-tertiary-fixed: '#251a07'
  on-tertiary-fixed-variant: '#53452e'
  background: '#fdf9f0'
  on-background: '#1c1c16'
  surface-variant: '#e6e2d9'
typography:
  display-lg:
    fontFamily: Epilogue
    fontSize: 34px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Epilogue
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Epilogue
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Epilogue
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Literata
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Literata
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Literata
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Epilogue
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Epilogue
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Epilogue
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
  space-2xl: 2rem
  space-3xl: 2.5rem
  gutter-mobile: 1rem
  margin-mobile: 1rem
  gutter-desktop: 1.5rem
  margin-desktop: 2.5rem
---

## Brand & Style

This design system crafts a warm, indulgent, and appetizing digital storefront tailored for mobile-first gourmet snack delivery. Drawing visual cues from artisanal Latin-American confectionery, traditional Mexican street churrerías, and Brazilian dessert parlors, the aesthetic balances nostalgic charm with crisp modern minimalism.

The visual style is **Tactile Warmth meets Contemporary Minimalism**. It abandons sterile, clinical white interfaces in favor of buttery pastry tones, decadent chocolate anchors, and golden caramel accents. Micro-interactions should feel creamy and soft—mimicking the dipping and stretching of fresh dulce de leche. Strict iconography replaces colloquial emojis to preserve the sophisticated, gourmet positioning of the brand.

## Colors

The palette directly references gourmet ingredients:
- **Marrom Chocolate (`#5A3825`)**: The primary brand anchor. Used for primary interactive CTAs, high-priority typography, deep containers, and brand icon badges.
- **Caramelo (`#B8793E`)**: The secondary accent. Used for active indicators, secondary action buttons, pricing highlights, ratings, and active tab states.
- **Bege (`#D8C3A5`)**: Structural warmth. Provides gentle dividers, container borders, decorative framing, and disabled button outlines.
- **Off-white (`#F5F1E8`)**: The primary viewport canvas. Creates an organic, welcoming atmosphere without the harsh contrast of pure `#FFFFFF`.
- **Creme (`#F2E6D0`)**: The primary card surface, input background, toggle track, and segmented chip fill.

### Functional Roles
- **Text Primary**: `#5A3825` on light surfaces; `#F5F1E8` on primary dark containers.
- **Text Muted**: `#8C654D` (accessible mid-tone derived from Marrom Chocolate).
- **Feedback Success**: `#3F6E45` (pistachio green).
- **Feedback Alert/Sale**: `#BD462A` (dulce de leche pimento).

## Typography

The typographic personality blends artisanal punch with literary warmth:
- **Headlines & Interface Labels (`Epilogue`)**: Provides a sculpted, geometric presence reminiscent of vintage bakery signage and confection packaging. Dense weights (600, 700, 800) anchor hierarchy and menu item names.
- **Body, Captions, & Descriptions (`Literata`)**: A grounded, readable slab/serif style that brings authentic craft, warmth, and culinary storytelling to ingredient lists, customer reviews, and dip descriptions.
- **Strictly No Emojis**: System copy and visual decorators never incorporate platform emojis. All iconography must use Google Material Symbols Outlined or Rounded in Marrom Chocolate or Caramelo.

## Layout & Spacing

This design system is optimized for mobile commerce web apps wrapped within a 430px max-width container when viewed on larger desktop monitors.

- **Grid Architecture**: Mobile runs on a 4-column fluid layout with a `16px` (`1rem`) outer page margin and `12px` inter-column gutters. Tablet/Desktop presentation centers the app frame at a maximum container width of `480px` (or a dual-column master-detail layout at `960px` max-width).
- **Rhythm**: Built on a modular 4px/8px base rhythm. Content clusters (e.g., churro title, topping tags, and price) share tight 4px–8px vertical stacks, while product cards maintain 16px separation.
- **Sticky Viewport Elements**: 
  - **Header**: Fixed top bar (`56px` height) with backdrop blur over `#F5F1E8` with safe-area padding.
  - **Bottom Order/Cart Drawer**: Fixed bottom floating pill or full-width sheet anchored with a minimum tap height of `56px` and `env(safe-area-inset-bottom)`.

## Elevation & Depth

Visual hierarchy uses a soft, organic surface stack paired with warm-tinted ambient drop shadows rather than heavy synthetic blacks:

- **Surface Base (Level 0)**: `#F5F1E8` (Off-white canvas).
- **Card Surface (Level 1)**: `#F2E6D0` (Creme) with a 1px solid border of `#D8C3A5`. Shadows are omitted or kept to `0 2px 8px rgba(90, 56, 37, 0.04)`.
- **Raised Interactive Surfaces (Level 2)**: Product item cards, active filters, and floating counters use `0 6px 16px -2px rgba(90, 56, 37, 0.08)` and border `#D8C3A5`.
- **Floating Overlays & Sticky Trays (Level 3)**: Sticky bottom cart summaries, quantity modals, and notification toasts use `0 12px 28px -4px rgba(90, 56, 37, 0.16)`.
- **Micro-transitions**: Press states compress downward by 1px with slight saturation dampening (`transform: scale(0.98)` over `120ms ease-out`).

## Shapes

The shape system adopts a rounded, bakery-soft geometry (Corner Radius: Level 2 / 8px–16px default), reflecting the pillowy, piped contours of fried churros:

- **Cards & Modals**: `16px` (`rounded-lg`) to `20px` (`rounded-xl`).
- **Buttons & Pill Chips**: `9999px` (Full pill shape) for filter chips, quantity counter steppers, and primary order triggers to optimize finger tap ergonomics.
- **Inputs & Dropdowns**: `12px` radius.
- **Dividers & Strokes**: Soft pill-capped lines (`border-radius: 9999px`).

## Components

### Buttons
- **Primary Action (Marrom Chocolate)**: Background `#5A3825`, text `#F5F1E8`, typography `label-lg`. Height `48px` to `52px` for thumb ease. Rounded pill shape (`rounded-full`). Includes Material Symbols (e.g., `shopping_bag`, `arrow_forward`).
- **Secondary Action (Caramelo)**: Background `#B8793E`, text `#FFFFFF`. Used for "Add Sauce", "Customize", or "Combo Upgrade".
- **Ghost/Tertiary Action**: Transparent background with a `1.5px` border of `#5A3825`, text `#5A3825`. Active states fill lightly with `rgba(90, 56, 37, 0.06)`.

### Chips & Flavour Selectors
- **Default/Inactive**: Background `#F2E6D0`, border `1px solid #D8C3A5`, text `#5A3825`, font `label-md`.
- **Selected**: Background `#5A3825`, border `1px solid #5A3825`, text `#F5F1E8`. Contains a leading check symbol (`check_circle`).

### Cards (Product & Combo Items)
- **Background**: `#F2E6D0`.
- **Borders**: `1px solid #D8C3A5`.
- **Aspect Ratio**: 1:1 image frame for churro photos with subtle rounded top corners (`14px`), followed by a 12px padded description section with item title in `headline-sm`, dipping options in `body-sm`, and price tag highlighted in `#B8793E`.

### Form Inputs & Text Fields
- **Container**: Background `#F2E6D0`, border `1.5px solid #D8C3A5`, text `#5A3825`.
- **Focus State**: Border color transitions smoothly to `#B8793E` with an outer ring of `0 0 0 3px rgba(184, 121, 62, 0.15)`.
- **Placeholder**: Color `#8C654D` at 60% opacity.

### Steppers & Quantity Adjusters
- Pill-shaped container filled with `#F5F1E8`, bounded by `#D8C3A5`. Includes two circular icon buttons (`remove`, `add`) in `#5A3825` flanking a centered bold count (`label-lg`).

### Sticky Bottom Cart Bar
- Full-bleed or floating margin tray with background `#5A3825`, text `#F5F1E8`, rounded top corners (`20px`) or floating pill (`16px` inset). Displays live count badge, delivery ETA indicator, and total price with immediate checkout navigation.