<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const emit = defineEmits(['open-modal'])

const { t, currentLanguage, toggleLanguage } = useI18n()

const scrollY = ref(0)
const isMenuOpen = ref(false)

const handleScroll = () => {
  scrollY.value = window.scrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Show navbar after scrolling past 80% of viewport height
const showNavbar = computed(() => scrollY.value > window.innerHeight * 0.8)

// Fetch teams data to conditionally show teams nav link
interface TeamsData {
  teams: Array<{ name: string; logo: string }>
}
const { data: teamsData } = await useFetch<TeamsData>('/data/teams.json')
const hasTeams = computed(() => (teamsData.value?.teams || []).length > 0)

const navLinks = computed(() => {
  const links = [
    { href: '#about', label: t.value.nav.about },
    { href: '#schedule', label: t.value.nav.schedule },
    { href: '#format', label: t.value.nav.format },
    { href: '#why', label: t.value.nav.why },
  ]

  // Only show teams link if teams exist
  if (hasTeams.value) {
    links.push({ href: '#teams', label: t.value.nav.teams })
  }

  links.push(
    { href: '#valencia', label: t.value.nav.valencia },
    { href: '#registration', label: t.value.nav.registration },
    { href: '#faq', label: t.value.nav.faq },
    { href: '#contact', label: t.value.nav.contact }
  )

  return links
})

const scrollToSection = (href: string) => {
  isMenuOpen.value = false
  const element = document.querySelector(href)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const openModal = () => {
  isMenuOpen.value = false
  emit('open-modal')
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Close menu on escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMenuOpen.value) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <!-- Skip to main content link for accessibility -->
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-valencia-purple focus:text-white focus:rounded-lg"
  >
    Skip to main content
  </a>

  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="[
      showNavbar
        ? 'bg-cream/95 dark:bg-dark-bg/95 backdrop-blur-md shadow-lg border-b border-soft-slate/20 dark:border-soft-slate/10 translate-y-0'
        : '-translate-y-full'
    ]"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <a
          href="/"
          class="flex items-center gap-3 transition-transform hover:scale-105"
          aria-label="Valencia Masters Water Polo Cup - Home"
          @click.prevent="scrollToTop"
        >
          <img
            src="/images/logo.png"
            alt="Valencia Masters Water Polo Cup"
            class="h-[130px] translate-y-2 w-auto"
            width="130"
            height="130"
            loading="eager"
          />
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center gap-6" role="list">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            role="listitem"
            class="text-sm font-medium text-deep-navy/80 dark:text-cream/80 hover:text-ocean-blue dark:hover:text-electric-cyan transition-colors tracking-wide"
            @click.prevent="scrollToSection(link.href)"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- Right side: Language + CTA -->
        <div class="hidden lg:flex items-center gap-4">
          <!-- Dark Mode Toggle -->
          <DarkModeToggle />

          <!-- Language Switcher -->
          <button
            class="flex items-center gap-2 px-3 py-1.5 border border-soft-slate/30 rounded-full text-sm text-deep-navy/80 dark:text-cream/80 hover:border-ocean-blue dark:hover:border-electric-cyan hover:text-ocean-blue dark:hover:text-electric-cyan transition-all"
            :aria-label="`Switch language to ${currentLanguage === 'es' ? 'English' : 'Español'}`"
            @click="toggleLanguage"
          >
            <span class="font-medium uppercase">{{ currentLanguage }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </button>

          <!-- Pre-registration CTA -->
          <button
            class="px-5 py-2 font-display text-sm tracking-widest uppercase bg-valencia-purple text-white rounded-full hover:bg-valencia-purple-hover hover:shadow-btn-primary transition-all hover:scale-105"
            aria-label="Open pre-registration form"
            @click="openModal"
          >
            {{ t.nav.preRegister }}
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="lg:hidden p-2 text-deep-navy dark:text-cream"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          :aria-label="isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg
            v-if="!isMenuOpen"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div
          v-if="isMenuOpen"
          id="mobile-menu"
          class="lg:hidden py-4 border-t border-soft-slate/20 dark:border-soft-slate/10"
          role="menu"
        >
          <div class="flex flex-col gap-2">
            <a
              v-for="link in navLinks"
              :key="link.href"
              :href="link.href"
              role="menuitem"
              class="px-4 py-2 text-deep-navy/80 dark:text-cream/80 hover:text-ocean-blue dark:hover:text-electric-cyan hover:bg-deep-navy/5 dark:hover:bg-cream/5 rounded-lg transition-all"
              @click.prevent="scrollToSection(link.href)"
            >
              {{ link.label }}
            </a>

            <div class="flex items-center justify-between px-4 pt-4 mt-2 border-t border-soft-slate/20 dark:border-soft-slate/10">
              <div class="flex items-center gap-3">
                <!-- Dark Mode Toggle (Mobile) -->
                <DarkModeToggle />

                <!-- Language Switcher (Mobile) -->
                <button
                  class="flex items-center gap-2 text-deep-navy/80 dark:text-cream/80"
                  :aria-label="`Switch language to ${currentLanguage === 'es' ? 'English' : 'Español'}`"
                  @click="toggleLanguage"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span class="uppercase font-medium">{{ currentLanguage === 'es' ? 'EN' : 'ES' }}</span>
                </button>
              </div>

              <button
                class="px-4 py-2 font-display text-sm tracking-widest uppercase bg-valencia-purple text-white rounded-full hover:bg-valencia-purple-hover"
                role="menuitem"
                aria-label="Open pre-registration form"
                @click="openModal"
              >
                {{ t.nav.preRegister }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>
