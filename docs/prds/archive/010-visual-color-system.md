# PRD 010: Visual Color System & Interaction Hierarchy

**Status:** complete
**Author:** Copilot
**Date:** 2026-02-26

## Goal

Formalize a visual color system and interaction hierarchy for the Ghostbusters Virginia website so colors are used consistently and intentionally across all components.

This is a **design system refinement**, not a redesign. The site already uses Ghostbusters red, supernatural green glow, dark navy/near-black backgrounds, and gray secondary controls — but colors are competing for attention and roles are inconsistent.

### Problems This PRD Solves

1. **Hardcoded green (`#00e676`) appears 30+ times** across pages instead of using tokens.
2. **No semantic role-based tokens exist** — the theme has generic `--color-accent` and `--color-glow-green` but nothing like `--color-action-primary` or `--color-accent-atmospheric`.
3. **Red ↔ green hover transitions are jarring** — the logo shadow switches from red to green on hover, inline links go from green to red (`--color-link` → `--color-link-hover`), social icons on the contact page switch from green to red on hover.
4. **`rgba(0, 230, 118, ...)` glow values are hardcoded everywhere** for card hovers, dividers, heading text-shadows, hero breathing animations, and particles — with no shared token.
5. **Some components hardcode token values** instead of referencing the variable (e.g., `rgba(10, 14, 19, ...)` instead of `var(--color-bg)` in HeroSection.css, `rgba(138, 148, 163, ...)` instead of `var(--color-text-muted)` in MotionToggle).

## Scope

### Included

- Explicit color role definitions (which color is used for what purpose)
- Semantic token names in `/src/styles/theme.css`
- Component-to-token mapping for all existing components
- Color hierarchy rules that prevent role conflicts
- Implementation checklist

### Excluded

- Layout changes
- Typography changes
- Spacing changes
- Structural changes
- New components or pages
- Accessibility contrast changes (existing ratios are maintained — only role assignment changes)

## Requirements

### 1. Define Explicit Color Roles

Each role specifies the color, its opacity, glow usage, and hover behaviour.

| Role                                 | Color                          | Token                          | Opacity                       | Glow                                | Hover Behaviour                     |
| ------------------------------------ | ------------------------------ | ------------------------------ | ----------------------------- | ----------------------------------- | ----------------------------------- |
| **Primary action**                   | Red `#c62828`                  | `--color-action-primary`       | 100%                          | Red glow on hover (`--shadow-glow`) | Lighten to `#e53935`                |
| **Primary action hover**             | Red `#e53935`                  | `--color-action-primary-hover` | 100%                          | Intensified red glow                | —                                   |
| **Secondary action**                 | White/light `#e2e6ec`          | `--color-action-secondary`     | 100% / 15% bg                 | None                                | White border + faint white fill     |
| **Atmospheric accent**               | Green `#00e676`                | `--color-accent-atmospheric`   | 70–100% (text), 20–50% (glow) | Green glow at reduced opacity       | Brighten glow, do not switch to red |
| **Atmospheric glow**                 | Green `rgba(0, 230, 118, *)`   | `--color-glow-atmospheric`     | 30% default                   | Yes — soft diffuse                  | Intensify to 50–70% on hover        |
| **Interactive hover (cards/panels)** | Green `rgba(0, 230, 118, *)`   | `--color-hover-glow`           | 25% border, 15% shadow        | Green border glow                   | —                                   |
| **Active navigation**                | Red `#e53935`                  | `--color-nav-active`           | 100%                          | Subtle red glow underline           | —                                   |
| **Navigation hover**                 | Red `#e53935`                  | `--color-nav-hover`            | 100%                          | Red underline slide-in              | —                                   |
| **Divider (structural)**             | Red gradient                   | `--color-divider-structural`   | 40–80% gradient               | Faint red glow                      | —                                   |
| **Divider (section)**                | Green gradient                 | `--color-divider-section`      | 40–70% gradient               | Faint green glow                    | —                                   |
| **Bullet / list marker**             | Green `rgba(0, 230, 118, 0.7)` | `--color-bullet`               | 70%                           | Soft green glow                     | Brighten on parent hover            |
| **Chip / badge**                     | Green `rgba(0, 230, 118, *)`   | `--color-chip`                 | 15% bg, 30% border, 80% text  | Faint green glow                    | Brighten subtly                     |
| **Section title**                    | Green `#00e676`                | `--color-heading-section`      | 100%                          | Green text-shadow                   | —                                   |
| **Focus ring**                       | Blue `#90caf9`                 | `--color-focus` (existing)     | 100%                          | None                                | —                                   |
| **Link (inline)**                    | Green `#00e676`                | `--color-link` (existing)      | 100%                          | None                                | Brighten to `#66ffaa`, **not** red  |
| **Link hover**                       | Bright green `#66ffaa`         | `--color-link-hover`           | 100%                          | Faint green underline glow          | —                                   |

