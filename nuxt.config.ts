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
                { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
                { rel: "shortcut icon", href: "/favicon-dark.ico", type: "image/x-icon", media: "(prefers-color-scheme: dark)" },
                { rel: "apple-touch-icon", href: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
            ],
        },
    },
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
    image: {
        provider: "none",
    },
    fonts: {
        defaults: {
            weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        },
    },
    shadcn: {
        prefix: "",
        componentDir: "@/components/ui"
    },
});