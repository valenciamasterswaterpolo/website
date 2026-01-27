<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useScrollReveal } from '~/composables/useScrollReveal'

const { t } = useI18n()

const { openModal } = inject('modalControls') as { openModal: () => void }

// Scroll reveal for the section
const { elementRef: titleRef, isVisible: titleVisible } = useScrollReveal({ threshold: 0.3 })
const { elementRef: cardRef, isVisible: cardVisible } = useScrollReveal({ threshold: 0.2, delay: 200 })

// Offer/PriceSpecification JSON-LD for SEO
const offerJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Offer',
  'name': 'Team Registration - Valencia Masters Water Polo Cup 2026',
  'description': 'Team registration fee for the Valencia Masters Water Polo Cup 2026. Includes up to 16 players.',
  'price': '250',
  'priceCurrency': 'EUR',
  'availability': 'https://schema.org/InStock',
  'validFrom': '2025-01-01',
  'validThrough': '2026-04-15',
  'url': 'https://valenciamasterswaterpolo.com/#registration',
  'eligibleQuantity': {
    '@type': 'QuantitativeValue',
    'value': '16',
    'unitText': 'players'
  },
  'seller': {
    '@type': 'Organization',
    'name': 'Valencia Masters Water Polo Cup',
    'url': 'https://valenciamasterswaterpolo.com'
  }
}))

// Inject JSON-LD into head for SEO
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify(offerJsonLd.value)
  }]
})
</script>

<template>
  <section
    id="registration"
    class="py-20 md:py-32 relative overflow-hidden bg-aqua-wash/40"
    aria-labelledby="registration-heading"
  >
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-neon-coral/5 via-transparent to-electric-cyan/5" aria-hidden="true" />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Title with scroll reveal -->
      <div
        ref="titleRef"
        class="text-center mb-16 scroll-reveal"
        :class="{ 'is-visible': titleVisible }"
      >
        <h2 id="registration-heading" class="section-title text-gradient">{{ t.registration.title }}</h2>
        <div class="neon-divider" aria-hidden="true" />
      </div>

      <!-- Registration Card with scroll reveal -->
      <article
        ref="cardRef"
        class="glass-card p-8 md:p-12 text-center scroll-reveal-scale"
        :class="{ 'is-visible': cardVisible }"
      >
        <!-- Price -->
        <div class="mb-8">
          <p class="text-ocean-blue dark:text-electric-cyan text-sm uppercase tracking-widest mb-2">
            {{ t.registration.fee.label }}
          </p>
          <p class="font-display text-6xl md:text-7xl text-gradient mb-2">
            <data value="250">{{ t.registration.fee.value }}</data>
          </p>
          <p class="text-deep-navy/60 dark:text-cream/60">{{ t.registration.fee.per }}</p>
          <p class="text-deep-navy/50 dark:text-cream/50 text-sm mt-2 italic">{{ t.registration.fee.note }}</p>
        </div>

        <!-- Divider -->
        <div class="w-full h-px bg-gradient-to-r from-transparent via-soft-slate/30 to-transparent my-8" aria-hidden="true" />

        <!-- Features -->
        <dl class="grid md:grid-cols-2 gap-6 mb-8">
          <div class="flex items-center gap-4 p-4 rounded-lg bg-deep-navy/5 dark:bg-cream/5">
            <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-ocean-blue/15 text-ocean-blue" aria-hidden="true">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="text-left">
              <dt class="font-display text-sm tracking-wide text-ocean-blue dark:text-electric-cyan">{{ t.registration.players.label }}</dt>
              <dd class="text-deep-navy/80 dark:text-cream/80 text-sm">{{ t.registration.players.value }}</dd>
            </div>
          </div>

          <div class="flex items-center gap-4 p-4 rounded-lg bg-deep-navy/5 dark:bg-cream/5">
            <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-neon-coral/15 text-neon-coral" aria-hidden="true">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="text-left">
              <dt class="font-display text-sm tracking-wide text-neon-coral">{{ t.registration.extra.label }}</dt>
              <dd class="text-deep-navy/80 dark:text-cream/80 text-sm">{{ t.registration.extra.value }}</dd>
            </div>
          </div>
        </dl>

        <!-- CTA Button -->
        <button
          class="btn-primary text-xl"
          aria-label="Open pre-registration form"
          @click="openModal"
        >
          {{ t.registration.cta }}
        </button>
      </article>
    </div>
  </section>
</template>
