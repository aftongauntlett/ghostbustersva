# PRD 004: Homepage Redesign

**Status:** complete
**Author:** Copilot
**Date:** 2026-02-26

## Goal

Redesign the homepage (`/`) to use the design system primitives from PRD 002 and the typography system from PRD 003. The homepage is the first page visitors see — it should immediately communicate the "atmospheric paranormal console" aesthetic while remaining welcoming and accessible.

## Scope

### Included

- Restyle the hero section using theme tokens and typography
- Replace the inline `.cta-button` with the `Button.astro` component
- Wrap content sections in `Panel.astro` where appropriate
- Add a secondary CTA (e.g., "View Events") using the secondary button variant
- Use the `RadarAccent.astro` component as a subtle decorative element
- Ensure responsive layout (mobile-first)
- Use semantic HTML throughout

### Excluded

- New content or copy changes (keep existing text)
- Complex hero animations (deferred to PRD 009)
- Adding new images or media
- Sound effects
- Layout changes to Header or Footer (those are global)

## Requirements

1. Replace all inline/hardcoded colour and font values in `index.astro` `<style>` with theme tokens (`--color-*`, `--text-*`, `--font-*`).
2. Replace the `.cta-button` anchor with `<Button variant="primary" href="/join">Join the Team</Button>`.
3. Add a secondary CTA: `<Button variant="secondary" href="/events">View Events</Button>`.
4. Use `--font-heading` for the `h1` (should already inherit from global heading styles after PRD 003).
5. Add a subtle `RadarAccent` somewhere in the hero area as a decorative flourish (e.g., beside the text or behind the image). Must not distract from content.
6. Style the hero image container with theme-consistent border, border-radius, and optional subtle glow.
7. Maintain the existing two-column desktop / single-column mobile responsive layout.
8. Remove all one-off style declarations that duplicate theme tokens.
9. All interactive elements must have visible `:focus-visible` styles.
10. Build must pass with zero errors.

## Design Notes

### Hero Layout (Desktop)

```
┌─────────────────────────────────────────────────┐
│  [Hero Image]         │  Who Ya Gonna Call?      │
│  (with subtle glow    │                          │
│   border)             │  Description text...     │
│                       │                          │
│                       │  [Join the Team] [Events]│
│                       │              🔘 Radar    │
└─────────────────────────────────────────────────┘
```

### Visual Treatment

- Hero image: `border-radius: var(--radius-md)`, 1px border with `--color-border`, subtle `--shadow-glow` on hover
- Heading: Orbitron, `--color-accent-hover`
- Body text: Inter, `--color-text-muted`
- Buttons: Use `Button.astro` component (no inline button styles)

## Acceptance Criteria

- [ ] No inline/hardcoded colour values remain in `index.astro` styles
- [ ] `Button.astro` is used for all CTAs
- [ ] `RadarAccent.astro` is present as a decorative element
- [ ] Hero section uses theme tokens for all visual properties
- [ ] Page is responsive (single column on mobile, two columns on desktop)
- [ ] All interactive elements have visible focus styles
- [ ] Build passes with zero errors
- [ ] Existing content and functionality are preserved

## Notes

- The hero image path (`/images/ghostbusters-car.jpg`) stays the same.
- This PRD intentionally avoids adding animated transitions — that's PRD 009's domain.
- After this PRD, the homepage should feel like a "console dashboard" rather than a generic white page.
