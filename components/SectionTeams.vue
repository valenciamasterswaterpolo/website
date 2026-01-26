<script setup lang="ts">
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
</script>

<template>
  <section v-if="hasTeams" id="teams" class="py-20 md:py-32 bg-valencia-purple/5 dark:bg-valencia-purple/10 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-ocean-blue/5 rounded-full blur-3xl" />
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-valencia-purple/5 rounded-full blur-3xl" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Title -->
      <div class="text-center mb-16">
        <h2 class="section-title text-gradient">{{ t.teams.title }}</h2>
        <div class="neon-divider" />
        <p class="max-w-2xl mx-auto text-lg text-deep-navy/70 dark:text-cream/70 leading-relaxed">
          {{ t.teams.description }}
        </p>
      </div>

      <!-- Teams Grid -->
      <div class="flex flex-wrap justify-center items-stretch gap-6 md:gap-8">
        <a
          v-for="team in teams"
          :key="team.name"
          :href="team.url || '#'"
          :target="team.url ? '_blank' : undefined"
          rel="noopener noreferrer"
          class="feature-card p-6 flex flex-col items-center justify-center min-w-[140px] max-w-[180px] hover:scale-105 transition-transform group"
        >
          <div class="w-20 h-20 mb-4 flex items-center justify-center">
            <img
              :src="team.logo"
              :alt="team.name"
              class="max-w-full max-h-full object-contain"
              loading="lazy"
            />
          </div>
          <p class="text-center text-sm font-medium text-deep-navy dark:text-cream group-hover:text-valencia-purple dark:group-hover:text-electric-cyan transition-colors">
            {{ team.name }}
          </p>
          <span v-if="team.country" class="text-xs text-deep-navy/50 dark:text-cream/50 mt-1">
            {{ team.country }}
          </span>
        </a>
      </div>
    </div>
  </section>
</template>
