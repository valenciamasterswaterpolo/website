<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

const isVisible = ref(false)
const sectionRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    },
    { threshold: 0.2 }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})

// Icon components for each format item
const icons: Record<string, string> = {
  fields: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="8" height="16" rx="1"/><rect x="14" y="4" width="8" height="16" rx="1"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  bracket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4v4h4M4 20v-4h4M20 4v4h-4M20 20v-4h-4"/><circle cx="12" cy="12" r="3"/></svg>`,
  score: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="6" width="9" height="12" rx="1"/><rect x="13" y="6" width="9" height="12" rx="1"/><text x="6.5" y="14" font-size="6" fill="currentColor" text-anchor="middle">3</text><text x="17.5" y="14" font-size="6" fill="currentColor" text-anchor="middle">0</text></svg>`,
  penalty: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="2" width="16" height="12" rx="1"/><circle cx="12" cy="18" r="3"/><path d="M12 15v-3"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9H4a2 2 0 01-2-2V5h4M18 9h2a2 2 0 002-2V5h-4"/><path d="M4 5h16v4a6 6 0 01-6 6h-4a6 6 0 01-6-6V5z"/><path d="M12 15v4M8 21h8"/></svg>`
}

const getIcon = (icon: string) => icons[icon] || ''
</script>

<template>
  <section
    id="format"
    ref="sectionRef"
    class="py-20 md:py-32 relative overflow-hidden bg-cream/50 dark:bg-deep-navy/30"
    aria-labelledby="format-heading"
  >
    <!-- Background decorations -->
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-valencia-purple/5 to-transparent" aria-hidden="true" />

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Title -->
      <div class="text-center mb-12">
        <h2 id="format-heading" class="section-title text-gradient">{{ t.format.title }}</h2>
        <div class="neon-divider" aria-hidden="true" />
      </div>

      <!-- Format Info Cards -->
      <ul class="grid grid-cols-2 md:grid-cols-3 gap-4" role="list" aria-label="Tournament format details">
        <li
          v-for="(item, index) in t.format.items"
          :key="item.key"
          class="format-card group"
          :class="{ 'animate-slide-up': isVisible }"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-electric-cyan/20 to-ocean-blue/20 text-ocean-blue group-hover:shadow-neon-subtle transition-all"
              v-html="getIcon(item.icon)"
              aria-hidden="true"
            />
            <span class="text-deep-navy/90 dark:text-cream/90 font-medium text-sm md:text-base">{{ item.text }}</span>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* Format card styling */
.format-card {
  @apply p-4 rounded-xl backdrop-blur-sm border border-soft-slate/20;
  background: rgba(252, 251, 217, 0.5);
  @apply hover:border-electric-cyan/30 transition-all duration-300;
}

.dark .format-card {
  background: rgba(26, 52, 68, 0.5);
}

/* Slide up animation for cards */
.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
