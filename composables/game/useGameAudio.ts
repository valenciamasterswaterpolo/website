import type { GameAudio } from '~/types/game'

export function useGameAudio() {
  const audio = reactive<GameAudio>({
    whistle: null,
    splash: null,
    goal: null,
  })

  const isLoaded = ref(false)
  const isMuted = ref(false)

  const loadAudio = () => {
    if (typeof window === 'undefined') return

    try {
      audio.whistle = new Audio('/sounds/whistle.mp3')
      audio.whistle.volume = 0.5

      audio.splash = new Audio('/sounds/splash.mp3')
      audio.splash.volume = 0.3

      audio.goal = new Audio('/sounds/goal.mp3')
      audio.goal.volume = 0.6

      isLoaded.value = true
    } catch (e) {
      console.warn('Could not load game audio:', e)
    }
  }

  const playSound = (sound: keyof GameAudio) => {
    if (isMuted.value || !audio[sound]) return

    try {
      const audioElement = audio[sound]!
      audioElement.currentTime = 0
      audioElement.play().catch(() => {
        // Ignore autoplay errors
      })
    } catch (e) {
      // Ignore playback errors
    }
  }

  const playWhistle = () => playSound('whistle')
  const playSplash = () => playSound('splash')
  const playGoal = () => playSound('goal')

  const toggleMute = () => {
    isMuted.value = !isMuted.value
  }

  const cleanup = () => {
    if (audio.whistle) audio.whistle.pause()
    if (audio.splash) audio.splash.pause()
    if (audio.goal) audio.goal.pause()
  }

  return {
    isLoaded,
    isMuted,
    loadAudio,
    playWhistle,
    playSplash,
    playGoal,
    toggleMute,
    cleanup,
  }
}
