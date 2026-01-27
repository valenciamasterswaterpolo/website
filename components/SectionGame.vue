<script setup lang="ts">
const { elementRef: sectionRef, isVisible: sectionVisible } = useScrollReveal({ threshold: 0.1 })
const { t } = useI18n()
</script>

<template>
  <section
    id="game"
    ref="sectionRef"
    class="relative py-20 md:py-28 overflow-hidden bg-dark-bg"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, #70BECF 1px, transparent 0); background-size: 40px 40px;" />
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <!-- Section Title -->
      <div
        class="text-center mb-12 scroll-reveal"
        :class="{ 'is-visible': sectionVisible }"
      >
        <span class="inline-block px-4 py-2 bg-electric-cyan/20 rounded-full text-electric-cyan text-sm font-medium mb-4">
          {{ t.game?.badge || 'ARCADE' }}
        </span>
        <h2 class="text-4xl md:text-5xl font-display text-cream mb-4">
          {{ t.game?.title || 'Play Waterpolo' }}
        </h2>
        <p class="text-lg text-soft-slate max-w-2xl mx-auto">
          {{ t.game?.description || 'Experience the excitement of waterpolo with our retro-style arcade game. Control your player, pass to teammates, and score goals!' }}
        </p>
      </div>

      <!-- Game Container -->
      <div
        class="flex justify-center scroll-reveal stagger-2"
        :class="{ 'is-visible': sectionVisible }"
      >
        <ClientOnly>
          <GameWaterpoloGame />
          <template #fallback>
            <div class="w-[800px] max-w-full aspect-[5/3] bg-dark-surface rounded-lg flex items-center justify-center">
              <div class="text-center">
                <div class="animate-spin w-8 h-8 border-4 border-electric-cyan border-t-transparent rounded-full mx-auto mb-4" />
                <p class="text-soft-slate font-mono text-sm">Loading game...</p>
              </div>
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Mobile Instructions -->
      <div
        class="mt-8 text-center scroll-reveal stagger-3 md:hidden"
        :class="{ 'is-visible': sectionVisible }"
      >
        <p class="text-soft-slate text-sm">
          {{ t.game?.mobileNote || 'For the best experience, play on a device with a keyboard.' }}
        </p>
      </div>

      <!-- Desktop Controls Reminder -->
      <div
        class="mt-8 hidden md:flex justify-center gap-8 scroll-reveal stagger-3"
        :class="{ 'is-visible': sectionVisible }"
      >
        <div class="flex items-center gap-2 text-soft-slate text-sm">
          <div class="flex gap-1">
            <kbd class="px-2 py-1 bg-dark-surface border border-ocean-blue rounded text-xs text-cream">
              &larr;
            </kbd>
            <kbd class="px-2 py-1 bg-dark-surface border border-ocean-blue rounded text-xs text-cream">
              &uarr;
            </kbd>
            <kbd class="px-2 py-1 bg-dark-surface border border-ocean-blue rounded text-xs text-cream">
              &darr;
            </kbd>
            <kbd class="px-2 py-1 bg-dark-surface border border-ocean-blue rounded text-xs text-cream">
              &rarr;
            </kbd>
          </div>
          <span>{{ t.game?.move || 'Move' }}</span>
        </div>
        <div class="flex items-center gap-2 text-soft-slate text-sm">
          <kbd class="px-3 py-1 bg-dark-surface border border-ocean-blue rounded text-xs text-cream">
            Q
          </kbd>
          <span>{{ t.game?.pass || 'Pass' }}</span>
        </div>
        <div class="flex items-center gap-2 text-soft-slate text-sm">
          <kbd class="px-3 py-1 bg-dark-surface border border-ocean-blue rounded text-xs text-cream">
            W
          </kbd>
          <span>{{ t.game?.shoot || 'Shoot' }}</span>
        </div>
        <div class="flex items-center gap-2 text-soft-slate text-sm">
          <kbd class="px-3 py-1 bg-dark-surface border border-ocean-blue rounded text-xs text-cream">
            E
          </kbd>
          <span>{{ t.game?.switchPlayer || 'Switch' }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
kbd {
  font-family: 'Press Start 2P', monospace;
}
</style>