### 2. Define Reusable Tokens

Add the following semantic tokens to `/src/styles/theme.css` under a new **"Semantic colour roles"** section. These map to the existing base palette tokens.

```css
/* -------------------------------------------------- */
/* Semantic colour roles                               */
/* -------------------------------------------------- */

/* Actions */
--color-action-primary: var(--color-accent);
--color-action-primary-hover: var(--color-accent-hover);
--color-action-secondary: var(--color-text);
--color-action-secondary-hover: rgba(226, 230, 236, 0.15);

/* Atmospheric accent (supernatural green) */
--color-accent-atmospheric: #00e676;
--color-accent-atmospheric-muted: rgba(0, 230, 118, 0.7);
--color-glow-atmospheric: rgba(0, 230, 118, 0.3);
--color-glow-atmospheric-strong: rgba(0, 230, 118, 0.5);

/* Interactive hover (cards, panels, images) */
--color-hover-glow: rgba(0, 230, 118, 0.25);
--color-hover-glow-strong: rgba(0, 230, 118, 0.45);
--color-hover-border: rgba(0, 230, 118, 0.4);

/* Navigation */
--color-nav-active: var(--color-accent-hover);
--color-nav-hover: var(--color-accent-hover);

/* Dividers */
--color-divider-structural: var(--color-accent);
--color-divider-section: var(--color-accent-atmospheric);

/* Section headings */
--color-heading-section: var(--color-accent-atmospheric);

/* Bullets & list markers */
--color-bullet: var(--color-accent-atmospheric-muted);

/* Chips & badges */
--color-chip-text: var(--color-accent-atmospheric-muted);
--color-chip-border: rgba(0, 230, 118, 0.3);
--color-chip-bg: rgba(0, 230, 118, 0.08);

/* Shadows (semantic) */
--shadow-glow-atmospheric: 0 0 8px var(--color-glow-atmospheric);
--shadow-glow-atmospheric-strong: 0 0 12px var(--color-glow-atmospheric-strong);
--shadow-hover: 0 0 8px var(--color-hover-glow), 0 0 16px rgba(0, 230, 118, 0.15);
```

All existing base palette tokens (`--color-accent`, `--color-glow-green`, etc.) remain unchanged so nothing breaks. Semantic tokens reference them where possible.

### 3. Define Component Mapping

Each component must use **only** the semantic tokens defined above. No hardcoded hex values or raw `rgba()`.

