<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: string
    height?: string
    rounded?: string
  }>(),
  {
    width: '100%',
    height: '1rem',
    rounded: 'rounded-lg'
  }
)
</script>

<template>
  <div
    class="skeleton-loader"
    :class="rounded"
    :style="{ width, height }"
    role="status"
    aria-label="Loading..."
  />
</template>

<style scoped>
.skeleton-loader {
  @apply bg-soft-slate/20 dark:bg-soft-slate/10;
  background: linear-gradient(
    90deg,
    rgba(131, 178, 187, 0.1) 25%,
    rgba(131, 178, 187, 0.2) 50%,
    rgba(131, 178, 187, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-loader {
    animation: none;
    @apply bg-soft-slate/20;
  }
}
</style>
