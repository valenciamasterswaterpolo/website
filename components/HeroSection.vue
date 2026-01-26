<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

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
    ref="heroRef"
    class="relative h-screen min-h-[600px] overflow-hidden"
  >
    <!-- Background Image with Parallax -->
    <div
      class="absolute inset-0 w-full h-[120%] -top-[10%]"
      :style="bgTransform"
    >
      <img
        src="/images/hero-background.png"
        alt="Valencia sunset with water polo"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Gradient Overlay -->
    <div
      class="absolute inset-0 transition-opacity duration-300"
      :style="{ backgroundColor: `rgba(14, 36, 51, ${overlayOpacity * 0.7})` }"
    />

    <!-- Grid Pattern Overlay -->
    <div class="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />

    <!-- Content -->
    <div class="relative z-10 h-full flex flex-col items-center justify-center px-4">
      <!-- Logo with Parallax -->
      <div
        class="transition-all duration-100 ease-out"
        :style="logoTransform"
      >
        <img
          src="/images/logo_year.png"
          alt="Valencia Masters Water Polo Cup 2026"
          class="w-[280px] md:w-[400px] lg:w-[500px] h-auto drop-shadow-2xl"
        />
      </div>

      <!-- Subtitle -->
      <p
        class="mt-6 text-lg md:text-xl text-center text-white/90 font-light tracking-wide transition-opacity duration-300"
        :style="{ opacity: 1 - Math.min(scrollY / 300, 1) }"
      >
        {{ t.hero.subtitle }}
      </p>

      <!-- Dates -->
      <p
        class="mt-4 font-display text-2xl md:text-3xl text-cream tracking-widest text-neon-subtle transition-opacity duration-300"
        :style="{ opacity: 1 - Math.min(scrollY / 300, 1) }"
      >
        {{ t.hero.dates }}
      </p>

      <!-- CTA Button -->
      <button
        class="mt-8 btn-primary transition-opacity duration-300"
        :style="{ opacity: 1 - Math.min(scrollY / 200, 1) }"
        @click="openModal"
      >
        {{ t.hero.cta }}
      </button>
    </div>

    <!-- Scroll Indicator -->
    <div
      class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-300 cursor-pointer"
      :style="{ opacity: 1 - Math.min(scrollY / 100, 1) }"
      @click="scrollToAbout"
    >
      <span class="text-sm text-cream/80 tracking-wider">{{ t.hero.scroll }}</span>
      <div class="animate-scroll-bounce">
        <svg
          class="w-6 h-6 text-cream"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
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
