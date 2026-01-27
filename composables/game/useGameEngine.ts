import type { Ref } from 'vue'
import type { GameState, Player, Ball, Goal, TeamType, PlayerRole, Vector2D } from '~/types/game'
import { useGameConfig } from './useGameConfig'
import { useGameInput } from './useGameInput'
import { useGamePhysics } from './useGamePhysics'
import { useGameAI } from './useGameAI'
import { useGameRenderer } from './useGameRenderer'
import { useGameAudio } from './useGameAudio'

export function useGameEngine(canvasRef: Ref<HTMLCanvasElement | null>) {
  const { config, getPoolCenter, getGoalPositions, getPlayerStartPositions } = useGameConfig()
  const {
    inputState,
    pressedThisFrame,
    touchState,
    resetPressedThisFrame,
    setupInputListeners,
    cleanupInputListeners,
    triggerPass,
    triggerShoot,
    triggerSwitch,
  } = useGameInput()
  const physics = useGamePhysics(config)
  const ai = useGameAI(config)
  const renderer = useGameRenderer(canvasRef, config)
  const audio = useGameAudio()

  let animationFrameId: number | null = null
  let lastTime = 0

  const createPlayer = (
    id: string,
    team: TeamType,
    role: PlayerRole,
    position: Vector2D,
    isControlled: boolean = false
  ): Player => ({
    id,
    position: { ...position },
    velocity: { x: 0, y: 0 },
    team,
    role,
    isControlled,
    hasBall: false,
    stamina: 100,
    maxSpeed: config.playerMaxSpeed,
    direction: team === 'white' ? 'right' : 'left',
    aiState: 'idle',
    targetPosition: null,
    homePosition: { ...position },
    animationState: 'idle',
    frameIndex: 0,
    frameTimer: 0,
  })

  const createBall = (): Ball => {
    const center = getPoolCenter()
    return {
      position: { ...center },
      velocity: { x: 0, y: 0 },
      holder: null,
      isInFlight: false,
      targetPosition: null,
      frameIndex: 0,
      frameTimer: 0,
    }
  }

  const createGoals = (): Goal[] => {
    const positions = getGoalPositions()
    return [
      {
        team: 'white',
        position: positions.left,
        width: config.goalWidth,
        height: config.goalHeight,
        bounds: {
          x: positions.left.x - 10,
          y: positions.left.y,
          width: config.goalWidth + 10,
          height: config.goalHeight,
        },
      },
      {
        team: 'blue',
        position: positions.right,
        width: config.goalWidth,
        height: config.goalHeight,
        bounds: {
          x: positions.right.x,
          y: positions.right.y,
          width: config.goalWidth + 10,
          height: config.goalHeight,
        },
      },
    ]
  }

  const createPlayers = (): Player[] => {
    const positions = getPlayerStartPositions()
    return [
      // White team
      createPlayer('white-gk', 'white', 'goalkeeper', positions.white.goalkeeper),
      createPlayer('white-att', 'white', 'attacker', positions.white.attacker, true), // Player controlled
      createPlayer('white-def', 'white', 'defender', positions.white.defender),
      // Blue team
      createPlayer('blue-gk', 'blue', 'goalkeeper', positions.blue.goalkeeper),
      createPlayer('blue-att', 'blue', 'attacker', positions.blue.attacker),
      createPlayer('blue-def', 'blue', 'defender', positions.blue.defender),
    ]
  }

  const gameState = reactive<GameState>({
    phase: 'menu',
    score: { white: 0, blue: 0 },
    time: config.gameDuration,
    players: createPlayers(),
    ball: createBall(),
    goals: createGoals(),
    controlledPlayerId: 'white-att',
    lastGoalTeam: null,
    countdownValue: 3,
  })

  const getControlledPlayer = (): Player | undefined => {
    return gameState.players.find((p) => p.id === gameState.controlledPlayerId)
  }

  const switchToNextTeammate = () => {
    // Only switch between field players (not goalkeeper)
    const whitePlayers = gameState.players.filter((p) => p.team === 'white' && p.role !== 'goalkeeper')
    const currentIndex = whitePlayers.findIndex((p) => p.id === gameState.controlledPlayerId)
    const nextIndex = (currentIndex + 1) % whitePlayers.length

    // Update controlled state
    for (const player of gameState.players) {
      player.isControlled = false
    }

    const nextPlayer = whitePlayers[nextIndex]
    if (nextPlayer) {
      nextPlayer.isControlled = true
      gameState.controlledPlayerId = nextPlayer.id
    }
  }

  const switchToPlayerWithBall = () => {
    // Find the white team player with the ball (excluding goalkeeper)
    const playerWithBall = gameState.players.find(
      (p) => p.team === 'white' && p.hasBall && p.role !== 'goalkeeper'
    )

    if (playerWithBall && playerWithBall.id !== gameState.controlledPlayerId) {
      // Update controlled state
      for (const player of gameState.players) {
        player.isControlled = false
      }
      playerWithBall.isControlled = true
      gameState.controlledPlayerId = playerWithBall.id
    }
  }

  const resetPositions = () => {
    const positions = getPlayerStartPositions()
    const center = getPoolCenter()

    // Reset players
    for (const player of gameState.players) {
      player.velocity = { x: 0, y: 0 }
      player.hasBall = false
      player.animationState = 'idle'
      player.isControlled = false

      const teamPositions = positions[player.team]
      player.position = { ...teamPositions[player.role] }
      player.homePosition = { ...teamPositions[player.role] }
      player.direction = player.team === 'white' ? 'right' : 'left'
    }

    // Set attacker as controlled player (never goalkeeper)
    const attacker = gameState.players.find((p) => p.id === 'white-att')
    if (attacker) {
      attacker.isControlled = true
      gameState.controlledPlayerId = 'white-att'
    }

    // Reset ball
    gameState.ball.position = { ...center }
    gameState.ball.velocity = { x: 0, y: 0 }
    gameState.ball.holder = null
    gameState.ball.isInFlight = false
    gameState.ball.targetPosition = null
  }

  const processPlayerInput = (deltaTime: number) => {
    const player = getControlledPlayer()
    if (!player) return

    let moveX = 0
    let moveY = 0

    // Check movement input
    if (inputState.up) moveY -= 1
    if (inputState.down) moveY += 1
    if (inputState.left) moveX -= 1
    if (inputState.right) moveX += 1

    if (moveX !== 0 || moveY !== 0) {
      const length = Math.sqrt(moveX * moveX + moveY * moveY)
      moveX /= length
      moveY /= length

      const staminaMultiplier = 0.5 + (player.stamina / 100) * 0.5
      player.velocity.x += moveX * config.playerAcceleration * staminaMultiplier * deltaTime
      player.velocity.y += moveY * config.playerAcceleration * staminaMultiplier * deltaTime

      // Update direction
      if (Math.abs(moveX) > Math.abs(moveY)) {
        player.direction = moveX > 0 ? 'right' : 'left'
      } else {
        player.direction = moveY > 0 ? 'down' : 'up'
      }

      player.animationState = 'swim'
    } else {
      player.animationState = 'idle'
    }

    // Pass action - pass to teammate in facing direction (or nearest if none in direction)
    if (pressedThisFrame.pass && player.hasBall) {
      let teammate = ai.findTeammateInDirection(player, gameState)
      // Fallback: find any open teammate if no one in facing direction
      if (!teammate) {
        teammate = ai.findOpenTeammate(player, gameState)
      }
      // Last resort: find nearest teammate (excluding goalkeeper)
      if (!teammate) {
        const teammates = gameState.players.filter(
          (p) => p.team === player.team && p.id !== player.id && p.role !== 'goalkeeper'
        )
        if (teammates.length > 0) {
          let nearestDist = Infinity
          for (const t of teammates) {
            const dist = ai.distance(player.position, t.position)
            if (dist < nearestDist) {
              nearestDist = dist
              teammate = t
            }
          }
        }
      }
      if (teammate) {
        physics.passBall(gameState, player, teammate)
        audio.playSplash()
      }
    }

    // Shoot action
    if (pressedThisFrame.shoot && player.hasBall) {
      const enemyGoal = ai.getEnemyGoal(player, gameState)
      physics.shootBall(gameState, player, enemyGoal)
      audio.playSplash()
    }
  }

  const updateAnimations = (deltaTime: number) => {
    for (const player of gameState.players) {
      player.frameTimer += deltaTime
      if (player.frameTimer > 0.15) {
        player.frameTimer = 0
        player.frameIndex = (player.frameIndex + 1) % 4
      }
    }

    gameState.ball.frameTimer += deltaTime
    if (gameState.ball.frameTimer > 0.1) {
      gameState.ball.frameTimer = 0
      gameState.ball.frameIndex = (gameState.ball.frameIndex + 1) % 4
    }
  }

  const processAIActions = () => {
    for (const player of gameState.players) {
      if (player.isControlled) continue

      const passTarget = ai.shouldAIPass(player, gameState)
      if (passTarget) {
        physics.passBall(gameState, player, passTarget)
        audio.playSplash()
        continue
      }

      const shootTarget = ai.shouldAIShoot(player, gameState)
      if (shootTarget) {
        physics.shootBall(gameState, player, shootTarget)
        audio.playSplash()
      }
    }
  }

  const handleGoalScored = (scoringTeam: TeamType) => {
    try {
    gameState.score[scoringTeam]++
    gameState.lastGoalTeam = scoringTeam
    gameState.phase = 'goal_scored'
    audio.playGoal()

    setTimeout(() => {
        try {
      resetPositions()
      gameState.phase = 'countdown'
      gameState.countdownValue = 3

      const countdownInterval = setInterval(() => {
            try {
        gameState.countdownValue--
        if (gameState.countdownValue <= 0) {
          clearInterval(countdownInterval)
          gameState.phase = 'playing'
          audio.playWhistle()
        }
            } catch (error) {
              console.error('[GAME] Countdown interval error:', error)
              clearInterval(countdownInterval)
              gameState.phase = 'playing'
            }
      }, 1000)
        } catch (error) {
          console.error('[GAME] Goal reset timeout error:', error)
          gameState.phase = 'playing'
        }
    }, 2000)
    } catch (error) {
      console.error('[GAME] Goal scored handler error:', error)
    }
  }

  // Track if user manually switched recently (to prevent auto-switch from overriding)
  let manualSwitchCooldown = 0

  const gameLoop = (currentTime: number) => {
    // Always update lastTime to prevent huge deltaTime after errors
    const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1)
    lastTime = currentTime

    try {

      if (gameState.phase === 'playing') {
        // Process input
        processPlayerInput(deltaTime)

        // Update AI
        ai.updateAI(gameState, deltaTime)

        // Process AI actions
        processAIActions()

        // Apply physics
        physics.applyWaterPhysics(gameState, deltaTime)

        // Check collisions
        const { goalScored, scoringTeam } = physics.checkCollisions(gameState)
        if (goalScored && scoringTeam) {
          handleGoalScored(scoringTeam)
        }

        // Auto-switch to player with ball on white team (only if not manually switched recently)
        if (manualSwitchCooldown <= 0) {
          switchToPlayerWithBall()
        } else {
          manualSwitchCooldown -= deltaTime
        }

        // Update timer
        gameState.time -= deltaTime
        if (gameState.time <= 0) {
          gameState.time = 0
          gameState.phase = 'game_over'
          audio.playWhistle()
        }

        // Update animations
        updateAnimations(deltaTime)
      }

      // Handle pause toggle
      if (pressedThisFrame.pause) {
        if (gameState.phase === 'playing') {
          gameState.phase = 'paused'
        } else if (gameState.phase === 'paused') {
          gameState.phase = 'playing'
        }
      }

      // Handle player switch - set cooldown to prevent auto-switch from immediately overriding
      if (pressedThisFrame.switchPlayer && gameState.phase === 'playing') {
        switchToNextTeammate()
        manualSwitchCooldown = 2.0 // 2 second cooldown before auto-switch can happen again
      }

      // Handle restart from game over
      if (gameState.phase === 'game_over' && pressedThisFrame.pass) {
        resetGame()
        startGame()
      }

      // Reset pressed this frame flags
      resetPressedThisFrame()

      // Render (with error protection)
      try {
      renderer.render(gameState)
      } catch (renderError) {
        console.error('[GAME RENDER ERROR]', renderError)
      }

      animationFrameId = requestAnimationFrame(gameLoop)
    } catch (error) {
      console.error('[GAME LOOP ERROR]', error)
      // Continue running even after errors
      animationFrameId = requestAnimationFrame(gameLoop)
    }
  }

  const startGame = () => {
    try {
    if (gameState.phase !== 'menu' && gameState.phase !== 'game_over') return

    audio.loadAudio()
    resetPositions()
    gameState.score = { white: 0, blue: 0 }
    gameState.time = config.gameDuration
    gameState.phase = 'countdown'
    gameState.countdownValue = 3

    const countdownInterval = setInterval(() => {
        try {
      gameState.countdownValue--
      if (gameState.countdownValue <= 0) {
        clearInterval(countdownInterval)
        gameState.phase = 'playing'
        audio.playWhistle()
      }
        } catch (error) {
          console.error('[GAME] Start countdown error:', error)
          clearInterval(countdownInterval)
          gameState.phase = 'playing'
        }
    }, 1000)

    if (!animationFrameId) {
      lastTime = performance.now()
      animationFrameId = requestAnimationFrame(gameLoop)
    }
    } catch (error) {
      console.error('[GAME] Start game error:', error)
    }
  }

  const pauseGame = () => {
    if (gameState.phase === 'playing') {
      gameState.phase = 'paused'
    }
  }

  const resumeGame = () => {
    if (gameState.phase === 'paused') {
      gameState.phase = 'playing'
    }
  }

  const resetGame = () => {
    gameState.phase = 'menu'
    gameState.score = { white: 0, blue: 0 }
    gameState.time = config.gameDuration
    gameState.lastGoalTeam = null
    resetPositions()
  }

  const initGame = () => {
    setupInputListeners()
    lastTime = performance.now()
    animationFrameId = requestAnimationFrame(gameLoop)
  }

  const cleanupGame = () => {
    cleanupInputListeners()
    audio.cleanup()
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  return {
    gameState,
    config,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    initGame,
    cleanupGame,
    // Touch controls
    touchState,
    triggerPass,
    triggerShoot,
    triggerSwitch,
  }
}
