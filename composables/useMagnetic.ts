import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useReducedMotion } from './useReducedMotion'

interface MagneticOptions {
  strength?: number
  range?: number
}

/**
 * Composable for magnetic button effect
 * Button subtly follows cursor when nearby
 */
export function useMagnetic(options: MagneticOptions = {}) {
  const { strength = 0.3, range = 100 } = options
  const { prefersReducedMotion } = useReducedMotion()

  const elementRef = ref<HTMLElement | null>(null)
  const position = reactive({ x: 0, y: 0 })
  const isInRange = ref(false)

  const handleMouseMove = (e: MouseEvent) => {
    if (prefersReducedMotion.value || !elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

    if (distance < range) {
      isInRange.value = true
      const factor = 1 - distance / range
      position.x = distanceX * strength * factor
      position.y = distanceY * strength * factor
    } else if (isInRange.value) {
      isInRange.value = false
      position.x = 0
      position.y = 0
    }
  }

  const handleMouseLeave = () => {
    isInRange.value = false
    position.x = 0
    position.y = 0
  }

  const magneticStyle = computed(() => {
    if (prefersReducedMotion.value) return {}
    return {
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition:
        position.x === 0 && position.y === 0
          ? 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)'
          : 'transform 0.15s ease-out'
    }
  })

  onMounted(() => {
    if (typeof window !== 'undefined' && !prefersReducedMotion.value) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
      if (elementRef.value) {
        elementRef.value.addEventListener('mouseleave', handleMouseLeave)
      }
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', handleMouseMove)
      if (elementRef.value) {
        elementRef.value.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  })

  return { elementRef, magneticStyle, position, isInRange }
}
