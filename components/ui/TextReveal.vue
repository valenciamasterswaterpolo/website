<script setup lang="ts">
import { computed } from 'vue'
import { useTextReveal } from '~/composables/useTextReveal'

const props = withDefaults(
  defineProps<{
    text: string
    tag?: string
    mode?: 'chars' | 'words' | 'lines'
    staggerDelay?: number
    duration?: number
    class?: string
  }>(),
  {
    tag: 'span',
    mode: 'words',
    staggerDelay: 50,
    duration: 600
  }
)

const { elementRef, isRevealed, segments, getSegmentStyle, separator } =
  useTextReveal(() => props.text, {
    mode: props.mode,
    staggerDelay: props.staggerDelay,
    duration: props.duration
  })
</script>

<template>
  <component :is="tag" ref="elementRef" :class="props.class">
    <span
      v-for="(segment, index) in segments"
      :key="index"
      class="inline-block overflow-hidden"
    >
      <span
        class="inline-block text-reveal-segment"
        :class="{ revealed: isRevealed }"
        :style="getSegmentStyle(index)"
        >{{ segment }}{{ index < segments.length - 1 ? separator : ''
        }}</span
      >
    </span>
  </component>
</template>

<style scoped>
.text-reveal-segment {
  transform: translateY(110%);
  opacity: 0;
  transition-property: transform, opacity;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

.text-reveal-segment.revealed {
  transform: translateY(0);
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .text-reveal-segment {
    transform: none;
    opacity: 1;
  }
}
</style>
