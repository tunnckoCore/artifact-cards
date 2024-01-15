import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  output: "server",
  integrations: [tailwind(), mdx(), react()],
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});
