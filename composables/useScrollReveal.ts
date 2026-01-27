import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useReducedMotion } from './useReducedMotion'

interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
  delay?: number
}

/**
 * Composable for scroll-triggered reveal animations
 * Uses IntersectionObserver for performance
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const {
    threshold = 0.2,
    rootMargin = '0px 0px -50px 0px',
    once = true,
    delay = 0
  } = options

  const { prefersReducedMotion } = useReducedMotion()

  const elementRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)
  const hasAnimated = ref(false)

  let observer: IntersectionObserver | null = null
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const setupObserver = () => {
    if (!elementRef.value || typeof window === 'undefined') return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!once || !hasAnimated.value)) {
            if (delay > 0 && !prefersReducedMotion.value) {
              timeoutId = setTimeout(() => {
                isVisible.value = true
                hasAnimated.value = true
              }, delay)
            } else {
              isVisible.value = true
              hasAnimated.value = true
            }

            if (once && observer) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            isVisible.value = false
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(elementRef.value)
  }

  onMounted(() => {
    // If reduced motion, immediately show without animation
    if (prefersReducedMotion.value) {
      isVisible.value = true
      hasAnimated.value = true
    } else {
      setupObserver()
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
    if (timeoutId) clearTimeout(timeoutId)
  })

  // Watch for reduced motion preference changes
  watch(prefersReducedMotion, (reduced) => {
    if (reduced) {
      isVisible.value = true
      hasAnimated.value = true
      observer?.disconnect()
    }
  })

  return { elementRef, isVisible, hasAnimated }
}
