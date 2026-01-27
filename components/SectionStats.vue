<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useScrollReveal } from '~/composables/useScrollReveal'
import { useStaggeredReveal } from '~/composables/useStaggeredReveal'

const { t } = useI18n()

// Scroll reveal for the section title
const { elementRef: titleRef, isVisible: titleVisible } = useScrollReveal({ threshold: 0.3 })

// Staggered reveal for stat cards
const statCount = computed(() => t.value.stats.items?.length || 3)
const { containerRef: statsRef, isItemVisible, getItemStyle } = useStaggeredReveal(
  statCount,
  { staggerDelay: 150, baseDelay: 200 }
)
</script>

<template>
  <section
    id="stats"
    class="py-20 md:py-32 bg-cream/60 dark:bg-deep-navy/40 relative overflow-hidden"
    aria-labelledby="stats-heading"
  >
    <!-- Background decoration -->
    <div class="absolute inset-0" aria-hidden="true">
      <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-neon-coral/10 rounded-full blur-3xl" />
      <div class="absolute top-1/2 right-1/4 w-64 h-64 bg-electric-cyan/10 rounded-full blur-3xl" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Title with scroll reveal -->
      <div
        ref="titleRef"
        class="text-center mb-16 scroll-reveal"
        :class="{ 'is-visible': titleVisible }"
      >
        <h2 id="stats-heading" class="section-title text-gradient">{{ t.stats.title }}</h2>
        <div class="neon-divider" aria-hidden="true" />
      </div>

      <!-- Stats Grid with staggered reveal -->
      <dl
        ref="statsRef"
        class="grid md:grid-cols-3 gap-8 md:gap-12"
        aria-label="Tournament statistics"
      >
        <div
          v-for="(stat, index) in t.stats.items"
          :key="index"
          class="text-center group scroll-reveal-scale"
          :class="{ 'is-visible': isItemVisible(index) }"
          :style="getItemStyle(index)"
        >
          <div class="glass-card p-8 md:p-12 hover:border-neon-coral/50 transition-all duration-300">
            <dt class="sr-only">{{ stat.label }}</dt>
            <dd class="stat-number mb-4" aria-label="stat.number">{{ stat.number }}</dd>
            <dt class="font-display text-xl tracking-wider text-deep-navy/80 dark:text-cream/80">
              {{ stat.label }}
            </dt>
          </div>
        </div>
      </dl>
    </div>
  </section>
</template>
