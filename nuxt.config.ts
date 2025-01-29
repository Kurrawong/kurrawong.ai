// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    modules: [
      "@nuxt/content",
      "@nuxtjs/tailwindcss",
      "shadcn-nuxt",
      "@nuxtjs/color-mode",
      "@nuxt/image"
    ],
    content: {
        experimental: {
            search: true
        },
    },
    colorMode: {
        classPrefix: "",
        classSuffix: "",
    },
    css: ["./assets/css/style.css"],
    app: {
        head: {
            link: [
                { rel: "shortcut icon", href: "/favicon.png", type: "image/png" }
            ],
        }
    },
});