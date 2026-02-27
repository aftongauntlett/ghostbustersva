# PRD 003: Typography System

**Status:** complete
**Author:** Copilot
**Date:** 2026-02-25

## Goal

Implement a cohesive typography system for the Ghostbusters Virginia site that reinforces the "atmospheric paranormal console" design direction established in PRD 002.

Three typefaces, each with a distinct role:

- **Orbitron** — Headings. Industrial, geometric, sci-fi console feel.
- **Inter** — Body text. Clean, highly legible, excellent screen readability.
- **Share Tech Mono** — Technical labels, status text, mono-width UI elements.

## Scope

### Included

- Load Orbitron, Inter, and Share Tech Mono via Google Fonts
- Define CSS custom properties: `--font-heading`, `--font-body`, `--font-mono`
- Apply heading font to all `h1`–`h6` elements globally
- Apply body font to `html` / body text globally
- Update `--font-sans` and `--font-mono` tokens in `/src/styles/theme.css`
- Update `BaseLayout.astro` to include the Google Fonts `<link>`
- Ensure existing components still render correctly with the new fonts

### Excluded

- Animated text effects
- Custom font-face self-hosting (use Google Fonts CDN for now)
- Page-specific typography overrides
- Logo or wordmark font changes

## Requirements

1. Add Google Fonts `<link>` tags to `BaseLayout.astro` `<head>` for Orbitron (weights 500, 700), Inter (weights 400, 500, 600), and Share Tech Mono (weight 400).
2. Update `/src/styles/theme.css`:
   - Add `--font-heading: "Orbitron", var(--font-sans);`
   - Update `--font-body` (alias for `--font-sans`): `"Inter", system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;`
   - Update `--font-mono`: `"Share Tech Mono", "Fira Code", "Cascadia Code", monospace;`
3. Apply `--font-heading` to all heading elements (`h1`–`h6`) with appropriate letter-spacing (`--tracking-wide` or `--tracking-wider`).
4. Apply `--font-body` to `html` so all body text inherits it.
5. Do **not** use Orbitron for body text — it is a display face and harms readability at small sizes.
6. Respect `prefers-reduced-motion` — no animated text transitions.
7. Verify that `Panel.astro` headings, `Button.astro` labels, and `StatusPill.astro` text render correctly with the new fonts.
8. All text must remain readable — minimum effective contrast ratios from PRD 002 still apply.

## Design Notes

### Font Pairings

| Element        | Font            | Weight | Tracking            | Size                      |
| -------------- | --------------- | ------ | ------------------- | ------------------------- |
| `h1`           | Orbitron        | 700    | `--tracking-wide`   | `--text-4xl`              |
| `h2`           | Orbitron        | 700    | `--tracking-wide`   | `--text-3xl`              |
| `h3`           | Orbitron        | 500    | `--tracking-normal` | `--text-2xl`              |
| `h4`–`h6`      | Orbitron        | 500    | `--tracking-normal` | `--text-xl` / `--text-lg` |
| Body           | Inter           | 400    | `--tracking-normal` | `--text-base`             |
| Labels / pills | Share Tech Mono | 400    | `--tracking-wider`  | `--text-xs` / `--text-sm` |

### Google Fonts URL

```
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Orbitron:wght@500;700&family=Share+Tech+Mono&display=swap
```

Using `display=swap` ensures text remains visible while fonts load.

## Acceptance Criteria

- [ ] Google Fonts link is present in `<head>` via `BaseLayout.astro`
- [ ] `--font-heading`, `--font-body`, and `--font-mono` CSS variables are defined in `theme.css`
- [ ] All `h1`–`h6` elements render in Orbitron
- [ ] Body text renders in Inter
- [ ] `StatusPill.astro` and other technical labels use Share Tech Mono
- [ ] Orbitron is NOT used for body/paragraph text
- [ ] No animated text effects are introduced
- [ ] Existing pages render correctly with the new fonts
- [ ] Build passes with zero errors

## Notes

- Google Fonts CDN is acceptable for now. A future PRD may self-host fonts for performance and privacy.
- The `Panel.astro` heading already uses `text-transform: uppercase` and wide tracking — Orbitron will pair well with this.
- `Button.astro` labels should use the body font (Inter) for readability at small sizes, not Orbitron.
