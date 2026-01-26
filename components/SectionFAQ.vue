<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

const openItems = ref<number[]>([0]) // First item open by default

const toggleItem = (index: number) => {
  const idx = openItems.value.indexOf(index)
  if (idx > -1) {
    openItems.value.splice(idx, 1)
  } else {
    openItems.value.push(index)
  }
}

const isOpen = (index: number) => openItems.value.includes(index)

const chevronIcon = `<svg class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>`
</script>

<template>
  <section id="faq" class="py-20 md:py-32 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-electric-cyan/10 rounded-full blur-3xl" />
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-valencia-purple/10 rounded-full blur-3xl" />

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Title -->
      <div class="text-center mb-16">
        <h2 class="section-title text-gradient">{{ t.faq.title }}</h2>
        <div class="neon-divider" />
      </div>

      <!-- FAQ Accordion -->
      <div class="space-y-4">
        <div
          v-for="(item, index) in t.faq.items"
          :key="index"
          class="glass-card overflow-hidden"
        >
          <!-- Accordion Header -->
          <button
            @click="toggleItem(index)"
            class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-ocean-blue/5 dark:hover:bg-ocean-blue/10 transition-colors"
          >
            <span class="font-display text-lg tracking-wide text-deep-navy dark:text-cream pr-4">
              {{ item.question }}
            </span>
            <span
              class="flex-shrink-0 text-ocean-blue dark:text-electric-cyan"
              :class="{ 'rotate-180': isOpen(index) }"
              v-html="chevronIcon"
            />
          </button>

          <!-- Accordion Content -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-96 opacity-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="max-h-96 opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div v-show="isOpen(index)" class="overflow-hidden">
              <div class="px-6 pb-4 text-deep-navy/70 dark:text-cream/70 leading-relaxed border-t border-soft-slate/10 dark:border-soft-slate/20 pt-4">
                {{ item.answer }}
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Contact CTA -->
      <div class="text-center mt-12">
        <p class="text-deep-navy/60 dark:text-cream/60 mb-4">{{ t.faq.moreQuestions }}</p>
        <a
          :href="`mailto:${t.contact.email}`"
          class="btn-primary inline-flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {{ t.faq.contactUs }}
        </a>
      </div>
    </div>
  </section>
</template>
