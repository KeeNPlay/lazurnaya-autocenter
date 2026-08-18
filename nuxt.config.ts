import tailwindcss from "@tailwindcss/vite";
import { resolveAlias } from "nuxt/kit";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/turnstile',
  ],
  css: [
    './assets/css/main.css',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    transpile: ['@vuepic/vue-datepicker'],
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
      },
    ],
    provider: 'server',
    serverBundle: {
      collections: ['heroicons']
    },
    clientBundle: {
      scan: {
        globInclude: [
          '**/*.vue',
          '**/*.jsx',
          '**/*.tsx',
          '**/*.md',
          '**/*.mdx',
          '**/*.astro',
          '**/*.html',
          '**/*.ts',
          '**/*.js'
        ],
        globExclude: [
          '**/node_modules/**',
          '**/dist/**',
          '**/.nuxt/**',
          '**/.output/**'
        ]
      }
    }
  },
  image: {
    quality: 80,
    format: ['webp'],
  },
  turnstile: {
    siteKey: process.env.NUXT_TURNSTILE_SITE_KEY,
  },
  runtimeConfig: {
    turnstile: {
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
    },
  },
})