<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

interface Team {
  name: string
  logo: string
  country?: string
  url?: string
}

interface TeamsData {
  teams: Team[]
}

const { data: teamsData } = await useFetch<TeamsData>('/data/teams.json')
const teams = computed(() => teamsData.value?.teams || [])
const hasTeams = computed(() => teams.value.length > 0)

// Teams JSON-LD Structured Data for SEO
const teamsJsonLd = computed(() => {
  if (!hasTeams.value) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Participating Teams - Valencia Masters Water Polo Cup 2026',
    'description': 'List of teams participating in the Valencia Masters Water Polo Cup 2026',
    'numberOfItems': teams.value.length,
    'itemListElement': teams.value.map((team, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'SportsTeam',
        'name': team.name,
        'sport': 'Water Polo',
        ...(team.logo && {
          'logo': team.logo.startsWith('http')
            ? team.logo
            : `https://valenciamasterswaterpolo.com${team.logo}`
        }),
        ...(team.url && { 'url': team.url }),
        ...(team.country && {
          'location': {
            '@type': 'Country',
            'name': team.country
          }
        })
      }
    }))
  }
})

// Inject JSON-LD into head for SEO
useHead({
  script: computed(() =>
    teamsJsonLd.value
      ? [{
          type: 'application/ld+json',
          innerHTML: JSON.stringify(teamsJsonLd.value)
        }]
      : []
  )
})
</script>

<template>
  <section
    v-if="hasTeams"
    id="teams"
    class="py-20 md:py-32 bg-valencia-purple/5 dark:bg-valencia-purple/10 relative overflow-hidden"
    aria-labelledby="teams-heading"
  >
    <!-- Background decoration -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-ocean-blue/5 rounded-full blur-3xl" aria-hidden="true" />
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-valencia-purple/5 rounded-full blur-3xl" aria-hidden="true" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Title -->
      <div class="text-center mb-16">
        <h2 id="teams-heading" class="section-title text-gradient">{{ t.teams.title }}</h2>
        <div class="neon-divider" aria-hidden="true" />
        <p class="max-w-2xl mx-auto text-lg text-deep-navy/70 dark:text-cream/70 leading-relaxed">
          {{ t.teams.description }}
        </p>
      </div>

      <!-- Teams Grid -->
      <ul class="flex flex-wrap justify-center items-stretch gap-6 md:gap-8" role="list" :aria-label="t.teams.title">
        <li
          v-for="team in teams"
          :key="team.name"
          class="feature-card p-6 flex flex-col items-center justify-center min-w-[140px] max-w-[180px] hover:scale-105 transition-transform group"
        >
          <a
            :href="team.url || undefined"
            :target="team.url ? '_blank' : undefined"
            :rel="team.url ? 'noopener noreferrer' : undefined"
            class="flex flex-col items-center justify-center w-full h-full"
            :aria-label="team.url ? `Visit ${team.name} website` : team.name"
          >
            <figure class="w-20 h-20 mb-4 flex items-center justify-center">
              <img
                :src="team.logo"
                :alt="`${team.name} team logo`"
                class="max-w-full max-h-full object-contain"
                width="80"
                height="80"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <p class="text-center text-sm font-medium text-deep-navy dark:text-cream group-hover:text-valencia-purple dark:group-hover:text-electric-cyan transition-colors">
              {{ team.name }}
            </p>
            <span v-if="team.country" class="text-xs text-deep-navy/50 dark:text-cream/50 mt-1">
              {{ team.country }}
            </span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
