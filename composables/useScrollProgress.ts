import { ref, onMounted, onUnmounted, computed } from 'vue'

/**
 * Composable to track global scroll progress
 * Returns scroll position and progress (0-1) through the page
 */
export function useScrollProgress() {
  const scrollY = ref(0)
  const documentHeight = ref(0)
  const viewportHeight = ref(0)

  const progress = computed(() => {
    const maxScroll = documentHeight.value - viewportHeight.value
    if (maxScroll <= 0) return 0
    return Math.min(scrollY.value / maxScroll, 1)
  })

  let ticking = false

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        scrollY.value = window.scrollY
        documentHeight.value = document.documentElement.scrollHeight
        viewportHeight.value = window.innerHeight
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

  return { scrollY, progress, documentHeight, viewportHeight }
}
