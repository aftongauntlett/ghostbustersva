# Ghostbusters Virginia — Website

> **⚠️ NOT YET OFFICIAL**
> This site is a **demo / prototype** built to seek approval from **Ghostbusters Virginia (GBVA)** Virginia's community Ghostbusters franchise.

Built with [Astro](https://astro.build), TypeScript, and markdown-based content.

**New here?** Start with [How This Website Works](#how-this-website-works) if you're non-technical.

## Docs by Audience

- **Ghostbusters team / non-developers:** This README (sections above: overview, ownership, updates, contacts).
- **Developers / technical setup:** `docs/tech/` folder.
- **AI and planning docs:** `AGENT.md`, `copilot-instructions.md`, and `docs/prds/`.

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

> **Note:** While this is still a demo, accounts and infrastructure are managed by the project creator. If the project is approved and moves to official status, ownership would transfer to the Ghostbusters Virginia organization so no single person is a single point of failure.

| Resource    | Current State                 |
| ----------- | ----------------------------- |
| Domain      | TBD — pending approval        |
| GitHub repo | Personal account (demo phase) |
| Hosting     | Vercel (demo deployment)      |

---

## How Updates Happen

| What                                      | How                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------- |
| Add/edit an event                         | Edit or create a Markdown file in `src/content/events/`             |
| Add gallery photos                        | Add an image to `images/`, create a `.md` in `src/content/gallery/` |
| Change page text or layout                | Edit the `.astro` file in `src/pages/`                              |
| Change site-wide settings (nav, metadata) | Edit `src/config.ts`                                                |
| Deploy                                    | Push to `main` — deploy is automatic via Vercel                     |

> **If the project moves forward:** We would adopt a feature-branch → pull-request → code-review workflow to keep changes clean and reviewable. For now during the demo phase, changes are committed directly to keep things simple.

> **Future path:** A headless CMS or admin UI could be added later so non-developers can edit content directly. For now, a developer handles all changes.

---

## Who to Contact / How to Request Changes

- **Want something changed on the site?** Open a GitHub Issue describing what you need, or message the project lead directly.
- **Found a bug?** Open a GitHub Issue with what you saw, what you expected, and what page it was on.
- **Want to help?** See [docs/tech/contributing.md](docs/tech/contributing.md) for conventions and project structure.

---

## Team Quick Start

1. Share content updates (event details, copy changes, photo additions) with the project lead.
2. The project lead updates the files and deploys the latest demo.
3. Review the live demo and send feedback.
4. Repeat until ready to request official approval.

For day-to-day team use, this is all you need.

---

## Technical Docs (Developers)

- [Contributing Guide](docs/tech/contributing.md)
- [Deployment Guide](docs/tech/deployment.md)
- [AI Usage Guide](docs/tech/ai-usage.md)
- [PRD Workflow](docs/prds/README.md)
- [AGENT.md](AGENT.md) — AI project guide
