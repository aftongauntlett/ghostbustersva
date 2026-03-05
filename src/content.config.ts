/**
 * Astro Content Collections configuration.
 *
 * Defines schemas for markdown-based content (events, gallery)
 * and data-only content (settings — managed via Keystatic CMS).
 * See: https://docs.astro.build/en/guides/content-collections/
 */
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const safeExternalUrl = z
  .string()
  .url()
  .refine((value) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      return false;
    }
  }, "Event URLs must use http:// or https:// protocols.");

const events = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    /** ISO date string, e.g. "2026-04-15" */
    date: z.coerce.date(),
    /** Optional end date for multi-day events */
    endDate: z.coerce.date().optional(),
    /** Short summary shown in list views */
    summary: z.string(),
    /** Optional location / venue */
    location: z.string().optional(),
    /** Optional street address */
    address: z.string().optional(),
    /** Optional image path relative to /images */
    image: z.string().optional(),
    /** Optional external URL for the event (http/https only) */
    url: safeExternalUrl.optional(),
    /**
     * Optional explicit event status override.
     * If omitted or empty, status is derived from date/endDate at build time.
     * Empty string from CMS "Auto" selection is treated as undefined.
     */
    status: z
      .union([z.enum(["upcoming", "past"]), z.literal("")])
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    /**
     * Legacy status flag retained for backwards compatibility.
     * Prefer `status` for explicit overrides.
     */
    past: z.boolean().optional(),
  }),
});

const gallery = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    /** Image path relative to /images */
    image: z.string(),
    alt: z.string(),
    /** Optional date the photo was taken */
    date: z.coerce.date().optional(),
  }),
});

/**
 * Site settings singleton — managed via Keystatic CMS (PRD 012).
 * Stored as JSON at src/content/settings/site.json.
 */
const settings = defineCollection({
  loader: glob({ pattern: "site.json", base: "src/content/settings" }),
  schema: z.object({
    siteName: z.string(),
    siteDescription: z.string(),
    donateUrl: z.string().optional(),
    storeUrl: z.string().optional(),
    contactEmail: z.string().optional(),
    socialLinks: z
      .array(
        z.object({
          platform: z.string(),
          url: z.string().url(),
        }),
      )
      .optional()
      .default([]),
    footerText: z.string().optional(),
  }),
});

/**
 * Videos collection — YouTube videos shown on the Media page.
 * Managed via Keystatic CMS.
 */
const videos = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "src/content/videos" }),
  schema: z.object({
    title: z.string(),
    youtubeId: z.string(),
    date: z.string().optional(),
  }),
});

/**
 * News collection — press/news links shown on the Media page.
 * Managed via Keystatic CMS.
 */
const news = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "src/content/news" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    location: z.string().optional(),
    url: z.string().url(),
    source: z.string(),
    image: z.string().optional(),
    excerpt: z.string(),
  }),
});

const aboutPageCopy = z.object({
  page: z.literal("about"),
  pageTitle: z.string(),
  pageIntro: z.string(),
  missionItems: z.array(z.string()).min(1),
  protonPetsImage: z.string(),
  protonPetsImageAlt: z.string(),
  protonPetsText: z.string(),
  protonPetsLinkLabel: z.string(),
  protonPetsLinkUrl: z.string().url(),
});

const joinPageCopy = z.object({
  page: z.literal("join"),
  pageTitle: z.string(),
  pageIntro: z.string(),
  quoteLineOne: z.string(),
  quoteLineTwo: z.string(),
  whatWeLookForText: z.string(),
  requiredGearItems: z.array(z.string()).min(1),
  beltGizmoItems: z.array(z.string()).min(1),
  applyText: z.string(),
  applyLinkLabel: z.string(),
  applyLinkUrl: z.string().url(),
  noteText: z.string(),
});

const contactPageCopy = z.object({
  page: z.literal("contact"),
  pageTitle: z.string(),
  pageIntro: z.string(),
  bookUsText: z.string(),
  serviceAreasText: z.string(),
  regions: z.array(
    z.object({
      title: z.string(),
      areas: z.array(z.string()).min(1),
    }),
  ),
  ctaCallout: z.string(),
  ctaAside: z.string(),
  footnoteText: z.string(),
});

const donatePageCopy = z.object({
  page: z.literal("donate"),
  pageTitle: z.string(),
  pageIntro: z.string(),
  supportPanelText: z.string(),
  protonPetsText: z.string(),
  protonPetsLinkLabel: z.string(),
  protonPetsLinkUrl: z.string().url(),
  swagPanelText: z.string(),
  swagNote: z.string(),
});

const eventsPageCopy = z.object({
  page: z.literal("events"),
  pageTitle: z.string(),
  pageIntro: z.string(),
  upcomingHeading: z.string().optional(),
  pastHeading: z.string().optional(),
  emptyText: z.string().optional(),
});

const mediaPageCopy = z.object({
  page: z.literal("media"),
  pageTitle: z.string(),
  pageIntro: z.string(),
  videosHeading: z.string().optional(),
  galleryHeading: z.string().optional(),
  newsHeading: z.string().optional(),
});

const pageCopy = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "src/content/page-copy" }),
  schema: z.discriminatedUnion("page", [
    aboutPageCopy,
    joinPageCopy,
    eventsPageCopy,
    mediaPageCopy,
    contactPageCopy,
    donatePageCopy,
  ]),
});

export const collections = { events, gallery, videos, news, settings, pageCopy };
