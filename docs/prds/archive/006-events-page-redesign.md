# PRD 006: Events Page Redesign

**Status:** complete
**Author:** Copilot
**Date:** 2026-02-26

## Goal

Redesign the Events page (`/events`) to use the design system from PRD 002 and typography from PRD 003. Event cards should use `Panel.astro` for consistent styling, and `StatusPill.astro` should indicate whether an event is upcoming or past. The page should feel like a "mission board" — a clear operational overview.

## Scope

### Included

- Restyle event cards using `Panel.astro`
- Add `StatusPill.astro` to each event (active = upcoming, archived = past)
- Apply theme tokens to all visual properties
- Apply typography tokens to headings, dates, and body text
- Ensure responsive layout
- Remove all hardcoded inline styles that duplicate theme tokens

### Excluded

- Individual event detail pages (deferred to a future PRD)
- Adding new event content
- Complex animations
- Changes to the content collection schema

## Requirements

1. Replace all inline colour and font values in `events.astro` `<style>` with theme tokens.
2. Wrap each event in a `Panel.astro` component instead of the current `.event-card` div.
3. Add a `StatusPill` to each event: `status="active"` for upcoming events, `status="archived"` for past events.
4. Style event dates using `--font-mono` (Share Tech Mono) for a console-readout feel.
5. Style section headings ("Upcoming Events", "Past Events") using Orbitron via global heading styles.
6. Keep the image + info horizontal layout on desktop, stacked on mobile.
7. Past events should have reduced opacity (`0.7`) to visually de-emphasize them.
8. All interactive elements must have visible `:focus-visible` styles.
9. Build must pass with zero errors.

## Design Notes

### Event Card Layout

```
┌─ Panel ─────────────────────────────────┐
│  ┌──────────┐  Event Title        [●]   │
│  │  Image   │  2026-04-15        Active  │
│  │          │  Richmond, VA              │
│  │          │                            │
│  │          │  Summary text here...      │
│  └──────────┘                            │
└─────────────────────────────────────────┘
```

### Visual Treatment

- Event cards: `Panel.astro` with default styling
- Status: `StatusPill` top-right or after the title
- Date: `--font-mono`, `--color-accent-hover`
- Location: `--text-sm`, `--color-text-muted`
- Section dividers: `border-bottom: 1px solid var(--color-accent)` on `h2`

## Acceptance Criteria

- [ ] No inline/hardcoded colour values remain in `events.astro` styles
- [ ] Each event card uses `Panel.astro`
- [ ] Each event displays a `StatusPill` (active or archived)
- [ ] Event dates use `--font-mono`
- [ ] Section headings use `--font-heading`
- [ ] Responsive layout works on mobile and desktop
- [ ] Past events are visually de-emphasized
- [ ] Build passes with zero errors

## Notes

- The content collection schema (`content.config.ts`) already has a `past` boolean field — use this to determine the StatusPill state.
- This PRD does not add clickable event detail pages. That's a separate future PRD (event detail pages).
- The existing sort logic (upcoming first by date ascending, past by date descending) should be preserved.
