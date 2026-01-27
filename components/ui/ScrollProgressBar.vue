<script setup lang="ts">
import { useScrollProgress } from '~/composables/useScrollProgress'
import { useReducedMotion } from '~/composables/useReducedMotion'

const { progress } = useScrollProgress()
const { prefersReducedMotion } = useReducedMotion()
</script>

<template>
  <div
    v-if="!prefersReducedMotion"
    class="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none"
    role="progressbar"
    :aria-valuenow="Math.round(progress * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Page scroll progress"
  >
    <div
      class="h-full bg-gradient-to-r from-valencia-purple via-ocean-blue to-electric-cyan transition-transform duration-150 ease-out origin-left"
      :style="{ transform: `scaleX(${progress})` }"
    />
  </div>
</template>
