import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    modules: [
      "@nuxt/content",
      "shadcn-nuxt",
      "@nuxtjs/color-mode",
      "@nuxt/image",
      "@nuxt/fonts",
    ],
    colorMode: {
        classPrefix: "",
        classSuffix: "",
    },
    css: ["@/assets/css/tailwind.css", "@/assets/css/style.css"],
    app: {
        head: {
            link: [
                { rel: "shortcut icon", href: "/favicon.png", type: "image/png" }
            ],
        }
    },
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
    image: {
        provider: "none",
    },
    shadcn: {
        prefix: "",
        componentDir: "@/components/ui"
    },
});