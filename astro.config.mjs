// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // Static output — no server needed
  output: "static",
  site: "https://ghostbustersva.com",
  integrations: [react(), sitemap()],
});
