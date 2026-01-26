<script setup lang="ts">
import { ref } from 'vue'

const showModal = ref(false)

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

provide('modalControls', { openModal, closeModal, showModal })
</script>

<template>
  <div class="min-h-screen">
    <NavBar @open-modal="openModal" />
    <main>
      <slot />
    </main>
    <FooterSection />
    <PreRegistrationModal :show="showModal" @close="closeModal" />
  </div>
</template>
