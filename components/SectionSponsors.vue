<script setup lang="ts">
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
</script>

<template>
  <section v-if="hasSponsors" id="sponsors" class="py-16 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Title -->
      <div class="text-center mb-12">
        <h3 class="font-display text-2xl tracking-wider text-deep-navy/80 dark:text-cream/80">
          {{ t.sponsors.title }}
        </h3>
      </div>

      <!-- Sponsors Grid -->
      <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16">
        <a
          v-for="sponsor in sponsors"
          :key="sponsor.name"
          :href="sponsor.url || '#'"
          :target="sponsor.url ? '_blank' : undefined"
          rel="noopener noreferrer"
          class="opacity-70 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0"
        >
          <img
            :src="sponsor.logo"
            :alt="sponsor.name"
            class="h-12 md:h-16 w-auto object-contain"
            loading="lazy"
          />
        </a>
      </div>

      <!-- CTA -->
      <div class="text-center mt-8">
        <a
          :href="`mailto:${t.contact.email}?subject=Patrocinio Valencia Masters Water Polo Cup`"
          class="text-ocean-blue hover:text-valencia-purple dark:text-electric-cyan dark:hover:text-neon-coral transition-colors text-sm"
        >
          {{ t.sponsors.cta }}
        </a>
      </div>
    </div>
  </section>
</template>
