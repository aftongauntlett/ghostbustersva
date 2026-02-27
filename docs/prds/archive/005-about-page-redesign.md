# PRD 005: About Page Redesign

**Status:** complete
**Author:** Copilot
**Date:** 2026-02-26

## Goal

Redesign the About page (`/about`) to use the design system from PRD 002 and typography from PRD 003. The About page should feel like a "dossier briefing" — organized, clear, and atmospheric. Use Panels to separate content sections and apply consistent theme tokens throughout.

## Scope

### Included

- Restyle the About page using theme tokens and typography
- Wrap content sections (intro, mission) in `Panel.astro` components
- Apply consistent heading and body text styles via theme tokens
- Ensure the page is responsive and accessible
- Remove all hardcoded/inline style values that duplicate theme tokens

### Excluded

- New content or copy rewrites
- Adding images or media to the About page
- Complex animations
- Changes to Header/Footer

## Requirements

1. Replace all inline colour and font values in `about.astro` `<style>` with theme tokens.
2. Wrap the intro text in a `Panel.astro` (no heading, or with a subtle heading like "Who We Are").
3. Wrap the "Our Mission" section in a `Panel.astro` with `heading="Our Mission"`.
4. Use the `h1` for the page title — it should inherit Orbitron from global heading styles.
5. Style the mission list items with consistent spacing and `--color-text-muted`.
6. Ensure all text meets WCAG AA contrast requirements.
7. All interactive elements (links) must have visible `:focus-visible` styles.
8. Build must pass with zero errors.

## Design Notes

### Layout

```
┌─────────────────────────────────────┐
│  About Ghostbusters Virginia  (h1)  │
├─────────────────────────────────────┤
│  ┌─ Panel ────────────────────────┐ │
│  │ Intro paragraph text...        │ │
│  │ Second paragraph...            │ │
│  └────────────────────────────────┘ │
│                                     │
│  ┌─ Panel: OUR MISSION ──────────┐ │
│  │ • Celebrate and promote...     │ │
│  │ • Support charitable causes... │ │
│  │ • Provide a welcoming space... │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Visual Treatment

- Page background: inherits `--color-bg`
- Panels: `--color-surface` background, subtle border, glow on hover
- Headings: Orbitron via `--font-heading`
- Body text: Inter via `--font-body`, `--color-text-muted`

## Acceptance Criteria

- [ ] No inline/hardcoded colour values remain in `about.astro` styles
- [ ] At least two `Panel.astro` components are used to structure content
- [ ] Page title uses `--font-heading` (Orbitron)
- [ ] Body text uses `--font-body` (Inter) and `--color-text-muted`
- [ ] Page is responsive and readable on mobile
- [ ] All links have visible focus styles
- [ ] Build passes with zero errors

## Notes

- Keep the existing copy exactly as-is — this is a visual redesign only.
- The About page is a good proving ground for the Panel component since the content is simple and structured.
