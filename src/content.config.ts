/**
 * Astro Content Collections configuration.
 *
 * Defines schemas for markdown-based content (events, gallery).
 * See: https://docs.astro.build/en/guides/content-collections/
 */
import { defineCollection, z } from "astro:content";

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
     * If omitted, status is derived from date/endDate at build time.
     */
    status: z.enum(["upcoming", "past"]).optional(),
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

export const collections = { events, gallery };
