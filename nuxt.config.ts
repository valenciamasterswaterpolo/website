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
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Valencia Masters Water Polo Cup 2026 | III Masters Tournament',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'III Masters Water Polo Tournament in Valencia, Spain - May 16-17, 2026. Join teams from across Europe for competitive water polo and Mediterranean vibes at UPV Campus.' },
        { name: 'keywords', content: 'water polo, masters tournament, Valencia, Spain, waterpolo, sports event, UPV, 2026' },
        { name: 'author', content: 'Valencia Masters Water Polo Cup' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#73326D' },
        { name: 'apple-mobile-web-app-title', content: 'Valencia Masters Water Polo Cup' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Valencia Masters Water Polo Cup' },
        { property: 'og:title', content: 'Valencia Masters Water Polo Cup 2026 | III Masters Tournament' },
        { property: 'og:description', content: 'III Masters Water Polo Tournament in Valencia, Spain - May 16-17, 2026. Competitive water polo and Mediterranean vibes.' },
        { property: 'og:image', content: 'https://valenciamasterswaterpolo.com/images/og_image.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Valencia Masters Water Polo Cup 2026' },
        { property: 'og:url', content: 'https://valenciamasterswaterpolo.com' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:locale:alternate', content: 'es_ES' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Valencia Masters Water Polo Cup 2026' },
        { name: 'twitter:description', content: 'III Masters Water Polo Tournament in Valencia, Spain - May 16-17, 2026.' },
        { name: 'twitter:image', content: 'https://valenciamasterswaterpolo.com/images/og_image.jpg' },

        // Additional SEO
        { name: 'geo.region', content: 'ES-VC' },
        { name: 'geo.placename', content: 'Valencia' },
        { name: 'geo.position', content: '39.4817;-0.3419' },
        { name: 'ICBM', content: '39.4817, -0.3419' }
      ],
      link: [
        // Favicons
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        // SEO & Fonts
        { rel: 'canonical', href: 'https://valenciamasterswaterpolo.com' },
        // Hreflang tags for multilingual support
        { rel: 'alternate', hreflang: 'en', href: 'https://valenciamasterswaterpolo.com' },
        { rel: 'alternate', hreflang: 'es', href: 'https://valenciamasterswaterpolo.com' },
        { rel: 'alternate', hreflang: 'x-default', href: 'https://valenciamasterswaterpolo.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;500;600;700&display=swap' }
      ],
      noscript: [
        // Google Tag Manager (noscript)
        { innerHTML: '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MW9XM7H2" height="0" width="0" style="display:none;visibility:hidden"></iframe>' }
      ],
      script: [
        // Google Tag Manager
        {
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MW9XM7H2');`
        },
        // WebSite schema for sitelinks search box
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': 'Valencia Masters Water Polo Cup',
            'url': 'https://valenciamasterswaterpolo.com',
            'description': 'III Masters Water Polo Tournament in Valencia, Spain',
            'inLanguage': ['en', 'es']
          })
        },
        // SportsEvent schema for the tournament
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SportsEvent',
            'name': 'Valencia Masters Water Polo Cup 2026',
            'description': 'III Masters Water Polo Tournament in Valencia, Spain - Join teams from across Europe for competitive water polo and Mediterranean vibes.',
            'startDate': '2026-05-16',
            'endDate': '2026-05-17',
            'eventStatus': 'https://schema.org/EventScheduled',
            'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
            'location': {
              '@type': 'Place',
              'name': 'UPV Campus - Universitat Politècnica de València',
              'address': {
                '@type': 'PostalAddress',
                'streetAddress': 'Camí de Vera, s/n',
                'addressLocality': 'Valencia',
                'addressRegion': 'Comunidad Valenciana',
                'postalCode': '46022',
                'addressCountry': 'ES'
              },
              'geo': {
                '@type': 'GeoCoordinates',
                'latitude': 39.4817,
                'longitude': -0.3419
              }
            },
            'image': 'https://valenciamasterswaterpolo.com/images/og_image.jpg',
            'organizer': {
              '@type': 'Organization',
              'name': 'Valencia Masters Water Polo Cup',
              'url': 'https://valenciamasterswaterpolo.com'
            },
            'sport': 'Water Polo',
            'url': 'https://valenciamasterswaterpolo.com',
            'inLanguage': ['en', 'es']
          })
        },
        // Organization schema
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'Valencia Masters Water Polo Cup',
            'url': 'https://valenciamasterswaterpolo.com',
            'logo': 'https://valenciamasterswaterpolo.com/images/logo.png',
            'description': 'Organizers of the annual Masters Water Polo Tournament in Valencia, Spain',
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Valencia',
              'addressCountry': 'ES'
            },
            'sameAs': []
          })
        }
      ]
    }
  },

  css: [
    '~/assets/css/main.css'
  ]
})
