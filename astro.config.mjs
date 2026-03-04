// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import markdoc from "@astrojs/markdoc";
import keystatic from "@keystatic/astro";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  // Static output — all pages are pre-rendered at build time.
  // Keystatic's admin route (/keystatic) uses on-demand server rendering via the integration.
  output: "static",
  site: "https://ghostbustersva.com",
  adapter: vercel(),
  integrations: [react(), sitemap(), markdoc(), keystatic()],
});
