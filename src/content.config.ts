/**
 * Astro Content Collections configuration.
 *
 * Defines schemas for markdown-based content (events, gallery).
 * See: https://docs.astro.build/en/guides/content-collections/
 */
import { defineCollection, z } from "astro:content";

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
    /** Optional external URL for the event */
    url: z.string().url().optional(),
    /** Mark past events so they can be filtered */
    past: z.boolean().default(false),
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
