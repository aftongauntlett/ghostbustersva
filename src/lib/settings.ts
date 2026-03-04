/**
 * CMS settings helper — loads site settings from the Keystatic-managed
 * content collection, with a safe fallback to src/config.ts defaults.
 *
 * Usage in .astro files:
 *   import { getSiteSettings } from "../lib/settings";
 *   const settings = await getSiteSettings();
 *
 * PRD 012: Keystatic CMS Integration
 */
import { getCollection } from "astro:content";
import { siteConfig } from "../config";

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  donateUrl: string;
  storeUrl: string;
  contactEmail: string;
  socialLinks: { platform: string; url: string }[];
  footerText: string;
}

/**
 * Load CMS-managed site settings. Falls back to siteConfig defaults
 * if the settings collection is empty or fails to load.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const entries = await getCollection("settings");
    const entry = entries[0];
    if (entry) {
      return {
        siteName: entry.data.siteName || siteConfig.title,
        siteDescription: entry.data.siteDescription || siteConfig.description,
        donateUrl: entry.data.donateUrl ?? "",
        storeUrl: entry.data.storeUrl ?? "",
        contactEmail: entry.data.contactEmail ?? "",
        socialLinks: entry.data.socialLinks ?? [],
        footerText: entry.data.footerText ?? siteConfig.copyright,
      };
    }
  } catch {
    // Fallback silently — CMS data may not be available during build
  }

  return {
    siteName: siteConfig.title,
    siteDescription: siteConfig.description,
    donateUrl: "",
    storeUrl: "",
    contactEmail: "",
    socialLinks: [],
    footerText: siteConfig.copyright,
  };
}
