# PRD 009: Motion & Effects

**Status:** complete
**Author:** Copilot
**Date:** 2026-02-26

## Goal

Add atmospheric motion effects across the site to reinforce the "paranormal console" design direction. Effects are split into two tiers:

1. **Site-wide micro-interactions** — lightweight CSS/vanilla JS effects (hover glows, fade-ins, nav animations).
2. **Hero showcase** — a rich, interactive hero section using React + Framer Motion as a scoped Astro island, featuring Ghostbusters-themed entrance animations, floating ghost particles, 3D tilt, typewriter heading, and a proton stream border.

All effects must be non-essential, respect `prefers-reduced-motion`, and integrate with a global motion toggle. No effect should distract from content or harm usability.

## Scope

### Included

#### Tier 1: Site-wide micro-interactions (CSS / vanilla JS)

- Subtle hover effects on Panels (border glow transition) ✅
- Button hover/press micro-interactions ✅
- Page section fade-in on scroll (using `IntersectionObserver`) ✅
- Nav link hover underline animation ✅
- Radar sweep speed/opacity variations ✅
- A global motion toggle (stored in `localStorage`, respecting OS preference) ✅
- `prefers-reduced-motion` support for all effects ✅

#### Tier 2: Hero showcase (React + Framer Motion island)

- **Staggered entrance animations** — title, description, and CTA buttons cascade in with spring physics on page load ✅
- **Floating ghost particles** — moved to site-wide (see below) ✅
- **3D tilt on image panel** — mouse-tracking perspective tilt on the Ecto vehicle photo, giving it a holographic containment-unit feel ✅
- **Typewriter heading** — "Who Ya Gonna Call?" types out letter by letter with a flickering ghost-green glow (PKE meter readout aesthetic) ✅
- ~~**Proton stream border**~~ — removed per feedback; replaced with ectoplasm ooze divider
- **Ectoplasm ooze divider** — a dripping green slime SVG divider below the hero section, reinforcing the Ghostbusters green palette ✅
- **Equal-height layout fix** — both hero panels match height; the image no longer overflows the card boundary ✅

#### Site-wide ambient effects (React island in BaseLayout)

- **Floating ghost particles** — 16 ghost SVGs drift upward across the full viewport on every page, with green glow. Bigger and more visible than hero-only version. ✅

### Excluded

- Sound effects (separate future PRD)
- Full page transitions
- Video backgrounds
- Proton stream border (tried it, felt too busy — removed in favour of ooze divider)

## Requirements

### Tier 1: Site-wide

1. Create `/src/components/ui/MotionToggle.astro` — a button/switch in the footer or header that lets users enable/disable motion effects. State persisted in `localStorage`.
2. When motion is disabled (either by toggle or `prefers-reduced-motion`), all animations and transitions must stop. Use a `data-reduce-motion` attribute on `<html>` or a CSS class.
3. Add a subtle fade-in effect for page content sections using `IntersectionObserver`. Elements should fade in once as they enter the viewport.
4. Add a smooth border-glow transition on `Panel.astro` hover (this partially exists — refine timing and easing).
5. Add a subtle scale/shadow micro-interaction on `Button.astro` hover and active states.
6. Add nav link hover underline animation (slide-in from left).

### Tier 2: Hero showcase

7. Add `@astrojs/react` integration to `astro.config.mjs`. React is used for the hero island and the site-wide ghost particles — all other components remain `.astro`.
8. Create `/src/components/HeroSection.tsx` — a React component rendered as an Astro island (`client:load`) containing hero effects.
9. **Staggered entrance**: Use Framer Motion `motion` components with `variants` and `staggerChildren` to cascade the heading, paragraph, and buttons into view with spring easing.
10. **3D tilt**: Track mouse position over the image panel and apply `rotateX`/`rotateY` transforms via Framer Motion's `useMotionValue` + `useTransform`. Max tilt ±8°. Resets smoothly on mouse leave.
11. **Typewriter heading**: Animate "Who Ya Gonna Call?" character-by-character with staggered delays. Add a subtle green text-shadow glow that pulses once after typing completes.
12. **Ectoplasm ooze divider**: An SVG dripping slime shape below the hero section using green gradient, providing a thematic section break.
13. **Equal-height panels**: Both hero grid columns use `align-items: stretch`. The image uses `object-fit: cover` constrained to 100% of its panel, not a fixed `max-height`.

### Site-wide ambient

14. Create `/src/components/GhostParticles.tsx` — a React island rendered in `BaseLayout.astro` (`client:load`) that shows 16 floating ghost SVGs across the full viewport on every page.
15. Particles use green colour with drop-shadow glow, randomised size (18–34px), drift, and staggered timing.

### Cross-cutting

16. All motion must use `will-change` sparingly and avoid layout thrashing.
17. All motion must be purely cosmetic — removing it should not break any functionality.
18. All React components must read the motion toggle state (from `data-reduce-motion` on `<html>` or `localStorage`) and disable all Framer Motion animations when motion is off.
19. Build must pass with zero errors.

