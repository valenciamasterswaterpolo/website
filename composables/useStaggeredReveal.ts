import { ref, computed, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { useReducedMotion } from './useReducedMotion'

interface StaggerOptions {
  threshold?: number
  rootMargin?: string
  baseDelay?: number
  staggerDelay?: number
  once?: boolean
}

/**
 * Composable for orchestrated staggered animations on child elements
 * Triggers sequential reveal of items when container enters viewport
 */
export function useStaggeredReveal(
  itemCount: number | Ref<number> | (() => number),
  options: StaggerOptions = {}
) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    baseDelay = 0,
    staggerDelay = 100,
    once = true
  } = options

  const { prefersReducedMotion } = useReducedMotion()

  const containerRef = ref<HTMLElement | null>(null)
  const isContainerVisible = ref(false)
  const visibleItems = ref<boolean[]>([])
  const hasAnimated = ref(false)

  const count = computed(() => {
    if (typeof itemCount === 'function') return itemCount()
    if (typeof itemCount === 'number') return itemCount
    return itemCount.value
  })

  const initializeItems = () => {
    visibleItems.value = new Array(count.value).fill(false)
  }

  const animateItems = () => {
    if (prefersReducedMotion.value) {
      visibleItems.value = new Array(count.value).fill(true)
      return
    }

    for (let i = 0; i < count.value; i++) {
      setTimeout(() => {
        if (visibleItems.value[i] !== undefined) {
          visibleItems.value[i] = true
        }
      }, baseDelay + i * staggerDelay)
    }
  }

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    initializeItems()

    if (prefersReducedMotion.value) {
      isContainerVisible.value = true
      visibleItems.value = new Array(count.value).fill(true)
      hasAnimated.value = true
      return
    }

    if (!containerRef.value || typeof window === 'undefined') return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!once || !hasAnimated.value)) {
            isContainerVisible.value = true
            hasAnimated.value = true
            animateItems()

            if (once && observer) {
              observer.unobserve(entry.target)
            }
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(containerRef.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  // Re-initialize when count changes
  watch(count, () => {
    initializeItems()
    if (hasAnimated.value) {
      animateItems()
    }
  })

  // Watch for reduced motion preference changes
  watch(prefersReducedMotion, (reduced) => {
    if (reduced) {
      isContainerVisible.value = true
      visibleItems.value = new Array(count.value).fill(true)
      hasAnimated.value = true
      observer?.disconnect()
    }
  })

  const getItemStyle = (index: number) => {
    if (prefersReducedMotion.value) return {}
    return {
      transitionDelay: `${baseDelay + index * staggerDelay}ms`
    }
  }

  const isItemVisible = (index: number) => {
    return visibleItems.value[index] ?? false
  }

  return {
    containerRef,
    isContainerVisible,
    visibleItems,
    getItemStyle,
    isItemVisible,
    hasAnimated
  }
}
