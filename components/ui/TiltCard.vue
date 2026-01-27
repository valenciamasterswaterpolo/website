<script setup lang="ts">
import { useTilt } from '~/composables/useTilt'

const props = withDefaults(
  defineProps<{
    maxTilt?: number
    scale?: number
    glare?: boolean
    maxGlare?: number
  }>(),
  {
    maxTilt: 10,
    scale: 1.02,
    glare: true,
    maxGlare: 0.15
  }
)

const { elementRef, tiltStyle, glareStyle } = useTilt({
  maxTilt: props.maxTilt,
  scale: props.scale,
  glare: props.glare,
  maxGlare: props.maxGlare
})
</script>

<template>
  <div
    ref="elementRef"
    class="tilt-card relative overflow-hidden"
    :style="tiltStyle"
  >
    <slot />
    <div
      v-if="glare"
      class="absolute inset-0 pointer-events-none rounded-inherit"
      :style="glareStyle"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.tilt-card {
  transform-style: preserve-3d;
  will-change: transform;
}

.rounded-inherit {
  border-radius: inherit;
}

@media (prefers-reduced-motion: reduce) {
  .tilt-card {
    transform: none !important;
  }
}
</style>