| Component                  | Element                      | Token(s)                                                              |
| -------------------------- | ---------------------------- | --------------------------------------------------------------------- |
| **Header**                 | Nav link default             | `--color-text-muted`                                                  |
|                            | Nav link hover               | `--color-nav-hover` + underline using `--color-action-primary`        |
|                            | Nav active page              | `--color-nav-active` + `--shadow-glow`                                |
|                            | Top divider line             | `--color-divider-structural` gradient                                 |
|                            | Logo default glow            | `--shadow-glow` (red)                                                 |
|                            | Logo hover glow              | `--shadow-glow` (red, intensified) — **stop switching to green**      |
|                            | Logo sub-text hover          | `--color-action-primary-hover` — **stop switching to green**          |
| **Hero**                   | Section heading / typewriter | `--color-heading-section` + `--shadow-glow-atmospheric`               |
|                            | Purpose chips                | `--color-chip-text`, `--color-chip-border`, `--color-chip-bg`         |
|                            | Primary CTA                  | `--color-action-primary` / `--color-action-primary-hover`             |
|                            | Ghost button                 | `--color-action-secondary` (muted)                                    |
|                            | Image panel hover            | `--color-hover-border`, `--shadow-hover`                              |
|                            | Breathing glow               | `--color-glow-atmospheric`                                            |
|                            | Ooze divider                 | `--color-accent-atmospheric` gradient                                 |
| **Buttons**                | Primary bg                   | `--color-action-primary`                                              |
|                            | Primary hover bg             | `--color-action-primary-hover` + `--shadow-glow`                      |
|                            | Primary text                 | `--color-text-inverse` (or `#fff`)                                    |
|                            | Secondary border/text        | `--color-action-secondary`                                            |
|                            | Secondary hover              | `--color-action-secondary-hover` bg                                   |
| **Chips / StatusPill**     | Active state                 | `--color-chip-text`, `--color-chip-bg`                                |
|                            | Default / archived           | `--color-status-default`, `--color-status-archived`                   |
| **Section dividers**       | `::after` accent line        | `--color-divider-section` gradient + `--shadow-glow-atmospheric`      |
| **Structural dividers**    | Header/footer rule           | `--color-divider-structural` gradient + `--shadow-glow`               |
| **Bullet lists**           | `.glow-list li::before`      | `--color-bullet` + `--shadow-glow-atmospheric`                        |
|                            | Hover state                  | `--color-accent-atmospheric` + `--shadow-glow-atmospheric-strong`     |
| **Cards / Panels**         | Default border               | `--color-border`                                                      |
|                            | Hover border + glow          | `--color-hover-border`, `--shadow-hover`                              |
| **Inline links**           | Default                      | `--color-link` (green — unchanged)                                    |
|                            | Hover                        | `--color-link-hover` — **change from red to bright green `#66ffaa`**  |
| **Footer**                 | Divider                      | `--color-divider-structural` gradient                                 |
|                            | Link hover                   | `--color-link-hover` (bright green)                                   |
| **EventCountdown**         | Border                       | `--color-hover-border`                                                |
| **MotionToggle**           | On state                     | `--color-accent-atmospheric` + `--color-chip-border`                  |
|                            | Off state                    | `--color-text-muted`                                                  |
| **GhostParticles**         | Glow                         | `--color-glow-atmospheric`                                            |
| **Gallery slides**         | Hover glow                   | `--color-hover-border`, `--shadow-hover`                              |
| **Splide pagination**      | Active dot                   | `--color-accent-atmospheric`                                          |
| **Swag items**             | Hover glow                   | `--color-hover-border`, `--shadow-hover`                              |
| **Page titles**            | Color                        | `--color-heading-section` + `--shadow-glow-atmospheric`               |
| **Social links** (contact) | Icon                         | `--color-accent-atmospheric`                                          |
|                            | Hover                        | `--color-hover-border` + `--shadow-hover` — **stop switching to red** |

### 4. Define Hierarchy Rules

These rules prevent color conflicts and must be followed by all current and future components.

#### Rule 1: Green = atmosphere and identity; Red = action and navigation

| Colour    | Role                                                                          | Examples                                                                                    |
| --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Green** | Atmospheric accents, section identity, content highlights, passive indicators | Section headings, card hover glow, particles, bullets, chips, status "active", ooze divider |
| **Red**   | Interactive actions, navigation state, structural anchoring                   | Primary buttons, nav active/hover, header/footer divider, primary CTA                       |
| **Blue**  | Focus accessibility only                                                      | `:focus-visible` rings                                                                      |

#### Rule 2: No color-switching on hover

An element must **not** transition from one role color to another on interaction.

**Current violations to fix:**

| Element                | Current behaviour                | Required behaviour          |
| ---------------------- | -------------------------------- | --------------------------- |
| Logo glow              | Red → green on hover             | Stay red (intensify)        |
| Logo sub-text          | Red → green on hover             | Stay red (brighten)         |
| Inline links           | Green → red on hover             | Green → brighter green      |
| Social icons (contact) | Green → red on hover             | Green → brighter green glow |
| Panel links (about)    | Green → red text-shadow on hover | Green → brighter green glow |

