import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useReducedMotion } from './useReducedMotion'

interface TiltOptions {
  maxTilt?: number
  scale?: number
  perspective?: number
  speed?: number
  glare?: boolean
  maxGlare?: number
}

/**
 * Composable for 3D tilt effect on cards
 * Creates a premium hover interaction with optional glare effect
 */
export function useTilt(options: TiltOptions = {}) {
  const {
    maxTilt = 10,
    scale = 1.02,
    perspective = 1000,
    speed = 400,
    glare = true,
    maxGlare = 0.15
  } = options

  const { prefersReducedMotion } = useReducedMotion()
  const elementRef = ref<HTMLElement | null>(null)

  const tiltState = reactive({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    isHovered: false
  })

  const handleMouseMove = (e: MouseEvent) => {
    if (prefersReducedMotion.value || !elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    const percentX = mouseX / (rect.width / 2)
    const percentY = mouseY / (rect.height / 2)

    tiltState.rotateX = -percentY * maxTilt
    tiltState.rotateY = percentX * maxTilt
    tiltState.scale = scale

    if (glare) {
      tiltState.glareX = ((e.clientX - rect.left) / rect.width) * 100
      tiltState.glareY = ((e.clientY - rect.top) / rect.height) * 100
      tiltState.glareOpacity = maxGlare
    }
  }

  const handleMouseEnter = () => {
    tiltState.isHovered = true
  }

  const handleMouseLeave = () => {
    tiltState.rotateX = 0
    tiltState.rotateY = 0
    tiltState.scale = 1
    tiltState.glareOpacity = 0
    tiltState.isHovered = false
  }

  const tiltStyle = computed(() => {
    if (prefersReducedMotion.value) return {}
    return {
      transform: `perspective(${perspective}px) rotateX(${tiltState.rotateX}deg) rotateY(${tiltState.rotateY}deg) scale(${tiltState.scale})`,
      transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`
    }
  })

  const glareStyle = computed(() => {
    if (prefersReducedMotion.value || !glare) return { display: 'none' }
    return {
      background: `radial-gradient(circle at ${tiltState.glareX}% ${tiltState.glareY}%, rgba(255,255,255,${tiltState.glareOpacity}), transparent 60%)`,
      transition: `opacity ${speed}ms ease-out`,
      opacity: tiltState.isHovered ? 1 : 0
    }
  })

  onMounted(() => {
    if (elementRef.value && !prefersReducedMotion.value) {
      elementRef.value.addEventListener('mousemove', handleMouseMove)
      elementRef.value.addEventListener('mouseenter', handleMouseEnter)
      elementRef.value.addEventListener('mouseleave', handleMouseLeave)
    }
  })

  onUnmounted(() => {
    if (elementRef.value) {
      elementRef.value.removeEventListener('mousemove', handleMouseMove)
      elementRef.value.removeEventListener('mouseenter', handleMouseEnter)
      elementRef.value.removeEventListener('mouseleave', handleMouseLeave)
    }
  })

  return { elementRef, tiltStyle, glareStyle, tiltState }
}
