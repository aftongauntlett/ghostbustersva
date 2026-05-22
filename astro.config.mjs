// @ts-check
import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import markdoc from "@astrojs/markdoc";
import vercel from "@astrojs/vercel";

import react from "@astrojs/react";

const productionSiteUrl = (process.env.SITE_URL || "https://gbva-site.vercel.app/").replace(
  /\/+$/,
  "",
);

// https://astro.build/config
export default defineConfig({
  output: "static",
  // Canonical and sitemap URLs always use the explicit primary domain.
  site: productionSiteUrl,
  env: {
    schema: {
      GOOGLE_MAPS_API_KEY: envField.string({ context: "client", access: "public", optional: true }),
      RESEND_API_KEY: envField.string({ context: "server", access: "secret" }),
      CONTACT_FROM_EMAIL: envField.string({ context: "server", access: "secret" }),
      CONTACT_TO_EMAIL: envField.string({ context: "server", access: "secret" }),
      UPSTASH_REDIS_REST_URL: envField.string({ context: "server", access: "secret", optional: true }),
      UPSTASH_REDIS_REST_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({ context: "client", access: "public", optional: true }),
      TURNSTILE_SECRET_KEY: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },
  adapter: vercel(),
  integrations: [sitemap(), markdoc(), react()],
});
