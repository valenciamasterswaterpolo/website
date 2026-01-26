<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <section id="stats" class="py-20 md:py-32 bg-cream/60 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0">
      <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-neon-coral/10 rounded-full blur-3xl" />
      <div class="absolute top-1/2 right-1/4 w-64 h-64 bg-electric-cyan/10 rounded-full blur-3xl" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Title -->
      <div class="text-center mb-16">
        <h2 class="section-title text-gradient">{{ t.stats.title }}</h2>
        <div class="neon-divider" />
      </div>

      <!-- Stats Grid -->
      <div class="grid md:grid-cols-3 gap-8 md:gap-12">
        <div
          v-for="(stat, index) in t.stats.items"
          :key="index"
          class="text-center group"
        >
          <div class="glass-card p-8 md:p-12 hover:border-neon-coral/50 transition-all">
            <p class="stat-number mb-4">{{ stat.number }}</p>
            <p class="font-display text-xl tracking-wider text-deep-navy/80">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
