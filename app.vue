<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { initLanguage } = useI18n()

onMounted(() => {
  initLanguage()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
