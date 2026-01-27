<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useReducedMotion } from '~/composables/useReducedMotion'

const { t } = useI18n()
const { prefersReducedMotion } = useReducedMotion()

// Content loaded state for staggered entrance
const isContentLoaded = ref(false)

const scrollY = ref(0)
const heroRef = ref<HTMLElement | null>(null)
const heroHeight = ref(0)

const handleScroll = () => {
  scrollY.value = window.scrollY
}

const updateHeroHeight = () => {
  if (heroRef.value) {
    heroHeight.value = heroRef.value.offsetHeight
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', updateHeroHeight)
  updateHeroHeight()

  // Trigger entrance animations after mount
  if (!prefersReducedMotion.value) {
    setTimeout(() => {
      isContentLoaded.value = true
    }, 100)
  } else {
    isContentLoaded.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateHeroHeight)
})

// Parallax calculations
const logoTransform = computed(() => {
  const progress = Math.min(scrollY.value / (heroHeight.value * 0.7), 1)
  const translateY = scrollY.value * 0.4
  const scale = 1 - progress * 0.3
  const opacity = 1 - progress
  return {
    transform: `translateY(${translateY}px) scale(${scale})`,
    opacity: Math.max(opacity, 0)
  }
})

const bgTransform = computed(() => {
  const translateY = scrollY.value * 0.5
  return {
    transform: `translateY(${translateY}px)`
  }
})

const overlayOpacity = computed(() => {
  const progress = Math.min(scrollY.value / (heroHeight.value * 0.5), 1)
  return 0.3 + progress * 0.4
})

const scrollToAbout = () => {
  const aboutSection = document.getElementById('about')
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const { openModal } = inject('modalControls') as { openModal: () => void }
</script>

<template>
  <section
    id="hero"
    ref="heroRef"
    class="relative h-screen min-h-[600px] overflow-hidden"
    aria-labelledby="hero-heading"
  >
    <!-- Background Image with Parallax -->
    <div
      class="absolute inset-0 w-full h-[120%] -top-[10%]"
      :style="bgTransform"
    >
      <img
        src="/images/hero-background.jpg"
        alt=""
        role="presentation"
        class="w-full h-full object-cover"
        width="1920"
        height="1080"
        fetchpriority="high"
      />
    </div>

    <!-- Gradient Overlay -->
    <div
      class="absolute inset-0 transition-opacity duration-300"
      :style="{ backgroundColor: `rgba(14, 36, 51, ${overlayOpacity * 0.7})` }"
      aria-hidden="true"
    />

    <!-- Grid Pattern Overlay -->
    <div class="absolute inset-0 bg-grid-pattern bg-grid opacity-10" aria-hidden="true" />

    <!-- Floating decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        class="absolute top-1/4 left-[10%] w-2 h-2 rounded-full bg-electric-cyan/40 animate-float"
        :style="{ animationDelay: '0s' }"
      />
      <div
        class="absolute top-1/3 right-[15%] w-3 h-3 rounded-full bg-neon-coral/30 animate-float"
        :style="{ animationDelay: '1s' }"
      />
      <div
        class="absolute bottom-1/3 left-[20%] w-2 h-2 rounded-full bg-valencia-purple/30 animate-float"
        :style="{ animationDelay: '2s' }"
      />
      <div
        class="absolute top-1/2 right-[10%] w-1.5 h-1.5 rounded-full bg-cream/30 animate-float"
        :style="{ animationDelay: '0.5s' }"
      />
    </div>

    <!-- Content -->
    <div class="relative z-10 h-full flex flex-col items-center justify-center px-4">
      <!-- Main Heading (H1) - Visually integrated with logo -->
      <h1 id="hero-heading" class="sr-only">
        Valencia Masters Water Polo Cup 2026 - III Masters Water Polo Tournament
      </h1>

      <!-- Logo with Parallax and entrance animation -->
      <div
        class="hero-entrance"
        :class="{ 'is-visible': isContentLoaded }"
        :style="logoTransform"
      >
        <img
          src="/images/logo_year.png"
          alt="Valencia Masters Water Polo Cup 2026"
          class="w-[100%] max-w-[500px] h-auto drop-shadow-2xl"
          width="500"
          height="400"
          fetchpriority="high"
        />
      </div>

      <!-- Subtitle with entrance animation -->
      <p
        class="hero-entrance stagger-1 mt-6 text-lg md:text-xl text-center text-white/90 font-light tracking-wide"
        :class="{ 'is-visible': isContentLoaded }"
        :style="{ opacity: isContentLoaded ? Math.max(1 - scrollY / 300, 0) : 0 }"
      >
        {{ t.hero.subtitle }}
      </p>

      <!-- Dates with entrance animation -->
      <p
        class="hero-entrance stagger-2 mt-4 font-display text-2xl md:text-3xl text-cream tracking-widest text-neon-subtle"
        :class="{ 'is-visible': isContentLoaded }"
        :style="{ opacity: isContentLoaded ? Math.max(1 - scrollY / 300, 0) : 0 }"
      >
        <time datetime="2026-05-16/2026-05-17">{{ t.hero.dates }}</time>
      </p>

      <!-- CTA Button with entrance animation -->
      <button
        class="hero-entrance stagger-3 mt-8 btn-primary"
        :class="{ 'is-visible': isContentLoaded }"
        :style="{ opacity: isContentLoaded ? Math.max(1 - scrollY / 200, 0) : 0 }"
        aria-label="Open pre-registration form"
        @click="openModal"
      >
        {{ t.hero.cta }}
      </button>
    </div>

    <!-- Scroll Indicator with entrance animation -->
    <div
      class="hero-entrance stagger-4 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
      :class="{ 'is-visible': isContentLoaded }"
      :style="{ opacity: isContentLoaded ? Math.max(1 - scrollY / 100, 0) : 0 }"
      role="button"
      tabindex="0"
      :aria-label="t.hero.scroll"
      @click="scrollToAbout"
      @keydown.enter="scrollToAbout"
      @keydown.space.prevent="scrollToAbout"
    >
      <span class="text-sm text-cream/80 tracking-wider" aria-hidden="true">{{ t.hero.scroll }}</span>
      <div class="animate-scroll-bounce" aria-hidden="true">
        <svg
          class="w-6 h-6 text-cream"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hero entrance animation */
.hero-entrance {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-entrance.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delays for hero */
.hero-entrance.stagger-1 { transition-delay: 200ms; }
.hero-entrance.stagger-2 { transition-delay: 400ms; }
.hero-entrance.stagger-3 { transition-delay: 600ms; }
.hero-entrance.stagger-4 { transition-delay: 800ms; }

@media (prefers-reduced-motion: reduce) {
  .hero-entrance {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
