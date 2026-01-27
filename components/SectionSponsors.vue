<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

interface Sponsor {
  name: string
  logo: string
  url?: string
}

interface SponsorsData {
  sponsors: Sponsor[]
}

const { data: sponsorsData } = await useFetch<SponsorsData>('/data/sponsors.json')
const sponsors = computed(() => sponsorsData.value?.sponsors || [])
const hasSponsors = computed(() => sponsors.value.length > 0)

// Adaptive grid class based on sponsor count
const sponsorGridClass = computed(() => {
  const count = sponsors.value.length
  if (count === 1) {
    return 'grid-cols-1 max-w-xs mx-auto'
  } else if (count === 2) {
    return 'grid-cols-2 max-w-md mx-auto'
  } else if (count <= 4) {
    return 'grid-cols-2 sm:grid-cols-4 max-w-3xl mx-auto'
  } else {
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
  }
})

// JSON-LD Structured Data for SEO (sponsors as SportsEvent sponsors)
const jsonLd = computed(() => {
  if (!hasSponsors.value) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    'name': 'Valencia Masters Water Polo Cup 2026',
    'description': 'III Masters Water Polo Tournament - UPV Campus, Valencia',
    'startDate': '2026-05-16',
    'endDate': '2026-05-17',
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
        'addressCountry': 'ES'
      }
    },
    'organizer': {
      '@type': 'Organization',
      'name': 'Valencia Masters Water Polo Cup',
      'url': 'https://valenciamasterswaterpolo.com'
    },
    'sponsor': sponsors.value.map(sponsor => ({
      '@type': 'Organization',
      'name': sponsor.name,
      'logo': sponsor.logo.startsWith('http')
        ? sponsor.logo
        : `https://valenciamasterswaterpolo.com${sponsor.logo}`,
      ...(sponsor.url && { 'url': sponsor.url })
    }))
  }
})

// Inject JSON-LD into head for SEO
useHead({
  script: computed(() =>
    jsonLd.value
      ? [{
          type: 'application/ld+json',
          innerHTML: JSON.stringify(jsonLd.value)
        }]
      : []
  )
})
</script>

<template>
  <aside
    v-if="hasSponsors"
    id="sponsors"
    class="py-20 md:py-32 relative overflow-hidden bg-sea-mist/20 dark:bg-valencia-purple/5"
    aria-labelledby="sponsors-heading"
    role="complementary"
  >
    <!-- Background decoration -->
    <div class="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-valencia-purple/5 rounded-full blur-3xl" />
    <div class="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-ocean-blue/5 rounded-full blur-3xl" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Title -->
      <div class="text-center mb-12 md:mb-16">
        <h2
          id="sponsors-heading"
          class="section-title text-gradient"
        >
          {{ t.sponsors.title }}
        </h2>
        <div class="neon-divider" />
      </div>

      <!-- Sponsors Grid - Adaptive based on count -->
      <div
        class="grid gap-6 md:gap-8 lg:gap-10 justify-items-center"
        :class="sponsorGridClass"
        role="list"
        :aria-label="t.sponsors.title"
      >
        <figure
          v-for="sponsor in sponsors"
          :key="sponsor.name"
          class="glass-card sponsor-card group"
          role="listitem"
        >
          <a
            :href="sponsor.url || undefined"
            :target="sponsor.url ? '_blank' : undefined"
            :rel="sponsor.url ? 'sponsored noopener noreferrer' : undefined"
            class="flex items-center justify-center w-full"
            :aria-label="sponsor.url ? `Visit ${sponsor.name} website` : sponsor.name"
          >
            <img
              :src="sponsor.logo"
              :alt="`${sponsor.name} logo - Official sponsor of Valencia Masters Water Polo Cup 2026`"
              class="sponsor-logo"
              width="160"
              height="80"
              loading="lazy"
              decoding="async"
            />
          </a>
          <figcaption class="sponsor-name">
            {{ sponsor.name }}
          </figcaption>
        </figure>
      </div>

      <!-- CTA -->
      <div class="text-center mt-10 md:mt-12">
        <a
          :href="`mailto:${t.contact.email}?subject=Sponsorship Valencia Masters Water Polo Cup 2026`"
          class="inline-flex items-center gap-2 text-ocean-blue hover:text-valencia-purple dark:text-electric-cyan dark:hover:text-neon-coral transition-colors text-sm md:text-base font-medium"
        >
          <svg
            class="w-4 h-4 md:w-5 md:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          {{ t.sponsors.cta }}
        </a>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* Sponsor card layout */
.sponsor-card {
  @apply p-4 sm:p-6 md:p-8;
  @apply flex flex-col items-center justify-center;
  @apply w-full aspect-[2/1] sm:aspect-[3/2];
}

.sponsor-card:hover {
  @apply scale-105;
}

/* Sponsor logo responsive sizing with grayscale effect */
.sponsor-logo {
  @apply h-10 sm:h-12 md:h-14 lg:h-16 xl:h-20;
  @apply w-auto max-w-full object-contain;
  @apply grayscale opacity-70;
  @apply transition-all duration-300;
}

.sponsor-card:hover .sponsor-logo {
  @apply grayscale-0 opacity-100;
}

/* Sponsor name styling */
.sponsor-name {
  @apply mt-3 text-xs sm:text-sm;
  @apply text-deep-navy/60;
  @apply font-medium text-center;
  @apply transition-colors duration-300;
}

:deep(.dark) .sponsor-name {
  @apply text-cream/60;
}

.sponsor-card:hover .sponsor-name {
  @apply text-valencia-purple;
}

:deep(.dark) .sponsor-card:hover .sponsor-name {
  @apply text-electric-cyan;
}
</style>
