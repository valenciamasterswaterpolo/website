import { reactive } from 'vue'
import type { InputState } from '~/types/game'

export interface TouchState {
  isMobile: boolean
  joystickActive: boolean
  joystickCenter: { x: number; y: number }
  joystickCurrent: { x: number; y: number }
}

// Module-level shared state to ensure single instance
const sharedInputState: InputState = {
  up: false,
  down: false,
  left: false,
  right: false,
  pass: false,
  shoot: false,
  pause: false,
  switchPlayer: false,
}

const sharedPressedThisFrame = {
  pass: false,
  shoot: false,
  pause: false,
  switchPlayer: false,
}

const sharedTouchState: TouchState = {
  isMobile: false,
  joystickActive: false,
  joystickCenter: { x: 0, y: 0 },
  joystickCurrent: { x: 0, y: 0 },
}

let listenersSetup = false

// Module-level handler functions (defined once)
function handleKeyDown(e: KeyboardEvent) {
  const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyQ', 'KeyW', 'KeyE', 'KeyP', 'Escape']
  if (gameKeys.includes(e.code)) {
    e.preventDefault()
  }

  switch (e.code) {
    case 'ArrowUp':
      sharedInputState.up = true
      break
    case 'ArrowDown':
      sharedInputState.down = true
      break
    case 'ArrowLeft':
      sharedInputState.left = true
      break
    case 'ArrowRight':
      sharedInputState.right = true
      break
    case 'KeyQ':
      sharedInputState.pass = true
      sharedPressedThisFrame.pass = true
      break
    case 'KeyW':
      sharedInputState.shoot = true
      sharedPressedThisFrame.shoot = true
      break
    case 'KeyE':
      sharedInputState.switchPlayer = true
      sharedPressedThisFrame.switchPlayer = true
      break
    case 'Space':
    case 'Escape':
    case 'KeyP':
      sharedInputState.pause = true
      sharedPressedThisFrame.pause = true
      break
  }
}

function handleKeyUp(e: KeyboardEvent) {
  switch (e.code) {
    case 'ArrowUp':
      sharedInputState.up = false
      break
    case 'ArrowDown':
      sharedInputState.down = false
      break
    case 'ArrowLeft':
      sharedInputState.left = false
      break
    case 'ArrowRight':
      sharedInputState.right = false
      break
    case 'KeyQ':
      sharedInputState.pass = false
      break
    case 'KeyW':
      sharedInputState.shoot = false
      break
    case 'KeyE':
      sharedInputState.switchPlayer = false
      break
    case 'Space':
    case 'Escape':
    case 'KeyP':
      sharedInputState.pause = false
      break
  }
}

function handleTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  if (!touch) return

  if (touch.clientX < window.innerWidth / 2) {
    sharedTouchState.joystickActive = true
    sharedTouchState.joystickCenter = { x: touch.clientX, y: touch.clientY }
    sharedTouchState.joystickCurrent = { x: touch.clientX, y: touch.clientY }
  }
}

function handleTouchMove(e: TouchEvent) {
  if (!sharedTouchState.joystickActive) return

  for (let i = 0; i < e.touches.length; i++) {
    const touch = e.touches[i]
    if (!touch) continue

    if (touch.clientX < window.innerWidth * 0.6) {
      sharedTouchState.joystickCurrent = { x: touch.clientX, y: touch.clientY }

      const dx = sharedTouchState.joystickCurrent.x - sharedTouchState.joystickCenter.x
      const dy = sharedTouchState.joystickCurrent.y - sharedTouchState.joystickCenter.y
      const deadzone = 15

      sharedInputState.left = dx < -deadzone
      sharedInputState.right = dx > deadzone
      sharedInputState.up = dy < -deadzone
      sharedInputState.down = dy > deadzone
    }
  }
}

function handleTouchEnd(e: TouchEvent) {
  let joystickTouchActive = false
  for (let i = 0; i < e.touches.length; i++) {
    const touch = e.touches[i]
    if (touch && touch.clientX < window.innerWidth * 0.6) {
      joystickTouchActive = true
    }
  }

  if (!joystickTouchActive) {
    sharedTouchState.joystickActive = false
    sharedInputState.up = false
    sharedInputState.down = false
    sharedInputState.left = false
    sharedInputState.right = false
  }
}

function detectMobile() {
  if (typeof window !== 'undefined') {
    sharedTouchState.isMobile = 'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 768
  }
}

export function useGameInput() {
  // Return reactive wrappers that reference the shared state
  const inputState = reactive(sharedInputState)
  const pressedThisFrame = sharedPressedThisFrame
  const touchState = reactive(sharedTouchState)

  const triggerPass = () => {
    sharedInputState.pass = true
    sharedPressedThisFrame.pass = true
    setTimeout(() => { sharedInputState.pass = false }, 100)
  }

  const triggerShoot = () => {
    sharedInputState.shoot = true
    sharedPressedThisFrame.shoot = true
    setTimeout(() => { sharedInputState.shoot = false }, 100)
  }

  const triggerSwitch = () => {
    sharedInputState.switchPlayer = true
    sharedPressedThisFrame.switchPlayer = true
    setTimeout(() => { sharedInputState.switchPlayer = false }, 100)
  }

  const resetPressedThisFrame = () => {
    sharedPressedThisFrame.pass = false
    sharedPressedThisFrame.shoot = false
    sharedPressedThisFrame.pause = false
    sharedPressedThisFrame.switchPlayer = false
  }

  const setupInputListeners = () => {
    // Always remove first to prevent duplicates
    window.removeEventListener('keydown', handleKeyDown, true)
    window.removeEventListener('keyup', handleKeyUp, true)
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)
    window.removeEventListener('resize', detectMobile)

    detectMobile()

    // Add listeners
    window.addEventListener('keydown', handleKeyDown, true)
    window.addEventListener('keyup', handleKeyUp, true)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('resize', detectMobile)

    listenersSetup = true
  }

  const cleanupInputListeners = () => {
    window.removeEventListener('keydown', handleKeyDown, true)
    window.removeEventListener('keyup', handleKeyUp, true)
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)
    window.removeEventListener('resize', detectMobile)
    listenersSetup = false
  }

  return {
    inputState,
    pressedThisFrame,
    touchState,
    resetPressedThisFrame,
    setupInputListeners,
    cleanupInputListeners,
    triggerPass,
    triggerShoot,
    triggerSwitch,
  }
}
