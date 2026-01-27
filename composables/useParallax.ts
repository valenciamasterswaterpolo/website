import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useReducedMotion } from './useReducedMotion'

interface ParallaxOptions {
  speed?: number
  direction?: 'up' | 'down'
  scale?: boolean
  opacity?: boolean
  maxOffset?: number
}

/**
 * Composable for parallax scroll effects
 * Creates depth and layering based on scroll position
 */
export function useParallax(options: ParallaxOptions = {}) {
  const {
    speed = 0.3,
    direction = 'up',
    scale = false,
    opacity = false,
    maxOffset = 200
  } = options

  const { prefersReducedMotion } = useReducedMotion()

  const elementRef = ref<HTMLElement | null>(null)
  const scrollY = ref(0)
  const elementTop = ref(0)
  const elementHeight = ref(0)
  const viewportHeight = ref(0)

  const progress = computed(() => {
    if (!elementRef.value) return 0
    const start = elementTop.value - viewportHeight.value
    const end = elementTop.value + elementHeight.value
    const current = scrollY.value - start
    const total = end - start
    return Math.min(Math.max(current / total, 0), 1)
  })

  const transform = computed(() => {
    if (prefersReducedMotion.value) return {}

    const multiplier = direction === 'up' ? -1 : 1
    const rawTranslate = (progress.value - 0.5) * speed * maxOffset * 2 * multiplier
    const translateY = Math.max(-maxOffset, Math.min(maxOffset, rawTranslate))
    const scaleValue = scale ? 1 + progress.value * 0.1 : 1
    const opacityValue = opacity ? 0.5 + progress.value * 0.5 : 1

    return {
      transform: `translateY(${translateY}px) scale(${scaleValue})`,
      opacity: opacityValue
    }
  })

  let ticking = false

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        scrollY.value = window.scrollY
        viewportHeight.value = window.innerHeight
        if (elementRef.value) {
          const rect = elementRef.value.getBoundingClientRect()
          elementTop.value = rect.top + scrollY.value
          elementHeight.value = rect.height
        }
        ticking = false
      })
      ticking = true
    }
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      handleScroll()
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll, { passive: true })
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  })

  return { elementRef, transform, progress }
}
