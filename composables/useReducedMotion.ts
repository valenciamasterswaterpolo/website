import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable to detect user's reduced motion preference
 * Respects the prefers-reduced-motion media query for accessibility
 */
export function useReducedMotion() {
  const prefersReducedMotion = ref(false)
  let mediaQuery: MediaQueryList | null = null

  const updatePreference = () => {
    prefersReducedMotion.value = mediaQuery?.matches ?? false
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      prefersReducedMotion.value = mediaQuery.matches
      mediaQuery.addEventListener('change', updatePreference)
    }
  })

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', updatePreference)
  })

  return { prefersReducedMotion }
}
