<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

useHead({
  title: () => `${t.value.terms.title} | Valencia Masters Water Polo Cup`
})
</script>

<template>
  <div class="min-h-screen bg-cream dark:bg-dark-bg">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <!-- Header -->
      <header class="mb-12">
        <h1 class="text-4xl md:text-5xl font-display text-deep-navy dark:text-cream mb-4">
          {{ t.terms.title }}
        </h1>
        <p class="text-soft-slate dark:text-cream/60">
          {{ t.terms.lastUpdated }}
        </p>
      </header>

      <!-- Introduction -->
      <p class="text-lg text-deep-navy/80 dark:text-cream/80 mb-12 leading-relaxed">
        {{ t.terms.intro }}
      </p>

      <!-- Sections -->
      <div class="space-y-8">
        <section
          v-for="(section, index) in t.terms.sections"
          :key="index"
          class="glass-card p-6 md:p-8"
        >
          <h2 class="text-xl md:text-2xl font-display text-deep-navy dark:text-cream mb-4">
            {{ section.title }}
          </h2>
          <p class="text-deep-navy/70 dark:text-cream/70 leading-relaxed">
            {{ section.content }}
          </p>
        </section>
      </div>

      <!-- Back to home -->
      <div class="mt-12 text-center">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-valencia-purple dark:text-electric-cyan hover:underline"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ t.terms.backToHome }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