## Design Notes

### Motion Principles

- **Subtle over flashy** — effects should feel atmospheric, not distracting
- **Purpose-driven** — each effect should provide feedback or reinforce the theme
- **Performant** — use CSS transitions/animations where possible, JS only for scroll-triggered effects and the hero island
- **Accessible** — `prefers-reduced-motion` and manual toggle always respected
- **Scoped complexity** — React + Framer Motion are justified only for the hero's interactive effects; the rest of the site stays lightweight

### Effect Inventory

| Element                   | Effect                         | Trigger          | Duration / Easing          |
| ------------------------- | ------------------------------ | ---------------- | -------------------------- |
| Panel                     | Border glow + shadow           | Hover            | 250ms ease                 |
| Button (primary)          | Slight scale-up + glow         | Hover            | 150ms ease                 |
| Button (active)           | Scale-down                     | Press            | 100ms                      |
| Nav link                  | Underline slide-in             | Hover            | 200ms ease                 |
| Page sections             | Fade-in from below             | Scroll into view | 400ms ease-out             |
| RadarAccent               | Sweep rotation                 | Continuous       | 4s linear                  |
| Hero heading              | Typewriter + green glow        | Page load        | ~1.2s total (staggered)    |
| Hero text / buttons       | Staggered slide-up + fade      | Page load        | 0.6s spring per item       |
| Hero image                | 3D perspective tilt            | Mouse move       | Continuous (smooth spring) |
| Hero ooze divider         | Static SVG drip (green)        | Always visible   | N/A (static)               |
| Site-wide ghost particles | Float upward with drift + glow | Continuous loop  | 8–18s per particle         |

### Motion Toggle

- Default state: respect `prefers-reduced-motion` OS setting
- If OS says reduce: toggle starts OFF, user can opt in
- If OS says no preference: toggle starts ON
- Persisted in `localStorage` as `motion-preference`
- The hero React component observes `data-reduce-motion` via `MutationObserver` or reads it on mount

### Framework Justification

React + Framer Motion are added as dependencies for the hero section only. Rationale:

- The hero requires coordinated, physics-based animations (spring easing, stagger orchestration, continuous particle loops, mouse-tracking transforms) that would be impractical to implement with CSS alone.
- Astro's island architecture (`client:load`) ensures React JS is only loaded for this one component — no framework overhead on other pages or sections.
- Framer Motion provides built-in `prefers-reduced-motion` support via `useReducedMotion()`, aligning with our accessibility requirements.

## Acceptance Criteria

### Tier 1: Site-wide

- [x] `MotionToggle.astro` exists and functions correctly
- [x] Motion preference is persisted in `localStorage`
- [x] `prefers-reduced-motion: reduce` disables all animations
- [x] User toggle disables all animations regardless of OS setting
- [x] Panel hover glow transition is smooth (250ms ease)
- [x] Button hover has subtle scale + glow effect
- [x] Page sections fade in on scroll (one-time, not repeating)
- [x] Nav links have hover underline animation

### Tier 2: Hero showcase

- [x] `@astrojs/react` integration is configured in `astro.config.mjs`
- [x] `/src/components/HeroSection.tsx` exists and renders as `client:load` island
- [x] Hero heading uses typewriter animation with green glow
- [x] Hero text and buttons stagger in with spring physics
- [x] Hero image panel responds to mouse movement with 3D tilt (max ±8°)
- [x] Ectoplasm ooze divider renders below the hero
- [x] Both hero panels are equal height; image does not overflow
- [x] Hero component respects motion toggle / `prefers-reduced-motion`

### Site-wide ambient

- [x] `/src/components/GhostParticles.tsx` exists and renders in `BaseLayout.astro` (`client:load`)
- [x] 16 ghost particles float upward with green glow on all pages
- [x] Particles respect `prefers-reduced-motion` and global toggle
- [x] Particles are `aria-hidden` and don't interfere with content

### Cross-cutting

- [x] No motion effect breaks functionality when disabled
- [x] No layout shift caused by any animation
- [x] React is only used in the hero and ghost particles islands — no other components converted
- [x] Build passes with zero errors

## Notes

- The reduced-motion infrastructure from PRD 002 (`theme.css`) already disables all `animation-duration` and `transition-duration` under `prefers-reduced-motion`. The motion toggle should layer on top of this.
- The `RadarAccent` component already handles its own reduced-motion. The toggle should also control it.
- Keep the Tier 1 effects as pure CSS/vanilla JS. The only React components are the hero and the ghost particles.
- The hero + ghost particles islands will increase the JS bundle. Measure the impact and ensure each stays reasonable (≤50 KB gzipped for Framer Motion + React chunk).
- Ghost particles were originally hero-only but moved to site-wide per feedback — they're more atmospheric when visible everywhere.
- Proton stream border was implemented but removed per feedback — it felt too busy. Replaced by the ectoplasm ooze divider which brings in more of the Ghostbusters green palette.
