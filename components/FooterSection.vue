<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

const currentYear = new Date().getFullYear()

// Organization JSON-LD for SEO
const organizationJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'Valencia Masters Water Polo Cup',
  'url': 'https://valenciamasterswaterpolo.com',
  'logo': 'https://valenciamasterswaterpolo.com/images/logo.png',
  'description': 'Masters Water Polo Tournament in Valencia, Spain',
  'email': 'info@valenciamasterswaterpolo.com',
  'sameAs': [
    'https://youtube.com/@ValenciaMastersWaterPoloCup',
    'https://instagram.com/ValenciaMastersWaterpolo'
  ],
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Valencia',
    'addressCountry': 'ES'
  },
  'contactPoint': {
    '@type': 'ContactPoint',
    'contactType': 'customer service',
    'email': 'info@valenciamasterswaterpolo.com',
    'availableLanguage': ['English', 'Spanish']
  }
}))

// Inject JSON-LD into head for SEO
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify(organizationJsonLd.value)
  }]
})
</script>

<template>
  <footer
    id="contact"
    class="relative overflow-hidden"
    role="contentinfo"
    aria-label="Site footer"
  >
    <!-- Gradient background matching PDF style -->
    <div class="absolute inset-0 bg-gradient-to-t from-deep-navy/10 via-valencia-purple/5 to-transparent" aria-hidden="true" />

    <div class="relative z-10">
      <!-- Main footer content -->
      <div class="py-12 border-t border-soft-slate/20 dark:border-soft-slate/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col items-center gap-8">
            <!-- Logo -->
            <a
              href="/"
              class="flex items-center gap-2"
              aria-label="Valencia Masters Water Polo Cup - Home"
            >
              <img
                src="/images/logo.png"
                alt="Valencia Masters Water Polo Cup"
                class="h-[180px] w-auto opacity-90 hover:opacity-100 transition-opacity"
                width="180"
                height="180"
                loading="lazy"
                decoding="async"
              />
            </a>

            <!-- Social Links -->
            <nav class="flex flex-col sm:flex-row items-center gap-6" aria-label="Social media links">
              <!-- YouTube -->
              <a
                href="https://youtube.com/@ValenciaMastersWaterPoloCup"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center gap-2 px-4 py-2 rounded-full bg-deep-navy/5 dark:bg-cream/5 hover:bg-neon-coral/15 transition-all"
                aria-label="Follow us on YouTube"
              >
                <svg class="w-5 h-5 text-neon-coral" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span class="text-sm text-deep-navy/70 dark:text-cream/70 group-hover:text-neon-coral transition-colors">@ValenciaMastersWaterPoloCup</span>
              </a>

              <!-- Instagram -->
              <a
                href="https://instagram.com/ValenciaMastersWaterpolo"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center gap-2 px-4 py-2 rounded-full bg-deep-navy/5 dark:bg-cream/5 hover:bg-valencia-purple/15 transition-all"
                aria-label="Follow us on Instagram"
              >
                <svg class="w-5 h-5 text-valencia-purple" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span class="text-sm text-deep-navy/70 dark:text-cream/70 group-hover:text-valencia-purple transition-colors">ValenciaMastersWaterpolo</span>
              </a>
            </nav>

            <!-- Divider -->
            <div class="w-48 h-px bg-gradient-to-r from-transparent via-soft-slate/40 to-transparent" aria-hidden="true" />

            <!-- Legal Links -->
            <nav class="flex items-center gap-6 text-sm" aria-label="Legal links">
              <NuxtLink
                to="/privacy"
                class="text-deep-navy/60 dark:text-cream/60 hover:text-valencia-purple dark:hover:text-electric-cyan transition-colors"
              >
                {{ t.footer.privacy }}
              </NuxtLink>
              <NuxtLink
                to="/terms"
                class="text-deep-navy/60 dark:text-cream/60 hover:text-valencia-purple dark:hover:text-electric-cyan transition-colors"
              >
                {{ t.footer.terms }}
              </NuxtLink>
            </nav>

            <!-- Bottom row -->
            <div class="flex flex-col md:flex-row items-center gap-4 text-sm text-deep-navy/50 dark:text-cream/50">
              <p>&copy; {{ currentYear }} Valencia Masters Water Polo Cup. {{ t.footer.rights }}.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
