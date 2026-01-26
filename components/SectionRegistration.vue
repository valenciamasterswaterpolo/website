<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

const { openModal } = inject('modalControls') as { openModal: () => void }
</script>

<template>
  <section id="registration" class="py-20 md:py-32 relative overflow-hidden bg-aqua-wash/40">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-neon-coral/5 via-transparent to-electric-cyan/5" />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Title -->
      <div class="text-center mb-16">
        <h2 class="section-title text-gradient">{{ t.registration.title }}</h2>
        <div class="neon-divider" />
      </div>

      <!-- Registration Card -->
      <div class="glass-card p-8 md:p-12 text-center">
        <!-- Price -->
        <div class="mb-8">
          <p class="text-ocean-blue text-sm uppercase tracking-widest mb-2">
            {{ t.registration.fee.label }}
          </p>
          <p class="font-display text-6xl md:text-7xl text-gradient mb-2">
            {{ t.registration.fee.value }}
          </p>
          <p class="text-deep-navy/60">{{ t.registration.fee.per }}</p>
          <p class="text-deep-navy/50 text-sm mt-2 italic">{{ t.registration.fee.note }}</p>
        </div>

        <!-- Divider -->
        <div class="w-full h-px bg-gradient-to-r from-transparent via-soft-slate/30 to-transparent my-8" />

        <!-- Features -->
        <div class="grid md:grid-cols-2 gap-6 mb-8">
          <div class="flex items-center gap-4 p-4 rounded-lg bg-deep-navy/5">
            <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-ocean-blue/15 text-ocean-blue">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="font-display text-sm tracking-wide text-ocean-blue">{{ t.registration.players.label }}</p>
              <p class="text-deep-navy/80 text-sm">{{ t.registration.players.value }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4 p-4 rounded-lg bg-deep-navy/5">
            <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-neon-coral/15 text-neon-coral">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="font-display text-sm tracking-wide text-neon-coral">{{ t.registration.extra.label }}</p>
              <p class="text-deep-navy/80 text-sm">{{ t.registration.extra.value }}</p>
            </div>
          </div>
        </div>

        <!-- CTA Button -->
        <button
          class="btn-primary text-xl"
          @click="openModal"
        >
          {{ t.registration.cta }}
        </button>
      </div>
    </div>
  </section>
</template>
