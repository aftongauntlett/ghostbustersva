# Editing Guide

> A practical guide for editors of the Ghostbusters Virginia website.
>
> **This file is in a private repository** — only invited collaborators can view it.

---

## Table of Contents

- [What is this CMS?](#what-is-this-cms)
- [Quick Start](#quick-start)
- [CMS Sidebar Overview](#cms-sidebar-overview)
- [Editing Page Copy](#editing-page-copy)
- [Editing Events](#editing-events)
- [Gallery (photos)](#gallery-photos)
- [Videos](#videos)
- [News](#news)
- [What Happens When You Save](#what-happens-when-you-save)
- [Branches (draft workspaces)](#branches-draft-workspaces)
- [Troubleshooting](#troubleshooting)
- [Glossary](#glossary)

---

## What is this CMS?

This is **Keystatic** — a browser-based content editor for the Ghostbusters Virginia website. It lets you create and edit events, gallery photos, videos, news links, page text, and site-wide settings _without writing code_.

Everything you edit here gets saved as files in our GitHub repository. When those files change, the website automatically rebuilds and goes live within a couple of minutes.

> **Think of it like Google Docs for the website.**
> You edit content in your browser, hit Save, and the live site updates automatically.

---

## Quick Start

1. Go to `/admin` (or `/keystatic`) on the website.
2. Click **Sign in with GitHub**. You'll need a GitHub account with write access to the site's repo — ask the project lead if you don't have access.
3. Use the left sidebar to pick what you want to edit. The sidebar is organized into sections:
   - **Pages** — edit page titles, intros, and descriptions
   - **Content** — manage entries like events, photos, videos, and news
   - **Settings** — site-wide configuration
4. Make your changes in the editor form.
5. Click **Save** (the button at the top-right).
6. Wait 1–2 minutes for the site to rebuild, then check the live page.

---

## CMS Sidebar Overview

The sidebar is split into two main sections so it's clear what you're editing:

### Pages

These are **page editors** — each one lets you update the text, titles, and descriptions for a specific page on the site. There are no "entries" to add or delete; you're just editing the content that appears on that page.

| Sidebar Item | What It Edits                                        |
| ------------ | ---------------------------------------------------- |
| About Page   | Text and content on the About page                   |
| Join Page    | Text and requirements on the Join page               |
| Events Page  | Title and intro text on the Events page              |
| Media Page   | Title, intro, and section headings on the Media page |
| Contact Page | Text and service regions on the Contact page         |
| Donate Page  | Text on the Donate page                              |

### Content

These are **collections** — each one holds multiple entries that you can create, edit, and delete. This is where you manage events, photos, videos, and news links.

| Sidebar Item | What It Edits                                               |
| ------------ | ----------------------------------------------------------- |
| Events       | Event listings (title, date, location, summary, image, URL) |
| Gallery      | Photo gallery images shown on the Media page                |
| Videos       | YouTube videos shown on the Media page                      |
| News         | Press/news links shown in "In the News" on the Media page   |

### Settings

| Sidebar Item  | What It Edits                                     |
| ------------- | ------------------------------------------------- |
| Site Settings | Site name, description, social links, footer text |

> 💡 **Each item edits specific fields only.**
> You'll see a form with labeled fields — just fill them in and save. There's no free-form "type whatever you want" area.

---

## Editing Page Copy

When you click a page in the **Pages** section (e.g. "About Page", "Events Page"), you'll see a form with labeled text fields. These control the titles, intros, and descriptions shown on that page.

- **Page Title** — the big heading at the top of the page
- **Page Intro** — the subtitle or description below the title
- Other fields vary by page (e.g. section headings, mission items, service regions)

Just edit the text and click **Save**. The change will appear on the live site within a couple of minutes.

---

## Editing Events

### Adding a new event

1. Click **Events** in the sidebar (under Content).
2. Click **Create** (top-right).
3. Fill in the form fields — see the field reference below.
4. Click **Save**.

### Editing an existing event

Click the event title in the list to open it. Make your changes, then click **Save**.

### Field reference

| Field         | Required?   | Notes                                                                                                                                                                    |
| ------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Title         | ✅ Required | The event name. This also generates the URL slug.                                                                                                                        |
| Date          | ✅ Required | Start date in `YYYY-MM-DD` format. The date picker handles formatting.                                                                                                   |
| End Date      | Optional    | Only needed for multi-day events.                                                                                                                                        |
| Summary       | ✅ Required | A short description shown on the events list page.                                                                                                                       |
| Location      | Optional    | Venue name and city, e.g. "Richmond Raceway, Richmond, VA".                                                                                                              |
| Address       | Optional    | Street address if you want to be specific.                                                                                                                               |
| Event Image   | Optional    | Upload or pick a photo. It will be shown on the events page.                                                                                                             |
| Event URL     | Optional    | Link to an external page (Facebook event, Eventbrite, etc.). Must start with `http://` or `https://`.                                                                    |
| Status        | Optional    | Usually leave on **"Auto (date-based)"**. The site figures out if an event is upcoming or past based on the date. Only override this if you need to force a status.      |
| Extra Details | Optional    | A small text area at the bottom of the form. **This is not currently shown on the website** — use the Summary field for visible descriptions. You can ignore this field. |

> **Dates and times:** Events use dates only (no times). If you need to mention a time, include it in the Summary text, like "Doors open at 6 PM".

---

## Gallery (photos)

### Adding a gallery entry

1. Click **Gallery** in the sidebar (under Content).
2. Click **Create**.
3. Enter a **Title** (a short caption, e.g. "Ecto at the Car Show").
4. Upload or select an image using the **Gallery Image** field. You'll see a preview immediately.
5. Fill in the **Alt Text** — this is required and important for accessibility.
6. Click **Save**.

### How images work

- When you upload an image through the CMS, it's saved to the `public/images/gallery/` folder in the repo.
- The website automatically generates responsive sizes for fast loading — you don't need to resize images yourself.
- Use **JPG** for photos and **PNG** only if transparency is needed.
- Aim for images at least **1200px wide** for best quality.

### Alt text expectations

> ⚠️ **Alt text is required for every gallery image.**
>
> It helps screen readers describe the photo to visually impaired visitors. Write a short, literal description of what's in the image. Good examples:
>
> - "Ghostbusters Virginia members posing at the zoo event"
> - "The Ecto vehicle on display at a local car show"
> - "Kids high-fiving a Ghostbuster at the Halloween parade"

### Field reference

| Field         | Required?   | Notes                                                        |
| ------------- | ----------- | ------------------------------------------------------------ |
| Title         | ✅ Required | Short caption. Also used as the entry name in the list.      |
| Gallery Image | ✅ Required | Upload a photo. A preview appears immediately in the editor. |
| Alt Text      | ✅ Required | Describe the image in plain English. See guidance above.     |
| Date          | Optional    | When the photo was taken. Used for sorting (newest first).   |

---

## Videos

The **Videos** section manages YouTube videos shown on the Media page. Each entry is just a title and a YouTube video ID.

### Adding a video

1. Click **Videos** in the sidebar (under Content).
2. Click **Create**.
3. Enter the video **Title** (e.g. "Ghostbusters Virginia Trailer 2020").
4. Enter the **YouTube Video ID** — this is the code at the end of a YouTube URL. For example, in `https://www.youtube.com/watch?v=nkb_sAiDSRU`, the ID is `nkb_sAiDSRU`.
5. Optionally add a **Date** for sorting.
6. Click **Save**.

> 💡 **Finding the YouTube ID:** Open the video on YouTube. Look at the URL in your browser's address bar. The ID is the string of letters and numbers after `v=`.

---

## News

The **News** section manages press coverage and news links shown in the "In the News" section of the Media page.

### Adding a news link

1. Click **News** in the sidebar (under Content).
2. Click **Create**.
3. Enter the article **Title** (headline).
4. Enter the **Article URL** — the full link to the article.
5. Fill in **Source** (e.g. "13 News Now", "WAVY TV 10").
6. Add a **Date** and **Location**.
7. Write a short **Excerpt** — a sentence or two from the article.
8. Optionally upload a **Thumbnail Image**.
9. Click **Save**.

---

## What Happens When You Save

Here's what happens behind the scenes when you click **Save**:

1. **Your change is committed to GitHub.** Keystatic creates a "commit" (a saved snapshot) in the repository. Think of it like saving a document — but with a history of every version.
2. **Vercel detects the change.** Our hosting provider (Vercel) watches the repository. When it sees a new commit, it starts rebuilding the site.
3. **The site rebuilds.** This takes about 1–2 minutes. During this time, the old version of the site is still live.
4. **The new version goes live.** Once the build finishes, the updated site is deployed automatically. No extra steps needed.

> 💡 **You don't need to do anything after clicking Save.** Just wait a minute or two and refresh the page you edited to see your changes live.

---

## Branches (draft workspaces)

You may see a **branch selector** in the CMS toolbar. Here's what that means in plain language:

### What is a branch?

Think of a branch as a **safe copy** of the website. When you create a branch, you get your own workspace where you can make changes without affecting the live site. When you're happy with the changes, they can be merged back into the main version.

### The "main" branch

The `main` branch is the live version of the website. When you make changes on `main` and click Save, the live site updates automatically.

> 💡 **Most of the time, leave it on "main".** For everyday edits (updating an event, adding a photo), there's no need to create a branch. Just edit on `main` and save — it's the simplest workflow.

### When to use a branch

You might create a branch if you want to:

- Work on a big batch of changes (like adding 10 gallery photos) without them going live one at a time.
- Draft content that isn't ready to publish yet.
- Try something out without risk — if it doesn't look right, just abandon the branch.

### Creating a branch

1. Click the branch selector in the CMS toolbar.
2. Type a name for your branch. Use the prefix `cms/` followed by a short description, e.g. `cms/new-event-photos`.
3. Make your changes and save as usual.
4. When ready, ask the project lead to merge your branch — or if you're comfortable, create a Pull Request on GitHub.

> 🏷️ **Branch naming convention:** Always start branch names with `cms/` — for example `cms/holiday-event-update`. This keeps things organized and makes it easy to tell which branches are from CMS editors vs. developers.

> ⚠️ **Changes on branches are NOT live.** Only changes saved to `main` appear on the live website. A branch is private until merged.

---

## Troubleshooting

### Common issues

| Problem                                      | What to do                                                                                                                                                                                        |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Sign in with GitHub" doesn't work           | Make sure you have a GitHub account and that you've been added as a collaborator on the repo. Ask the project lead.                                                                               |
| I saved but the site hasn't updated          | Wait 2 minutes (+cache). Try a hard refresh (`Cmd+Shift+R` on Mac, `Ctrl+Shift+R` on Windows). Check that you saved on the `main` branch — changes on other branches don't go live automatically. |
| Image upload isn't working                   | Check the file format (JPG or PNG). Make sure the file isn't too large (under 5 MB is safe). Try refreshing the page and uploading again.                                                         |
| I accidentally deleted something             | Don't panic! Everything is saved in Git history. Contact the project lead — they can restore it from a previous version.                                                                          |
| The CMS looks different / things are missing | Try signing out and back in. If the issue persists, clear your browser cookies for this site and sign in again.                                                                                   |
| I see "local mode" instead of the real CMS   | This usually means the GitHub connection isn't configured. This should only happen in local development. On the live site, contact the project lead.                                              |

### Who to contact

If you're stuck, reach out to the **project lead** via the team's usual communication channel. You can also [open an issue on GitHub](https://github.com/ghostbustersva/ghostbustersva/issues) if you want to report a bug or request a feature.

---

## Glossary

| Term                  | What it means                                                                                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Branch**            | A separate workspace (like a copy) of the site where you can make changes without affecting the live version. Think "draft workspace". |
| **Entry**             | A single piece of content — one event, one gallery photo, one video, one news link.                                                    |
| **Save**              | Writes your changes to the repository. On the `main` branch, this triggers a site rebuild and your changes go live in ~2 minutes.      |
| **Publish**           | There's no separate "publish" step — saving on `main` _is_ publishing. The site rebuilds automatically.                                |
| **Commit**            | A saved snapshot of changes. Every time you click Save, a commit is created in Git. It's like a save point you can go back to.         |
| **Repository (repo)** | The project folder on GitHub that contains all the site's code and content files.                                                      |
| **Pull Request (PR)** | A request to merge changes from one branch into another (usually into `main`). Used for review and coordination.                       |
| **Deploy**            | The process of building the site and putting it online. Happens automatically — you never need to do this manually.                    |

---

_This guide is in the private repo at `docs/editing-guide.md`. Only collaborators with repo access can view it._
