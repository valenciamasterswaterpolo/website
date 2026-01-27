<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useScrollReveal } from '~/composables/useScrollReveal'
import { useStaggeredReveal } from '~/composables/useStaggeredReveal'

const { t } = useI18n()

// Scroll reveal for the section title
const { elementRef: titleRef, isVisible: titleVisible } = useScrollReveal({ threshold: 0.3 })

// Staggered reveal for feature cards
const featureCount = computed(() => t.value.about.features?.length || 3)
const { containerRef: featuresRef, isItemVisible, getItemStyle } = useStaggeredReveal(
  featureCount,
  { staggerDelay: 150, baseDelay: 100 }
)

const icons: Record<number, string> = {
  0: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
  1: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>`,
  2: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>`
}
</script>

<template>
  <section
    id="about"
    class="py-20 md:py-32 relative overflow-hidden bg-aqua-wash/30"
    aria-labelledby="about-heading"
  >
    <!-- Background decoration -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-valencia-purple/5 rounded-full blur-3xl" aria-hidden="true" />
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-ocean-blue/5 rounded-full blur-3xl" aria-hidden="true" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Title with scroll reveal -->
      <div
        ref="titleRef"
        class="text-center mb-16 scroll-reveal"
        :class="{ 'is-visible': titleVisible }"
      >
        <h2 id="about-heading" class="section-title text-gradient">{{ t.about.title }}</h2>
        <div class="neon-divider" aria-hidden="true" />
        <p class="max-w-2xl mx-auto text-lg text-deep-navy/70 dark:text-cream/70 leading-relaxed">
          {{ t.about.description }}
        </p>
      </div>

      <!-- Features Grid with staggered reveal -->
      <div
        ref="featuresRef"
        class="grid md:grid-cols-3 gap-8"
        role="list"
        aria-label="Event features"
      >
        <TiltCard
          v-for="(feature, index) in t.about.features"
          :key="index"
          :max-tilt="8"
          :glare="true"
          class="scroll-reveal"
          :class="{ 'is-visible': isItemVisible(index) }"
          :style="getItemStyle(index)"
        >
          <article
            class="feature-card text-center group h-full"
            role="listitem"
          >
            <div
              class="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-electric-cyan/20 to-ocean-blue/20 text-ocean-blue group-hover:shadow-neon-subtle transition-all duration-300"
              v-html="icons[index]"
              aria-hidden="true"
            />
            <h3 class="font-display text-xl tracking-wide text-deep-navy dark:text-cream mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-deep-navy/60 dark:text-cream/60">
              {{ feature.description }}
            </p>
          </article>
        </TiltCard>
      </div>
    </div>
  </section>
</template>
