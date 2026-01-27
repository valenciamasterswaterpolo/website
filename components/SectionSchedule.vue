<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useScrollReveal } from '~/composables/useScrollReveal'
import { useStaggeredReveal } from '~/composables/useStaggeredReveal'

const { t } = useI18n()

// Scroll reveal for the section title
const { elementRef: titleRef, isVisible: titleVisible } = useScrollReveal({ threshold: 0.3 })

// Staggered reveal for cards (4 cards)
const { containerRef: cardsRef, isItemVisible, getItemStyle } = useStaggeredReveal(
  4,
  { staggerDelay: 100, baseDelay: 100 }
)

// Event JSON-LD Structured Data for SEO
const eventJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'SportsEvent',
  'name': 'Valencia Masters Water Polo Cup 2026',
  'description': 'III Masters Water Polo Tournament - Mixed Masters +30 category',
  'startDate': '2026-05-16T15:00:00+02:00',
  'endDate': '2026-05-17T15:00:00+02:00',
  'eventStatus': 'https://schema.org/EventScheduled',
  'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
  'location': {
    '@type': 'Place',
    'name': 'UPV Campus Swimming Pool',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Camino de Vera, s/n',
      'addressLocality': 'Valencia',
      'postalCode': '46022',
      'addressRegion': 'Valencia',
      'addressCountry': 'ES'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 39.4817,
      'longitude': -0.3419
    }
  },
  'organizer': {
    '@type': 'Organization',
    'name': 'Valencia Masters Water Polo Cup',
    'url': 'https://valenciamasterswaterpolo.com',
    'email': 'info@valenciamasterswaterpolo.com'
  },
  'sport': 'Water Polo',
  'competitor': {
    '@type': 'SportsTeam',
    'sport': 'Water Polo'
  }
}))

// Inject JSON-LD into head for SEO
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify(eventJsonLd.value)
  }]
})
</script>

<template>
  <section
    id="schedule"
    class="py-20 md:py-32 bg-peach-wash/30 relative"
    aria-labelledby="schedule-heading"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Title with scroll reveal -->
      <div
        ref="titleRef"
        class="text-center mb-16 scroll-reveal"
        :class="{ 'is-visible': titleVisible }"
      >
        <h2 id="schedule-heading" class="section-title text-gradient">{{ t.schedule.title }}</h2>
        <div class="neon-divider" aria-hidden="true" />
      </div>

      <!-- Info Cards Grid with staggered reveal -->
      <dl ref="cardsRef" class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Category -->
        <div
          class="glass-card p-6 text-center scroll-reveal hover-lift"
          :class="{ 'is-visible': isItemVisible(0) }"
          :style="getItemStyle(0)"
        >
          <div class="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-ocean-blue/15 text-ocean-blue" aria-hidden="true">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <dt class="font-display text-lg tracking-wide text-ocean-blue dark:text-electric-cyan mb-2">
            {{ t.schedule.category.label }}
          </dt>
          <dd class="text-deep-navy dark:text-cream font-medium">{{ t.schedule.category.value }}</dd>
        </div>

        <!-- Dates -->
        <div
          class="glass-card p-6 text-center scroll-reveal hover-lift"
          :class="{ 'is-visible': isItemVisible(1) }"
          :style="getItemStyle(1)"
        >
          <div class="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-neon-coral/15 text-neon-coral" aria-hidden="true">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <dt class="font-display text-lg tracking-wide text-neon-coral mb-2">
            {{ t.schedule.dates.label }}
          </dt>
          <dd class="text-deep-navy dark:text-cream font-medium">
            <time datetime="2026-05-16/2026-05-17">{{ t.schedule.dates.value }}</time>
          </dd>
        </div>

        <!-- Times -->
        <div
          class="glass-card p-6 text-center scroll-reveal hover-lift"
          :class="{ 'is-visible': isItemVisible(2) }"
          :style="getItemStyle(2)"
        >
          <div class="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-sunset-peach/30 text-valencia-purple" aria-hidden="true">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <dt class="font-display text-lg tracking-wide text-valencia-purple dark:text-sunset-peach mb-2">
            {{ t.schedule.times.label }}
          </dt>
          <dd class="text-deep-navy dark:text-cream font-medium text-sm">
            <time datetime="2026-05-16T15:00/21:00">{{ t.schedule.times.saturday }}</time>
          </dd>
          <dd class="text-deep-navy dark:text-cream font-medium text-sm">
            <time datetime="2026-05-17T09:00/15:00">{{ t.schedule.times.sunday }}</time>
          </dd>
        </div>

        <!-- Location -->
        <div
          class="glass-card p-6 text-center scroll-reveal hover-lift"
          :class="{ 'is-visible': isItemVisible(3) }"
          :style="getItemStyle(3)"
        >
          <div class="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-valencia-purple/15 text-valencia-purple" aria-hidden="true">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <dt class="font-display text-lg tracking-wide text-valencia-purple dark:text-sunset-peach mb-2">
            {{ t.schedule.location.label }}
          </dt>
          <dd class="text-deep-navy dark:text-cream font-medium text-sm">
            <address class="not-italic">{{ t.schedule.location.value }}</address>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
