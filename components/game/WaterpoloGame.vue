<script setup lang="ts">
import { useGameEngine } from '~/composables/game/useGameEngine'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

const {
  gameState,
  config,
  startGame,
  initGame,
  cleanupGame,
  touchState,
  triggerPass,
  triggerShoot,
  triggerSwitch,
} = useGameEngine(canvasRef)

const isFullscreen = ref(false)
const scale = ref(1)

// Calculate responsive scale
const updateScale = () => {
  if (!containerRef.value) return

  const containerWidth = containerRef.value.clientWidth
  const maxWidth = config.canvasWidth

  if (containerWidth < maxWidth) {
    scale.value = containerWidth / maxWidth
  } else {
    scale.value = 1
  }
}

const toggleFullscreen = async () => {
  if (!containerRef.value) return

  try {
    if (!document.fullscreenElement) {
      await containerRef.value.requestFullscreen()
      isFullscreen.value = true
    } else {
      await document.exitFullscreen()
      isFullscreen.value = false
    }
  } catch (err) {
    console.warn('Fullscreen not supported:', err)
  }
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
  nextTick(updateScale)
}

onMounted(() => {
  initGame()
  updateScale()
  window.addEventListener('resize', updateScale)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  cleanupGame()
  window.removeEventListener('resize', updateScale)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<template>
  <div
    ref="containerRef"
    class="game-container"
    :class="{ 'is-fullscreen': isFullscreen, 'is-mobile': touchState.isMobile }"
  >
    <!-- Game Canvas Wrapper for scaling -->
    <div
      class="canvas-wrapper"
      :style="{
        width: `${config.canvasWidth}px`,
        height: `${config.canvasHeight}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }"
    >
      <!-- Game Canvas -->
      <canvas
        ref="canvasRef"
        :width="config.canvasWidth"
        :height="config.canvasHeight"
        class="game-canvas"
      />

      <!-- Start Screen Overlay -->
      <div
        v-if="gameState.phase === 'menu'"
        class="game-overlay"
      >
        <div class="menu-content">
          <h2 class="menu-title">WATERPOLO</h2>
          <p class="menu-subtitle">RETRO EDITION</p>

          <button
            class="play-button"
            @click="startGame"
          >
            PLAY GAME
          </button>

          <!-- Desktop Controls -->
          <div v-if="!touchState.isMobile" class="controls-info">
            <h3>CONTROLS</h3>
            <div class="control-row">
              <span class="key">ARROWS</span>
              <span class="action">Move</span>
            </div>
            <div class="control-row">
              <span class="key">Q</span>
              <span class="action">Pass Ball</span>
            </div>
            <div class="control-row">
              <span class="key">W</span>
              <span class="action">Shoot</span>
            </div>
            <div class="control-row">
              <span class="key">E</span>
              <span class="action">Switch Player</span>
            </div>
            <div class="control-row">
              <span class="key">ESC</span>
              <span class="action">Pause</span>
            </div>
          </div>

          <!-- Mobile Controls Info -->
          <div v-else class="controls-info mobile-info">
            <h3>TOUCH CONTROLS</h3>
            <p class="touch-hint">Drag left side to move</p>
            <p class="touch-hint">Tap buttons to pass/shoot</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Touch Controls (Mobile Only) -->
    <div
      v-if="touchState.isMobile && gameState.phase === 'playing'"
      class="touch-controls"
    >
      <!-- Virtual Joystick Indicator -->
      <div
        v-if="touchState.joystickActive"
        class="joystick-indicator"
        :style="{
          left: `${touchState.joystickCenter.x}px`,
          top: `${touchState.joystickCenter.y}px`,
        }"
      >
        <div
          class="joystick-knob"
          :style="{
            transform: `translate(${touchState.joystickCurrent.x - touchState.joystickCenter.x}px, ${touchState.joystickCurrent.y - touchState.joystickCenter.y}px)`,
          }"
        />
      </div>

      <!-- Action Buttons -->
      <div class="touch-buttons">
        <button
          class="touch-btn switch-btn"
          @touchstart.prevent="triggerSwitch"
        >
          E
        </button>
        <button
          class="touch-btn pass-btn"
          @touchstart.prevent="triggerPass"
        >
          Q
        </button>
        <button
          class="touch-btn shoot-btn"
          @touchstart.prevent="triggerShoot"
        >
          W
        </button>
      </div>
    </div>

    <!-- Fullscreen Button -->
    <button
      class="fullscreen-btn"
      :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'"
      @click="toggleFullscreen"
    >
      <svg
        v-if="!isFullscreen"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.game-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #0E2433;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 800px;
}

.game-container.is-fullscreen {
  border-radius: 0;
  max-width: none;
  height: 100vh;
  justify-content: center;
}

.game-container.is-mobile {
  touch-action: none;
  user-select: none;
}

.canvas-wrapper {
  position: relative;
  flex-shrink: 0;
}

.game-canvas {
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.game-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(14, 36, 51, 0.95);
}

.menu-content {
  text-align: center;
  font-family: 'Press Start 2P', monospace;
  padding: 1rem;
}

.menu-title {
  font-size: 2rem;
  color: #70BECF;
  margin-bottom: 0.5rem;
  text-shadow: 4px 4px 0 #196CA0;
}

.menu-subtitle {
  font-size: 0.75rem;
  color: #FE6E81;
  margin-bottom: 1.5rem;
}

.play-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.875rem;
  color: #0E2433;
  background: linear-gradient(180deg, #70BECF 0%, #196CA0 100%);
  border: 4px solid #FCFBD9;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 0 4px 0 #104060;
}

.play-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #104060;
}

.play-button:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #104060;
}

.controls-info {
  margin-top: 1.5rem;
  padding: 0.75rem;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.controls-info h3 {
  font-size: 0.625rem;
  color: #FCFBD9;
  margin-bottom: 0.75rem;
}

.control-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0;
  font-size: 0.5rem;
}

.key {
  display: inline-block;
  padding: 0.2rem 0.4rem;
  background-color: #73326D;
  color: #FCFBD9;
  border-radius: 2px;
  min-width: 50px;
}

.action {
  color: #9ED2D5;
}

.mobile-info {
  max-width: 200px;
}

.touch-hint {
  font-size: 0.5rem;
  color: #9ED2D5;
  margin: 0.25rem 0;
}

/* Touch Controls */
.touch-controls {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
}

.joystick-indicator {
  position: fixed;
  width: 100px;
  height: 100px;
  margin-left: -50px;
  margin-top: -50px;
  border: 3px solid rgba(112, 190, 207, 0.5);
  border-radius: 50%;
  background-color: rgba(112, 190, 207, 0.1);
  pointer-events: none;
}

.joystick-knob {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  margin-left: -20px;
  margin-top: -20px;
  background-color: rgba(112, 190, 207, 0.7);
  border-radius: 50%;
  border: 2px solid #70BECF;
}

.touch-buttons {
  position: fixed;
  right: 20px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: auto;
}

.touch-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #FCFBD9;
  font-family: 'Press Start 2P', monospace;
  font-size: 1rem;
  color: #FCFBD9;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.touch-btn:active {
  transform: scale(0.95);
}

.pass-btn {
  background: linear-gradient(180deg, #70BECF 0%, #196CA0 100%);
}

.shoot-btn {
  background: linear-gradient(180deg, #FE6E81 0%, #C04050 100%);
}

.switch-btn {
  background: linear-gradient(180deg, #73326D 0%, #4A2048 100%);
  width: 50px;
  height: 50px;
  font-size: 0.75rem;
}

.fullscreen-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border: 2px solid #70BECF;
  border-radius: 4px;
  color: #70BECF;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  z-index: 10;
}

.fullscreen-btn:hover {
  background-color: #70BECF;
  color: #0E2433;
}

/* Responsive adjustments */
@media (max-width: 840px) {
  .menu-title {
    font-size: 1.25rem;
  }

  .menu-subtitle {
    font-size: 0.5rem;
  }

  .play-button {
    font-size: 0.625rem;
    padding: 0.5rem 1rem;
  }

  .controls-info h3 {
    font-size: 0.5rem;
  }

  .control-row {
    font-size: 0.4rem;
  }

  .key {
    min-width: 40px;
    font-size: 0.4rem;
  }
}

@media (max-width: 480px) {
  .touch-buttons {
    right: 10px;
    bottom: 60px;
    gap: 8px;
  }

  .touch-btn {
    width: 50px;
    height: 50px;
    font-size: 0.75rem;
  }

  .switch-btn {
    width: 40px;
    height: 40px;
    font-size: 0.625rem;
  }
}
</style>
