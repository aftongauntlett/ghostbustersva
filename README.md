# Ghostbusters Virginia — Website

The official website for **Ghostbusters Virginia (GBVA)**, Virginia's community Ghostbusters franchise. Built with [Astro](https://astro.build), TypeScript, and markdown-based content.

> **New here?** Start with [How This Website Works](#how-this-website-works) if you're non-technical, or jump to [Developer Setup](#developer-setup) if you're ready to code.

---

## How This Website Works

This is a **static website** — think of it like a brochure that gets regenerated whenever we make changes, rather than a live app with a database behind it.

- **Pages** (Home, About, Events, Media, Join, Contact, Donate) are built from template files and deployed as plain HTML.
- **Content** (events, gallery photos) is written in simple Markdown files — no CMS login required, but you do need to edit files in the repo.
- When a developer pushes changes to the `main` branch, the site automatically rebuilds and deploys within minutes.
- The site rebuilds on a daily schedule so time-sensitive content (like event status) stays current.

There is no admin dashboard or database. All content lives in this repository as files.

---

## Ownership & Accounts

This project is **owned by the Ghostbusters Virginia organization**, not any single person. If a maintainer steps away, the team retains full control.

| Resource                      | Where                      | Who Has Access               |
| ----------------------------- | -------------------------- | ---------------------------- |
| Domain (`ghostbustersva.com`) | Registrar (org account)    | GBVA leadership              |
| GitHub repo                   | `github.com` (org account) | All GBVA developers          |
| Hosting (Vercel)              | Vercel project             | GBVA developers + leadership |

**Why org-owned accounts matter:** If credentials are tied to one person's email, the team loses access when that person leaves. Always use shared org accounts or ensure multiple admins are configured.

---

## How Updates Happen

| What                                      | How                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------ |
| Add/edit an event                         | Edit or create a Markdown file in `src/content/events/`, open a PR       |
| Add gallery photos                        | Add an image to `images/`, create a `.md` file in `src/content/gallery/` |
| Change page text or layout                | Edit the `.astro` file in `src/pages/`, open a PR                        |
| Change site-wide settings (nav, metadata) | Edit `src/config.ts`                                                     |
| Deploy to production                      | Merge a PR to `main` — deploy is automatic                               |

All changes go through a **pull request** so someone else can review before they go live.

> **Future path:** A headless CMS or admin UI could be added later so non-developers can edit content directly. For now, a developer handles all changes.

---

## Who to Contact / How to Request Changes

- **Want something changed on the site?** Open a GitHub Issue describing what you need, or message the team on our internal channel.
- **Found a bug?** Open a GitHub Issue with what you saw, what you expected, and what page it was on.
- **Want to contribute code?** See [docs/contributing.md](docs/contributing.md) for the developer onboarding guide.

Current maintainers are listed in the GitHub repo's team/contributors list.

---

## Developer Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes with Node)
- Git

### Quick Start

```bash
git clone <repo-url>
cd ghostbustersva
npm install
npm run dev          # starts dev server at localhost:4321
```

### Available Scripts

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

**Always run `npm run check` before pushing.** It runs the type checker, linter, formatter check, and tests in one shot.

### Build & Deploy Overview

1. Developer pushes to `main` (or merges a PR).
2. Vercel detects the change and runs `npm run build`.
3. The static output (`dist/`) is deployed to the CDN.
4. A daily scheduled rebuild keeps date-derived content (event status) current.

See [docs/runbooks/deployment.md](docs/runbooks/deployment.md) for the full deployment runbook and rebuild cadence.

### Environment Variables

No secrets are required for local development. The site is fully static.

- `.env` / `.env.production` — used for any future integrations (analytics, form backends). These files are git-ignored.
- `astro.config.mjs` sets `site: "https://ghostbustersva.com"` for canonical URLs and sitemap generation.

### Basic Troubleshooting

| Problem                   | Fix                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `npm run dev` fails       | Delete `node_modules` and run `npm install` again                                                              |
| Type errors after pulling | Run `npm run typecheck` — you may need to restart the Astro dev server                                         |
| Events show wrong status  | Event status is date-based at build time. Rebuild locally with `npm run build` to see current classification   |
| Styles look wrong         | Make sure `src/styles/theme.css` is imported (it's loaded via `BaseLayout.astro`)                              |
| Tests fail                | Run `npm run test` for details. Check that content schemas in `src/content.config.ts` match your content files |

---

## Project Structure

```
src/
├── components/         # Reusable Astro/React components
│   └── ui/             # Design-system primitives (Button, Panel, StatusPill)
├── content/            # Markdown content collections
│   ├── events/         # Event entries (upcoming + past)
│   └── gallery/        # Gallery/photo entries
├── layouts/            # Page layouts (BaseLayout wraps every page)
├── lib/                # Shared utilities (events, images, motion)
├── pages/              # File-based routes (each file = one URL)
├── styles/             # Global CSS and design tokens (theme.css)
├── config.ts           # Site-wide config (nav links, metadata, footer)
└── content.config.ts   # Content collection schemas (Zod validation)
images/                 # Source images (processed at build time)
public/                 # Static assets served as-is (robots.txt, etc.)
docs/
├── contributing.md     # Developer onboarding and conventions
├── ai-usage.md         # How AI tools are used in this project
├── prds/               # Product Requirement Documents
│   └── archive/        # Completed PRDs
└── runbooks/
    └── deployment.md   # Deploy process and rebuild cadence
```

---

## Adding Content

### Events

Create a new `.md` file in `src/content/events/`:

```md
---
title: "Event Name"
date: 2026-06-01
endDate: 2026-06-02 # optional, for multi-day events
summary: "A short description of the event."
location: "Venue, City, VA"
image: "/images/photo.jpg" # optional
url: "https://example.com" # optional, must be http/https
status: "upcoming" # optional override: upcoming | past
---

Full markdown description here.
```

Event status is automatically derived from dates at build time. Use `status` only for explicit overrides. See [docs/runbooks/deployment.md](docs/runbooks/deployment.md) for rebuild cadence.

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

Place images in the `/images` directory. Reference them as `/images/filename.jpg` in content frontmatter and components. They are processed by Astro's image pipeline at build time.

---

## Further Reading

- [Developer Onboarding & Conventions](docs/contributing.md)
- [AI Usage Guide](docs/ai-usage.md)
- [Deployment Runbook](docs/runbooks/deployment.md)
- [PRD Workflow](docs/prds/README.md)
- [AGENT.md](AGENT.md) — project vision and north star

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
