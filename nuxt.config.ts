// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Disable SSR - generate as SPA
  ssr: false,

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light'
  },

  app: {
    head: {
      title: 'Valencia Masters Water Polo Cup 2026',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'III Torneo Máster de Waterpolo en Valencia - 16-17 Mayo 2026 | III Masters Water Polo Tournament in Valencia - 16-17 May 2026' },
        { property: 'og:title', content: 'Valencia Masters Water Polo Cup 2026' },
        { property: 'og:description', content: 'III Masters Water Polo Tournament - UPV Campus, Valencia' },
        { property: 'og:image', content: '/images/og-image.jpg' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },

  css: [
    '~/assets/css/main.css'
  ]
})
