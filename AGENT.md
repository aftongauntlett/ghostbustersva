# AGENT.md — Project North Star

## Vision

Build a fast, accessible, content-driven website for **Ghostbusters Virginia** — a community Ghostbusters franchise. The site should feel atmospheric and on-brand (dark theme, Ghostbusters red accents) while being welcoming, easy to navigate, and performant on any device.

## Tone

- **Fun but professional.** We're Ghostbusters — we can be playful, but the site should feel trustworthy and community-focused.
- **Inclusive.** Content should be welcoming to fans of all ages and backgrounds.
- **Clear.** No jargon, no walls of text. Every page has a purpose.

## Page Map

| Route      | Purpose                                                    |
| ---------- | ---------------------------------------------------------- |
| `/`        | Hero, quick intro, CTA to join                             |
| `/about`   | Who we are, mission, history                               |
| `/events`  | Upcoming + past events from content collection             |
| `/media`   | Photos and videos from events                              |
| `/join`    | How to become a member                                     |
| `/contact` | Contact form / info                                        |
| `/donate`  | Donation info and CTA (integration TBD)                    |
| Store      | External link to TeePublic (configured in `src/config.ts`) |

## Future Enhancements

These are ideas for later PRDs — do NOT implement until a PRD is written and approved:

- **Motion / hover effects**: Subtle Ghostbusters-themed animations (e.g., ghost particle effects, proton beam hover trails). Must include a user toggle to disable.
- **Sound effects**: Optional ambient sounds with a clear mute control. Muted by default.
- **Contact form integration**: Replace placeholder with a real form (Formspree, Netlify Forms, etc.).
- **Donation integration**: Connect to a real payment flow (PayPal, Stripe, etc.).
- **Event detail pages**: Individual pages for each event rendered from markdown.
- **Gallery lightbox**: Click-to-expand image viewer for the media page.
- **SEO enhancements**: Open Graph images, structured data, sitemap.
- **Analytics**: Privacy-respecting analytics (Plausible, Fathom).
- **Blog / news section**: Content collection for news posts.

## Development Workflow

1. **Write a PRD** in `docs/prds/` before starting any feature.
2. **Implement** the feature in small, focused commits.
3. **Run checks** (`npm run check`) before committing.
4. **Mark the PRD as complete** by adding a `status: complete` note at the top.
5. **Move on** to the next feature.

## Tech Stack & Constraints

- Astro (static output, no SSR)
- TypeScript (strict)
- Markdown content collections
- No heavy frameworks — Astro components only (for now)
- No backend or database
- Accessibility is a hard requirement, not a nice-to-have
