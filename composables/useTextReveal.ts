import { ref, computed, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { useReducedMotion } from './useReducedMotion'

type RevealMode = 'chars' | 'words' | 'lines'

interface TextRevealOptions {
  mode?: RevealMode
  threshold?: number
  staggerDelay?: number
  duration?: number
}

/**
 * Composable for character, word, or line-based text animations
 * Creates dramatic text reveal effects
 */
export function useTextReveal(
  text: string | Ref<string> | (() => string),
  options: TextRevealOptions = {}
) {
  const {
    mode = 'words',
    threshold = 0.3,
    staggerDelay = 50,
    duration = 600
  } = options

  const { prefersReducedMotion } = useReducedMotion()

  const elementRef = ref<HTMLElement | null>(null)
  const isRevealed = ref(false)

  const textValue = computed(() => {
    if (typeof text === 'function') return text()
    if (typeof text === 'string') return text
    return text.value
  })

  const segments = computed(() => {
    const t = textValue.value
    switch (mode) {
      case 'chars':
        return t.split('')
      case 'words':
        return t.split(' ')
      case 'lines':
        return t.split('\n')
      default:
        return [t]
    }
  })

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (prefersReducedMotion.value) {
      isRevealed.value = true
      return
    }

    if (!elementRef.value || typeof window === 'undefined') return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isRevealed.value = true
            observer?.disconnect()
          }
        })
      },
      { threshold }
    )

    observer.observe(elementRef.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  watch(prefersReducedMotion, (reduced) => {
    if (reduced) isRevealed.value = true
  })

  const getSegmentStyle = (index: number) => {
    if (prefersReducedMotion.value) return {}
    return {
      animationDelay: `${index * staggerDelay}ms`,
      animationDuration: `${duration}ms`
    }
  }

  const separator = computed(() => (mode === 'words' ? '\u00A0' : ''))

  return {
    elementRef,
    isRevealed,
    segments,
    getSegmentStyle,
    mode,
    separator
  }
}
