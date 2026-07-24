import tailwindcss from "@tailwindcss/vite";
import { resolveAlias } from "nuxt/kit";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/google-fonts', '@nuxt/icon', '@nuxt/image'],
  css: ['./assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      title: 'Автоцентр на Лазурной',
    },
  },
  googleFonts: {
    display: 'swap',
    families: {
      'Inter': {
        wght: '100..900',
        ital: '100..900'
      }
    },
  },
  icon: {
    mode: 'svg',
    customCollections: [
      {
        prefix: 'custom-icons',
        dir: resolveAlias('./app/assets/custom-icons')
      }
    ]
  }
})