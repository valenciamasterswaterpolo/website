<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useScrollReveal } from '~/composables/useScrollReveal'
import { useStaggeredReveal } from '~/composables/useStaggeredReveal'

const { t } = useI18n()

// Scroll reveal for the section title
const { elementRef: titleRef, isVisible: titleVisible } = useScrollReveal({ threshold: 0.3 })

// Staggered reveal for feature cards
const featureCount = computed(() => t.value.why.features?.length || 4)
const { containerRef: featuresRef, isItemVisible, getItemStyle } = useStaggeredReveal(
  featureCount,
  { staggerDelay: 120, baseDelay: 100 }
)

const iconMap: Record<string, string> = {
  video: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>`,
  whistle: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>`,
  gift: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>`,
  dinner: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
}
</script>

<template>
  <section
    id="why"
    class="py-20 md:py-32 bg-aqua-wash/30 relative overflow-hidden"
    aria-labelledby="why-heading"
  >
    <!-- Background decoration -->
    <div class="absolute -top-32 -right-32 w-96 h-96 bg-neon-coral/10 rounded-full blur-3xl" aria-hidden="true" />
    <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-electric-cyan/10 rounded-full blur-3xl" aria-hidden="true" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Title with scroll reveal -->
      <div
        ref="titleRef"
        class="text-center mb-16 scroll-reveal"
        :class="{ 'is-visible': titleVisible }"
      >
        <h2 id="why-heading" class="section-title text-gradient">{{ t.why.title }}</h2>
        <div class="neon-divider" aria-hidden="true" />
      </div>

      <!-- Features Grid with staggered reveal -->
      <ul
        ref="featuresRef"
        class="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        role="list"
        aria-label="Tournament benefits"
      >
        <li
          v-for="(feature, index) in t.why.features"
          :key="index"
          class="feature-card text-center group scroll-reveal hover-lift"
          :class="{ 'is-visible': isItemVisible(index) }"
          :style="getItemStyle(index)"
        >
          <div
            class="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-neon-coral/20 to-sunset-peach/30 text-neon-coral group-hover:shadow-neon-coral transition-all"
            v-html="iconMap[feature.icon]"
            aria-hidden="true"
          />
          <h3 class="font-display text-xl tracking-wide text-deep-navy dark:text-cream mb-2">
            {{ feature.title }}
          </h3>
          <p class="text-deep-navy/60 dark:text-cream/60 text-sm">
            {{ feature.description }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>
