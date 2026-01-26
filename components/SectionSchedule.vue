<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <section id="schedule" class="py-20 md:py-32 bg-peach-wash/30 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Title -->
      <div class="text-center mb-16">
        <h2 class="section-title text-gradient">{{ t.schedule.title }}</h2>
        <div class="neon-divider" />
      </div>

      <!-- Info Cards Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Category -->
        <div class="glass-card p-6 text-center">
          <div class="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-ocean-blue/15 text-ocean-blue">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 class="font-display text-lg tracking-wide text-ocean-blue mb-2">
            {{ t.schedule.category.label }}
          </h3>
          <p class="text-deep-navy font-medium">{{ t.schedule.category.value }}</p>
        </div>

        <!-- Dates -->
        <div class="glass-card p-6 text-center">
          <div class="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-neon-coral/15 text-neon-coral">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="font-display text-lg tracking-wide text-neon-coral mb-2">
            {{ t.schedule.dates.label }}
          </h3>
          <p class="text-deep-navy font-medium">{{ t.schedule.dates.value }}</p>
        </div>

        <!-- Times -->
        <div class="glass-card p-6 text-center">
          <div class="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-sunset-peach/30 text-valencia-purple">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="font-display text-lg tracking-wide text-valencia-purple mb-2">
            {{ t.schedule.times.label }}
          </h3>
          <p class="text-deep-navy font-medium text-sm">{{ t.schedule.times.saturday }}</p>
          <p class="text-deep-navy font-medium text-sm">{{ t.schedule.times.sunday }}</p>
        </div>

        <!-- Location -->
        <div class="glass-card p-6 text-center">
          <div class="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-valencia-purple/15 text-valencia-purple">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="font-display text-lg tracking-wide text-valencia-purple mb-2">
            {{ t.schedule.location.label }}
          </h3>
          <p class="text-deep-navy font-medium text-sm">{{ t.schedule.location.value }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
