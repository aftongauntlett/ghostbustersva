# PRD 002: Theme and Design Foundation

**Status:** complete
**Author:** Copilot
**Date:** 2026-02-25

## Goal

Establish the foundational design system for the Ghostbusters Virginia site.

This is not a page-specific feature. This PRD creates reusable, accessible, and theme-consistent design primitives that all future pages will build on.

The design direction is **"Atmospheric paranormal console"** — industrial, subtle glow, professional, accessible. Not cartoonish, not gimmicky. No heavy animations yet.

## Scope

### Included

- Global theme tokens (`/src/styles/theme.css`)
- Color system (backgrounds, text, glow, borders, focus)
- Typography system (font scale, weights, line height)
- Base layout container (already exists — extend via tokens)
- Base panel component (`/src/components/ui/Panel.astro`) — console-style container
- Base button component (`/src/components/ui/Button.astro`) — primary/secondary variants
- Status / indicator component (`/src/components/ui/StatusPill.astro`) — default, active, archived states
- Radar accent component (`/src/components/ui/RadarAccent.astro`) — subtle CSS-only decorative element
- Navigation active state styling — visible focus, accessible contrast, subtle glow
- Reduced-motion support across all components
- High-contrast safe defaults

### Excluded

- Complex animations or motion effects (deferred to future PRD)
- Sound effects
- Page-specific layout redesigns
- Fancy hero sections
- JavaScript-dependent UI behaviour

## Requirements

1. Create `/src/styles/theme.css` with CSS custom properties for colors, backgrounds, text, glow, borders, and focus states.
2. Include `prefers-reduced-motion` media query to disable all animations/transitions when requested.
3. Ensure all colour pairings meet WCAG AA contrast requirements.
4. Create `Panel.astro` — a reusable console-style container with border glow and optional heading slot.
5. Create `Button.astro` — primary and secondary button variants with accessible focus styles. Accept `href` prop to render as `<a>` when needed.
6. Create `StatusPill.astro` — a small indicator badge supporting `default`, `active`, and `archived` states.
7. Create `RadarAccent.astro` — a pure-CSS decorative radar sweep using `conic-gradient`. Must disable animation under `prefers-reduced-motion`.
8. Update Header navigation to include subtle glow/indicator on active links with accessible contrast.
9. Import `theme.css` in `BaseLayout.astro` so tokens are available site-wide.
10. Do not break any existing page functionality.

## Design Notes

### Colour Palette

| Token                  | Value                  | Purpose                           |
| ---------------------- | ---------------------- | --------------------------------- |
| `--color-bg`           | `#0a0e13`              | Page background — deep blue-black |
| `--color-surface`      | `#111820`              | Card / panel surface              |
| `--color-surface-alt`  | `#19202b`              | Elevated surface                  |
| `--color-text`         | `#e2e6ec`              | Primary text                      |
| `--color-text-muted`   | `#8a94a3`              | Secondary / muted text            |
| `--color-accent`       | `#c62828`              | Ghostbusters red                  |
| `--color-accent-hover` | `#e53935`              | Red hover state                   |
| `--color-glow`         | `rgba(198,40,40,0.35)` | Red glow for borders/shadows      |
| `--color-glow-green`   | `rgba(0,230,118,0.30)` | Console green glow                |
| `--color-border`       | `#1e2a38`              | Default border colour             |
| `--color-focus`        | `#90caf9`              | Focus ring colour                 |

### Typography

- System font stack (already defined)
- Font scale uses `rem` with modular scale
- Headings: semi-bold to bold, slight letter-spacing
- Body: 1.6 line-height

### Component Patterns

- **Panel**: Dark surface, 1px border with subtle glow, slight border-radius
- **Button**: Solid fill for primary, outlined for secondary, clear focus ring
- **StatusPill**: Small rounded pill with colour-coded background
- **RadarAccent**: Circular element with conic-gradient sweep, slow rotation

## Acceptance Criteria

- [x] `/src/styles/theme.css` exists and defines all design tokens
- [x] `theme.css` is imported in `BaseLayout.astro` and tokens are available globally
- [x] `Panel.astro` renders a styled container and accepts slotted content
- [x] `Button.astro` supports `variant="primary"` and `variant="secondary"` props
- [x] `Button.astro` renders as `<a>` when `href` is provided, `<button>` otherwise
- [x] `StatusPill.astro` supports `status="default"`, `status="active"`, and `status="archived"` props
- [x] `RadarAccent.astro` renders a CSS-only radar animation
- [x] All animations stop under `prefers-reduced-motion: reduce`
- [x] All interactive elements have visible `:focus-visible` styles
- [x] Navigation active link has a visible indicator with accessible contrast
- [x] No existing pages are broken
- [x] All components use semantic HTML

## Notes

- The existing `:root` variables in `BaseLayout.astro` will be migrated into `theme.css` for centralisation. The old inline values remain as fallbacks until all pages are verified.
- Future PRDs for individual page redesigns will compose these primitives rather than defining their own one-off styles.