#### Rule 3: No element uses both action-red and atmospheric-green simultaneously

Red and green must not appear on the same interactive element or within the same focusable target. Static co-existence in separate visual layers is acceptable (e.g., a red nav bar above green section headings).

#### Rule 4: Structural dividers are red; section dividers are green

- **Header / footer divider lines** → red gradient (structural, always-visible chrome)
- **Section heading underlines / content separators** → green gradient (content-level, atmospheric)

The two divider types must not share the same gradient.

#### Rule 5: Focus rings are always blue

No component may override the blue focus ring. `:focus-visible` always uses `--color-focus`.

#### Rule 6: Tokens over hardcoded values — always

After implementation, **no component** may contain a raw `#00e676`, `rgba(0, 230, 118, ...)`, `rgba(198, 40, 40, ...)`, or `rgba(10, 14, 19, ...)`. All must reference semantic or base tokens.

### 5. Implementation Checklist

Execute in this order. Each step can be a discrete commit.

#### Phase 1: Token Foundation

- [ ] Add semantic colour role tokens to `/src/styles/theme.css` (new section, below existing base palette tokens)
- [ ] Add semantic shadow tokens (`--shadow-glow-atmospheric`, `--shadow-hover`, etc.)
- [ ] Change `--color-link-hover` from `var(--color-accent-hover)` (red) to `#66ffaa` (bright green)
- [ ] Verify build passes — no visual changes yet since nothing consumes the new tokens

#### Phase 2: Core Components

- [ ] Update `Button.astro` — replace hardcoded `#fff` with `--color-text-inverse` or keep as `#fff` mapped to a token; replace any raw red with `--color-action-primary`
- [ ] Update `Panel.astro` — use `--color-hover-border` and `--shadow-hover` for hover states
- [ ] Update `StatusPill.astro` — replace hardcoded `rgba` values with token references
- [ ] Update `MotionToggle.astro` — replace hardcoded green/grey `rgba` values with tokens
- [ ] Update `RadarAccent.astro` — use `--color-glow-atmospheric` for sweep colour

#### Phase 3: Header & Footer

- [ ] Update `Header.astro` — replace all hardcoded `rgba(198, 40, 40, ...)` with `--color-divider-structural` / `--shadow-glow`; **fix logo hover** to stay red instead of switching to green; **fix logo sub-text hover** to stay red
- [ ] Update `Footer.astro` — replace hardcoded red divider rgba values with `--color-divider-structural`

#### Phase 4: Hero Section

- [ ] Update `HeroSection.tsx` — ensure all color references use CSS variables
- [ ] Update `HeroSection.css` — replace all hardcoded `rgba(0, 230, 118, ...)` with `--color-glow-atmospheric` / `--color-accent-atmospheric`; replace hardcoded `rgba(10, 14, 19, ...)` with `var(--color-bg)`; replace `#fff` with `var(--color-text)` or `var(--color-text-inverse)` as appropriate; update chip styles to use chip tokens
- [ ] Update `GhostParticles.tsx` — use `--color-glow-atmospheric` for particle glow

#### Phase 5: Page-Level Cleanup

For **each page** (`index.astro`, `events.astro`, `media.astro`, `about.astro`, `contact.astro`, `join.astro`, `donate.astro`, `code-of-conduct.astro`):

- [ ] Replace all hardcoded `#00e676` with `var(--color-heading-section)` or `var(--color-accent-atmospheric)` as appropriate
- [ ] Replace all hardcoded `rgba(0, 230, 118, ...)` glow/shadow values with the correct semantic token
- [ ] Replace all hardcoded `rgba(198, 40, 40, ...)` values with semantic tokens
- [ ] Replace all hardcoded `rgba(10, 14, 19, ...)` and `rgba(138, 148, 163, ...)` values with `var(--color-bg)` / `var(--color-text-muted)`
- [ ] Fix contact page social link hover: green → brighter green (not red)
- [ ] Fix about page panel link hover: green → brighter green (not red)

#### Phase 6: Validation

