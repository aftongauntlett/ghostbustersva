# PRD 007: Join, Contact & Donate Pages Redesign

**Status:** complete
**Author:** Copilot
**Date:** 2026-02-26

## Goal

Redesign the Join (`/join`), Contact (`/contact`), and Donate (`/donate`) pages to use the design system from PRD 002 and typography from PRD 003. These three pages share a similar structure — intro text, a CTA or info block, and supplementary notes — so they are batched into a single PRD for consistency.

## Scope

### Included

- Restyle all three pages using theme tokens and typography
- Replace inline button/CTA styles with `Button.astro`
- Wrap content sections in `Panel.astro` where appropriate
- Apply consistent heading, body, and muted text styles
- Ensure responsive layout and accessibility on all three pages
- Remove all hardcoded inline style values

### Excluded

- Contact form integration (deferred — see AGENT.md future enhancements)
- Donation payment integration (deferred — see AGENT.md future enhancements)
- New content or copy changes
- Complex animations

## Requirements

### Join Page (`/join`)

1. Replace inline styles with theme tokens.
2. Wrap the "What We Look For" list in a `Panel.astro` with `heading="What We Look For"`.
3. Wrap the "How to Apply" section in a `Panel.astro` with `heading="How to Apply"`.
4. Add a `<Button variant="primary" href="/contact">Get in Touch</Button>` CTA in the "How to Apply" panel.
5. Page title (`h1`) uses Orbitron via global heading styles.

### Contact Page (`/contact`)

1. Replace inline styles with theme tokens.
2. Replace the `.contact-placeholder` div with a `Panel.astro` with `heading="Contact Info"`.
3. Style the placeholder email/social info using `--font-mono` for a console feel.
4. Add a note using `--color-text-muted` and `--text-sm` for the "coming soon" message.
5. Page title (`h1`) uses Orbitron via global heading styles.

### Donate Page (`/donate`)

1. Replace inline styles with theme tokens.
2. Replace the `.donate-cta` div with a `Panel.astro` with `heading="Support Us"`.
3. Replace the inline `.donate-button` with `<Button variant="primary" disabled>Donate Now (Coming Soon)</Button>`.
4. Add a `<Button variant="secondary" href="https://www.teepublic.com/user/ghostbustersva" external>Visit Our Store</Button>` for the TeePublic link.
5. Page title (`h1`) uses Orbitron via global heading styles.

### Shared

6. All pages must have visible `:focus-visible` styles on interactive elements.
7. All pages must be responsive.
8. Build must pass with zero errors.

## Design Notes

### Common Page Structure

```
┌───────────────────────────────────┐
│  Page Title (h1)                  │
│  Intro paragraph                  │
│                                   │
│  ┌─ Panel: SECTION HEADING ─────┐ │
│  │  Content / list / CTA        │ │
│  │  [Button]                    │ │
│  └──────────────────────────────┘ │
│                                   │
│  ┌─ Panel: SECTION HEADING ─────┐ │
│  │  Additional content          │ │
│  └──────────────────────────────┘ │
│                                   │
│  Supplementary note (muted)       │
└───────────────────────────────────┘
```

## Acceptance Criteria

- [ ] No inline/hardcoded colour values remain in `join.astro`
- [ ] No inline/hardcoded colour values remain in `contact.astro`
- [ ] No inline/hardcoded colour values remain in `donate.astro`
- [ ] `Panel.astro` is used in all three pages
- [ ] `Button.astro` is used for all CTAs (replacing inline button styles)
- [ ] Contact info uses `--font-mono`
- [ ] All pages are responsive
- [ ] All interactive elements have visible focus styles
- [ ] Build passes with zero errors

## Notes

- The Contact and Donate pages currently have placeholder content. That's fine — the visual redesign applies the design system to the existing placeholder structure.
- Future PRDs will add real form integration (Contact) and payment integration (Donate).
- The `.sr-only` class in `donate.astro` can be removed — it's already defined globally in `Header.astro` and should be moved to `theme.css` if not already there.
