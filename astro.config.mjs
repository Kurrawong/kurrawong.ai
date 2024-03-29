import { defineConfig } from "astro/config";

// https://astro.build/config
import vue from "@astrojs/vue";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), mdx(), tailwind()],
});