- [ ] Full-text search codebase for remaining hardcoded `#00e676`, `rgba(0, 230, 118`, `rgba(198, 40, 40`, `rgba(10, 14, 19` — confirm zero results outside `theme.css` base palette definitions
- [ ] Visual review of every page to confirm no unintended colour changes
- [ ] Confirm all hover states follow Rule 2 (no color-switching)
- [ ] Verify `prefers-reduced-motion` still disables all glow transitions
- [ ] Build passes with zero errors

## Acceptance Criteria

- [ ] Semantic colour role tokens are defined in `theme.css`
- [ ] No component contains hardcoded hex colours that duplicate a token (`#00e676`, `rgba(0,230,118,...)`, `rgba(198,40,40,...)`, `rgba(10,14,19,...)`)
- [ ] `--color-link-hover` is green (not red)
- [ ] Logo hover glow stays red (no green switch)
- [ ] Logo sub-text hover stays red (no green switch)
- [ ] Social link hover on contact page stays green (no red switch)
- [ ] All primary buttons use `--color-action-primary` tokens
- [ ] All section headings use `--color-heading-section` token
- [ ] All card/panel hovers use `--color-hover-border` + `--shadow-hover` tokens
- [ ] All bullet list markers use `--color-bullet` token
- [ ] Header/footer dividers use `--color-divider-structural`
- [ ] Section dividers use `--color-divider-section`
- [ ] Focus rings remain blue (`--color-focus`) everywhere
- [ ] No visual regressions — pages look the same (only hover conflict fixes are visible changes)
- [ ] `prefers-reduced-motion` and motion toggle still work correctly
- [ ] Build passes with zero errors

## Design Notes

### Current Color Audit Summary

The following hardcoded values were found across the codebase during the audit that preceded this PRD:

| Hardcoded Value            | Occurrences | Found In                                                                                                          |
| -------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| `#00e676`                  | ~30+        | Every page file, Header.astro                                                                                     |
| `rgba(0, 230, 118, ...)`   | ~50+        | Every page file, HeroSection.css, BaseLayout.astro, MotionToggle.astro, EventCountdown.astro, theme.css glow-list |
| `rgba(198, 40, 40, ...)`   | ~10         | Header.astro, Footer.astro, contact.astro, about.astro                                                            |
| `rgba(10, 14, 19, ...)`    | ~3          | HeroSection.css                                                                                                   |
| `rgba(138, 148, 163, ...)` | ~2          | MotionToggle.astro, StatusPill.astro                                                                              |
| `#fff`                     | ~10         | Button.astro, HeroSection.css, Header.astro, BaseLayout.astro, index.astro, donate.astro                          |

### Existing Implicit Color Hierarchy (Pre-PRD)

The site already follows a rough split — red for actions/nav, green for atmosphere/content — but the split is inconsistent. This PRD makes the split explicit and fixes the violations.

### Token Architecture

```
Base palette tokens (unchanged)
  └── --color-accent: #c62828
  └── --color-accent-hover: #e53935
  └── --color-glow: rgba(198,40,40,0.35)
  └── --color-glow-green: rgba(0,230,118,0.30)
  └── --color-link: #00e676
  └── ...

Semantic role tokens (new — references base palette)
  └── --color-action-primary: var(--color-accent)
  └── --color-accent-atmospheric: #00e676
  └── --color-heading-section: var(--color-accent-atmospheric)
  └── --color-divider-structural: var(--color-accent)
  └── ...

Components consume ONLY semantic tokens
```

## Notes

- This PRD intentionally does **not** introduce new colours. It organises existing colours into explicit roles.
- The `--color-link-hover` change from red to bright green is the most visible single change. It eliminates the most common red ↔ green conflict site-wide.
- Some `#fff` usages (e.g., primary button text) are acceptable as literal white on red — but should reference `--color-text-inverse` for consistency.
- The swag product cards use `#fff` as a white product-image background — this is intentional and not a token violation (it's content, not theme).
- After this PRD is implemented, any new component must reference semantic tokens — not base palette tokens or raw values.
- This PRD should be executed before any new page PRDs to ensure the foundation is consistent.
