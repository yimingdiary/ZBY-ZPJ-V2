import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { localContent } from "./scripts/local-content.mjs";
export default defineConfig({
  devToolbar: { enabled: false },
  integrations: [react()],
  vite: { plugins: [localContent()] },
  server: { host: "127.0.0.1", port: 4321 },
});
