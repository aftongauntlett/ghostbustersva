# PRD 008: Media & Gallery Page Redesign

**Status:** complete
**Author:** Copilot
**Date:** 2026-02-26

## Goal

Redesign the Media page (`/media`) to use the design system from PRD 002 and typography from PRD 003. The page should present a polished image gallery grid using theme-consistent styling. Gallery items should pull from the `gallery` content collection and display in `Panel.astro`-styled cards.

## Scope

### Included

- Restyle the Media page using theme tokens and typography
- Render gallery items from the `gallery` content collection
- Display each gallery item in a styled card with image, title, and date
- Responsive grid layout (auto-fill columns)
- Apply consistent theme tokens to all visual properties
- Remove hardcoded placeholder styles

### Excluded

- Lightbox / click-to-expand viewer (deferred to a future PRD)
- Video embedding
- Uploading or adding new gallery content
- Complex animations

## Requirements

1. Replace all inline colour and font values in `media.astro` `<style>` with theme tokens.
2. Query the `gallery` content collection using `getCollection("gallery")` and render items dynamically.
3. Display each gallery item as a card with: image, title, and optional date.
4. Use a CSS grid layout: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` with `gap` using theme spacing.
5. Style each gallery card with theme-consistent borders, border-radius, and surface colours. Consider using `Panel.astro` or a lightweight card approach.
6. Gallery images should use `aspect-ratio: 16/9`, `object-fit: cover`, and `loading="lazy"`.
7. If the gallery collection is empty, show a friendly empty-state message.
8. Page title (`h1`) uses Orbitron via global heading styles.
9. All images must have meaningful `alt` text (sourced from the collection schema).
10. Build must pass with zero errors.

## Design Notes

### Gallery Grid Layout

```
┌─────────────────────────────────────────────┐
│  Media (h1)                                 │
│  Photos and videos from our events.         │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Image   │  │  Image   │  │  Image   │  │
│  │          │  │          │  │          │  │
│  ├──────────┤  ├──────────┤  ├──────────┤  │
│  │ Title    │  │ Title    │  │ Title    │  │
│  │ Date     │  │ Date     │  │ Date     │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                             │
│  More media coming soon...                  │
└─────────────────────────────────────────────┘
```

### Visual Treatment

- Card background: `--color-surface`
- Card border: `1px solid var(--color-border)`
- Card border-radius: `--radius-md`
- Image: full-width top of card, `aspect-ratio: 16/9`
- Title: `--text-sm`, `--weight-semibold`
- Date: `--font-mono`, `--text-xs`, `--color-text-muted`
- Hover: subtle `--shadow-glow` on the card

## Acceptance Criteria

- [x] No inline/hardcoded colour values remain in `media.astro` styles
- [x] Gallery items are rendered from the `gallery` content collection
- [x] Each gallery item displays an image, title, and optional date
- [x] Responsive grid layout adapts from 1 to 3+ columns
- [x] All images have `alt` text from the collection data
- [x] All images use `loading="lazy"`
- [x] Empty state is handled gracefully
- [x] Page title uses `--font-heading`
- [x] Build passes with zero errors

## Notes

- The `gallery` content collection already exists with a schema for `title`, `image`, `alt`, and optional `date`.
- Currently there is only one gallery item (`ecto-car-show.md`). The grid should still look good with a single item.
- A future PRD will add a lightbox / click-to-expand feature for gallery images.
- The existing hardcoded images in `media.astro` (`ghostbusters-car.jpg`, `virginia-logo.jpg`) should be replaced with collection-driven content.
