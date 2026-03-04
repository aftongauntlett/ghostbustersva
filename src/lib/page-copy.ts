/**
 * CMS page copy helper — loads page-specific editable text from the
 * pageCopy content collection with typed access per page.
 *
 * Usage in .astro files:
 *   import { getPageCopy } from "../lib/page-copy";
 *   const copy = await getPageCopy("about");
 *
 * PRD 014: CMS Handoff Simplification
 */
import { getCollection } from "astro:content";

/**
 * Load CMS page copy for a specific page slug.
 * Returns the data object or null if not found.
 */
export async function getPageCopy(pageSlug: string): Promise<Record<string, unknown> | null> {
  try {
    const entries = await getCollection("pageCopy");
    const entry = entries.find((e) => e.id === pageSlug);
    return entry ? (entry.data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
