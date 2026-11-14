import tailwindcss from "@tailwindcss/vite";
import { resolveAlias } from "nuxt/kit";

// Render sets RENDER=true during build and runtime.
// The test deployment must stay out of search results.
const isRenderTest = Boolean(process.env.RENDER)

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/turnstile',
    'nuxt-auth-utils',
    'nuxt-security',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],

  app: {
    head: {
      title: 'Автоцентр на Лазурной',
      htmlAttrs: {
        lang: 'ru',
        style: 'background-color: #1a1a1a'
      },
      meta: [
        // #1a1a1a is the sRGB value of --color-gray-100 (oklch 21.8%)
        { name: 'theme-color', content: '#1a1a1a' },
      ]
    }
  },

  site: {
    url: isRenderTest
        ? (process.env.RENDER_EXTERNAL_URL || 'https://lazurnaya-autocenter.onrender.com')
        : 'https://acl.com.by',
    name: 'Автоцентр на Лазурной',
    // false on Render: robots.txt gets "Disallow: /", pages get noindex
    indexable: !isRenderTest,
  },

  robots: {
    disallow: ['/admin', '/api'],
  },

  sitemap: {
    // Public pages are collected from app/pages automatically
    exclude: ['/admin', '/admin/**'],
  },

  css: [
    './assets/css/main.css',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    transpile: ['@vuepic/vue-datepicker'],
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
    // Folder for files uploaded from the admin panel. Can be overridden via the NUXT_UPLOAD_DIR variable (use an absolute path for production).
    uploadDir: '',
    turnstile: {
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
    },
    session: {
      name: 'admin_session',
      password: process.env.NUXT_SESSION_PASSWORD,
      maxAge: 60 * 60 * 12, // 12 hours
      cookie: {
        sameSite: 'strict'
      }
    }
  },

  security: {
    headers: {
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:'],
        'connect-src': ["'self'", 'https://challenges.cloudflare.com'],
        'frame-src': ["'self'", 'https://challenges.cloudflare.com'], // Turnstile widget
      }
    },
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 300000, // 5 minutes limit
      headers: false
    }
  },

  routeRules: {
    // Admin pages: noindex header + meta tag even if somebody links to them
    '/admin/**': {
      robots: false,
    },
    '/api/forms/**': {
      security: {
        rateLimiter: false,
      }
    },
    // PDF up to 10mb on admin-panel
    '/api/admin/files/**': {
      security: {
        requestSizeLimiter: {
          maxRequestSizeInBytes: 11 * 1024 * 1024,
          maxUploadFileRequestInBytes: 11 * 1024 * 1024
        },
        xssValidator: false
      }
    },
    // Disable CSP for PDF files on admin-panel
    '/docs/**': {
      security: {
        headers: {
          contentSecurityPolicy: false
        }
      }
    }
  }
})