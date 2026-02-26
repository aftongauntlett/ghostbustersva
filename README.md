# Ghostbusters Virginia — Website

A fast, accessible, content-driven website for the Ghostbusters Virginia community franchise. Built with [Astro](https://astro.build), TypeScript, and markdown-based content collections.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Available Scripts

| Script              | Description                                    |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start dev server with hot reload               |
| `npm run build`     | Production build to `dist/`                    |
| `npm run preview`   | Preview the production build locally           |
| `npm run lint`      | Run ESLint                                     |
| `npm run lint:fix`  | Run ESLint with auto-fix                       |
| `npm run format`    | Format all files with Prettier                 |
| `npm run typecheck` | Run TypeScript type checking via `astro check` |
| `npm run test`      | Run unit tests with Vitest                     |
| `npm run check`     | Run typecheck + lint + format check + tests    |

## Project Structure

```
src/
├── components/       # Reusable Astro components (Header, Footer)
├── content/          # Markdown content collections
│   ├── events/       # Event entries (upcoming + past)
│   └── gallery/      # Gallery/photo entries (stub)
├── layouts/          # Page layouts (BaseLayout)
├── pages/            # File-based routes
│   ├── index.astro   # Home
│   ├── about.astro
│   ├── events.astro
│   ├── media.astro
│   ├── join.astro
│   ├── contact.astro
│   └── donate.astro
├── config.ts         # Centralised site config (nav, footer logos, etc.)
└── content.config.ts # Content collection schemas
images/               # Source images (logos, photos)
public/               # Static assets served as-is
docs/
└── prds/             # PRD documents per feature
```

## Adding Content

### Events

Create a new `.md` file in `src/content/events/`:

```md
---
title: "Event Name"
date: 2026-06-01
summary: "A short description of the event."
location: "Venue, City, VA"
image: "/images/photo.jpg" # optional
past: false # set to true for past events
---

Full markdown description here.
```

### Gallery

Create a new `.md` file in `src/content/gallery/`:

```md
---
title: "Photo Title"
image: "/images/photo.jpg"
alt: "Descriptive alt text for the photo"
date: 2026-06-01
---
```

### Images

Place images in the `/images` directory. Reference them with paths like `/images/filename.jpg` in content frontmatter and components. Images in `images/` at the repo root are served as static assets.

## Accessibility Notes

- **Skip link**: Every page includes a "Skip to main content" link for keyboard and screen-reader users.
- **Semantic HTML**: Pages use proper heading hierarchy, landmark regions (`<header>`, `<main>`, `<footer>`, `<nav>`), and ARIA labels.
- **Responsive nav**: Mobile navigation uses a `<details>` element — works without JavaScript.
- **Alt text**: All images require meaningful alt text. Logo images in the footer have descriptive alt attributes.
- **Color contrast**: The dark theme uses high-contrast text/background combinations.
- **Focus styles**: Interactive elements have visible focus indicators.

## Tech Stack

- **Astro** — Static site generator
- **TypeScript** (strict mode)
- **ESLint** + **Prettier** — Code quality and formatting
- **Vitest** — Unit testing
- **Markdown** — Content via Astro Content Collections
