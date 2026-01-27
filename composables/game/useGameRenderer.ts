import type { Ref } from 'vue'
import type { GameState, GameConfig, Player, Ball, Goal, Vector2D } from '~/types/game'

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
}

export function useGameRenderer(canvasRef: Ref<HTMLCanvasElement | null>, config: GameConfig) {
  const ctx = computed(() => canvasRef.value?.getContext('2d'))

  // Animation time for waves
  let waveTime = 0

  // Logo image for pool floor
  let logoImage: HTMLImageElement | null = null
  let logoLoaded = false

  // Load the logo image
  if (typeof window !== 'undefined') {
    logoImage = new Image()
    logoImage.onload = () => {
      logoLoaded = true
    }
    logoImage.src = '/images/logo.png'
  }

  // Ripple effects from player movement
  const ripples: Ripple[] = []
  const maxRipples = 30

  const addRipple = (x: number, y: number, intensity: number = 1) => {
    if (ripples.length >= maxRipples) {
      ripples.shift()
    }
    ripples.push({
      x,
      y,
      radius: 5,
      maxRadius: 20 + intensity * 15,
      alpha: 0.4 * intensity,
    })
  }

  const updateRipples = () => {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i]
      if (!ripple) continue

      ripple.radius += 1.5
      ripple.alpha -= 0.02

      if (ripple.alpha <= 0 || ripple.radius >= ripple.maxRadius) {
        ripples.splice(i, 1)
      }
    }
  }

  const drawRipples = () => {
    if (!ctx.value) return

    for (const ripple of ripples) {
      ctx.value.strokeStyle = `rgba(255, 255, 255, ${ripple.alpha})`
      ctx.value.lineWidth = 2
      ctx.value.beginPath()
      ctx.value.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
      ctx.value.stroke()
    }
  }

  const drawPool = (time: number) => {
    if (!ctx.value) return
    const { poolBounds, colors } = config

    // Background water with gradient
    const gradient = ctx.value.createLinearGradient(
      poolBounds.x,
      poolBounds.y,
      poolBounds.x,
      poolBounds.y + poolBounds.height
    )
    gradient.addColorStop(0, colors.water)
    gradient.addColorStop(0.5, colors.waterLight)
    gradient.addColorStop(1, colors.water)
    ctx.value.fillStyle = gradient
    ctx.value.fillRect(poolBounds.x, poolBounds.y, poolBounds.width, poolBounds.height)

    // Animated wave pattern (subtle horizontal waves)
    ctx.value.fillStyle = colors.waterLight
    ctx.value.globalAlpha = 0.15

    for (let y = poolBounds.y; y < poolBounds.y + poolBounds.height; y += 12) {
      const waveOffset = Math.sin((y * 0.05) + time * 2) * 8
      const waveWidth = 30 + Math.sin((y * 0.03) + time * 1.5) * 10

      for (let x = poolBounds.x - 20; x < poolBounds.x + poolBounds.width + 20; x += 60) {
        const xPos = x + waveOffset + Math.sin(time * 3 + x * 0.02) * 5
        if (xPos > poolBounds.x && xPos + waveWidth < poolBounds.x + poolBounds.width) {
          ctx.value.fillRect(xPos, y, waveWidth, 3)
        }
      }
    }

    // Secondary wave layer (perpendicular subtle effect)
    ctx.value.globalAlpha = 0.08
    for (let x = poolBounds.x; x < poolBounds.x + poolBounds.width; x += 40) {
      const vertWave = Math.sin((x * 0.04) + time * 1.8) * 6
      for (let y = poolBounds.y; y < poolBounds.y + poolBounds.height; y += 50) {
        const yOffset = vertWave + Math.cos(time * 2 + y * 0.03) * 4
        ctx.value.fillRect(x, y + yOffset, 4, 20)
      }
    }

    // Sparkle/light reflections on water
    ctx.value.fillStyle = '#FFFFFF'
    ctx.value.globalAlpha = 0.2
    for (let i = 0; i < 15; i++) {
      const sparkleX = poolBounds.x + 50 + (i * 47) % poolBounds.width
      const sparkleY = poolBounds.y + 30 + (i * 31) % poolBounds.height
      const sparklePhase = Math.sin(time * 4 + i * 1.7)

      if (sparklePhase > 0.7) {
        const sparkleSize = (sparklePhase - 0.7) * 10
        ctx.value.fillRect(sparkleX, sparkleY, sparkleSize, 2)
        ctx.value.fillRect(sparkleX + sparkleSize / 2 - 1, sparkleY - sparkleSize / 2 + 1, 2, sparkleSize)
      }
    }

    ctx.value.globalAlpha = 1.0

    // Draw pixelated logo at the bottom of the pool (like painted on pool floor)
    if (logoLoaded && logoImage && ctx.value) {
      const logoWidth = 180
      const logoHeight = (logoImage.height / logoImage.width) * logoWidth
      const logoX = poolBounds.x + poolBounds.width / 2 - logoWidth / 2
      const logoY = poolBounds.y + poolBounds.height / 2 - logoHeight / 2

      // Save context for logo transformations
      ctx.value.save()

      // Apply underwater distortion effect
      const distortX = Math.sin(time * 1.5) * 3
      const distortY = Math.cos(time * 1.2) * 2

      // Make logo semi-transparent (underwater look)
      ctx.value.globalAlpha = 0.25

      // Draw with pixelation effect by scaling down then up
      ctx.value.imageSmoothingEnabled = false

      // Create slight wave distortion by drawing the logo
      ctx.value.drawImage(
        logoImage,
        logoX + distortX,
        logoY + distortY,
        logoWidth,
        logoHeight
      )

      // Add a second slightly offset layer for depth effect
      ctx.value.globalAlpha = 0.1
      ctx.value.drawImage(
        logoImage,
        logoX + distortX * 1.5 + 2,
        logoY + distortY * 1.5 + 2,
        logoWidth,
        logoHeight
      )

      ctx.value.restore()
    }

    // Lane lines (horizontal) with wave distortion
    ctx.value.fillStyle = colors.laneLines
    ctx.value.globalAlpha = 0.25
    const laneSpacing = poolBounds.height / 4
    for (let i = 1; i < 4; i++) {
      const baseY = poolBounds.y + laneSpacing * i
      // Draw lane line with subtle wave
      for (let x = poolBounds.x + 50; x < poolBounds.x + poolBounds.width - 50; x += 4) {
        const waveY = Math.sin((x * 0.03) + time * 2) * 1.5
        ctx.value.fillRect(x, baseY + waveY - 1, 4, 2)
      }
    }
    ctx.value.globalAlpha = 1.0

    // Pool edge (pixel art border)
    ctx.value.fillStyle = colors.poolEdge
    // Top edge
    ctx.value.fillRect(poolBounds.x - 8, poolBounds.y - 8, poolBounds.width + 16, 8)
    // Bottom edge
    ctx.value.fillRect(poolBounds.x - 8, poolBounds.y + poolBounds.height, poolBounds.width + 16, 8)
    // Left edge (partial for goal)
    ctx.value.fillRect(poolBounds.x - 8, poolBounds.y - 8, 8, poolBounds.height + 16)
    // Right edge (partial for goal)
    ctx.value.fillRect(poolBounds.x + poolBounds.width, poolBounds.y - 8, 8, poolBounds.height + 16)
  }

  const drawGoal = (goal: Goal) => {
    if (!ctx.value) return
    const { colors } = config

    const isLeftGoal = goal.team === 'white'

    // Goal frame
    ctx.value.fillStyle = colors.goalFrame
    if (isLeftGoal) {
      // Left goal (facing right)
      ctx.value.fillRect(goal.position.x - 4, goal.position.y - 4, 8, goal.height + 8)
      ctx.value.fillRect(goal.position.x - 4, goal.position.y - 4, 24, 4)
      ctx.value.fillRect(goal.position.x - 4, goal.position.y + goal.height, 24, 4)
    } else {
      // Right goal (facing left)
      ctx.value.fillRect(goal.position.x + goal.width - 4, goal.position.y - 4, 8, goal.height + 8)
      ctx.value.fillRect(goal.position.x + goal.width - 20, goal.position.y - 4, 24, 4)
      ctx.value.fillRect(goal.position.x + goal.width - 20, goal.position.y + goal.height, 24, 4)
    }

    // Goal net pattern (pixel art mesh)
    ctx.value.fillStyle = colors.goalNet
    ctx.value.globalAlpha = 0.5
    for (let y = goal.position.y; y < goal.position.y + goal.height; y += 8) {
      for (let x = goal.position.x; x < goal.position.x + goal.width; x += 8) {
        ctx.value.fillRect(x, y, 1, 1)
      }
    }
    ctx.value.globalAlpha = 1.0
  }

  const drawPlayerWake = (player: Player) => {
    if (!ctx.value) return

    // Calculate player speed
    const speed = Math.sqrt(player.velocity.x ** 2 + player.velocity.y ** 2)

    if (speed > 30) {
      // Add ripples behind the player based on movement direction
      const intensity = Math.min(speed / 150, 1)

      // Calculate position behind the player
      const behindX = player.position.x - (player.velocity.x / speed) * 15
      const behindY = player.position.y - (player.velocity.y / speed) * 15

      // Randomly add ripples
      if (Math.random() < 0.3) {
        addRipple(
          behindX + (Math.random() - 0.5) * 10,
          behindY + (Math.random() - 0.5) * 10,
          intensity
        )
      }

      // Draw immediate wake/splash effect
      ctx.value.fillStyle = 'rgba(255, 255, 255, 0.3)'
      const wakeSize = 4 + intensity * 6

      // Small splash particles
      for (let i = 0; i < 3; i++) {
        const offsetX = (Math.random() - 0.5) * 15 - (player.velocity.x / speed) * 10
        const offsetY = (Math.random() - 0.5) * 15 - (player.velocity.y / speed) * 10
        ctx.value.fillRect(
          player.position.x + offsetX,
          player.position.y + offsetY,
          wakeSize * Math.random(),
          2
        )
      }
    }
  }

  const drawPlayer = (player: Player) => {
    if (!ctx.value) return
    const { colors, spriteSize } = config
    const x = Math.floor(player.position.x - spriteSize / 2)
    const y = Math.floor(player.position.y - spriteSize / 2)

    // Draw wake/ripples first (behind player)
    drawPlayerWake(player)

    // Body color based on team
    const bodyColor = player.team === 'white' ? colors.whiteTeamBody : colors.blueTeamBody
    const capColor = player.team === 'white' ? colors.whiteTeamCap : colors.blueTeamCap

    // Water ring around player (they're in water)
    ctx.value.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.value.lineWidth = 2
    ctx.value.beginPath()
    ctx.value.ellipse(x + spriteSize / 2, y + spriteSize - 2, 14, 7, 0, 0, Math.PI * 2)
    ctx.value.stroke()

    // Shadow
    ctx.value.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.value.beginPath()
    ctx.value.ellipse(x + spriteSize / 2, y + spriteSize - 4, 12, 6, 0, 0, Math.PI * 2)
    ctx.value.fill()

    // Body (swimming player viewed from above)
    ctx.value.fillStyle = bodyColor

    // Torso
    ctx.value.fillRect(x + 8, y + 10, 16, 14)

    // Arms based on animation
    const armOffset = player.animationState === 'swim' ? Math.sin(player.frameTimer * 10) * 4 : 0

    // Left arm
    ctx.value.fillRect(x + 4, y + 12 + armOffset, 6, 4)
    // Right arm
    ctx.value.fillRect(x + 22, y + 12 - armOffset, 6, 4)

    // Head/cap
    ctx.value.fillStyle = capColor
    ctx.value.fillRect(x + 10, y + 4, 12, 10)

    // Cap stripe (darker)
    ctx.value.fillStyle = player.team === 'white' ? '#E0E0B0' : '#104060'
    ctx.value.fillRect(x + 10, y + 8, 12, 2)

    // Eyes/face direction indicator
    ctx.value.fillStyle = '#333333'
    let eyeX = x + 14
    let eyeY = y + 10

    switch (player.direction) {
      case 'up':
        eyeY = y + 6
        break
      case 'down':
        eyeY = y + 12
        break
      case 'left':
        eyeX = x + 11
        break
      case 'right':
        eyeX = x + 17
        break
    }

    ctx.value.fillRect(eyeX, eyeY, 2, 2)
    ctx.value.fillRect(eyeX + 4, eyeY, 2, 2)

    // Highlight if controlled
    if (player.isControlled) {
      ctx.value.strokeStyle = '#FFD700'
      ctx.value.lineWidth = 2
      ctx.value.beginPath()
      ctx.value.arc(x + spriteSize / 2, y + spriteSize / 2, spriteSize / 2 + 4, 0, Math.PI * 2)
      ctx.value.stroke()

      // Arrow indicator above
      ctx.value.fillStyle = '#FFD700'
      ctx.value.beginPath()
      ctx.value.moveTo(x + spriteSize / 2, y - 8)
      ctx.value.lineTo(x + spriteSize / 2 - 6, y - 16)
      ctx.value.lineTo(x + spriteSize / 2 + 6, y - 16)
      ctx.value.closePath()
      ctx.value.fill()
    }

    // Ball possession indicator
    if (player.hasBall) {
      ctx.value.fillStyle = colors.ball
      ctx.value.beginPath()
      ctx.value.arc(x + spriteSize / 2, y - 4, 3, 0, Math.PI * 2)
      ctx.value.fill()
    }

    // Stamina bar (only show when below 70% or for controlled player)
    if (player.stamina < 70 || player.isControlled) {
      const barWidth = 24
      const barHeight = 3
      const barX = x + (spriteSize - barWidth) / 2
      const barY = y + spriteSize + 4

      // Background
      ctx.value.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.value.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2)

      // Stamina fill - color based on level
      let staminaColor = '#4ADE80' // Green
      if (player.stamina < 30) {
        staminaColor = '#EF4444' // Red
      } else if (player.stamina < 50) {
        staminaColor = '#F59E0B' // Orange
      }

      const fillWidth = (player.stamina / 100) * barWidth
      ctx.value.fillStyle = staminaColor
      ctx.value.fillRect(barX, barY, fillWidth, barHeight)
    }
  }

  const drawBall = (ball: Ball) => {
    if (!ctx.value) return
    const { colors } = config
    const x = Math.floor(ball.position.x)
    const y = Math.floor(ball.position.y)

    // Add ripples if ball is moving through water
    if (ball.isInFlight) {
      const speed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2)
      if (speed > 50 && Math.random() < 0.2) {
        addRipple(x, y, 0.5)
      }
    }

    // Ball water ring (floating on water)
    ctx.value.strokeStyle = 'rgba(255, 255, 255, 0.25)'
    ctx.value.lineWidth = 1.5
    ctx.value.beginPath()
    ctx.value.ellipse(x, y + 3, 9, 4, 0, 0, Math.PI * 2)
    ctx.value.stroke()

    // Ball shadow
    ctx.value.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.value.beginPath()
    ctx.value.ellipse(x, y + 4, 6, 3, 0, 0, Math.PI * 2)
    ctx.value.fill()

    // Ball body
    ctx.value.fillStyle = colors.ball
    ctx.value.beginPath()
    ctx.value.arc(x, y, 8, 0, Math.PI * 2)
    ctx.value.fill()

    // Ball highlight
    ctx.value.fillStyle = '#FFFFFF'
    ctx.value.globalAlpha = 0.5
    ctx.value.beginPath()
    ctx.value.arc(x - 2, y - 2, 3, 0, Math.PI * 2)
    ctx.value.fill()
    ctx.value.globalAlpha = 1.0

    // Ball pattern (waterpolo ball stripes)
    ctx.value.strokeStyle = '#FFFFFF'
    ctx.value.lineWidth = 1
    ctx.value.globalAlpha = 0.3
    ctx.value.beginPath()
    ctx.value.moveTo(x - 6, y)
    ctx.value.lineTo(x + 6, y)
    ctx.value.stroke()
    ctx.value.beginPath()
    ctx.value.moveTo(x, y - 6)
    ctx.value.lineTo(x, y + 6)
    ctx.value.stroke()
    ctx.value.globalAlpha = 1.0
  }

  const drawGoalkeeperProtectionZone = (state: GameState) => {
    if (!ctx.value) return

    // Find goalkeeper with ball
    const goalkeeperWithBall = state.players.find(
      (p) => p.role === 'goalkeeper' && p.hasBall
    )

    if (goalkeeperWithBall) {
      const protectionRadius = 80 // Same as config.protectionZoneRadius

      // Draw pulsing protection zone
      const pulsePhase = (waveTime * 3) % (Math.PI * 2)
      const pulseAlpha = 0.15 + Math.sin(pulsePhase) * 0.05

      // Outer ring
      ctx.value.strokeStyle = `rgba(255, 255, 255, ${pulseAlpha})`
      ctx.value.lineWidth = 2
      ctx.value.setLineDash([8, 4])
      ctx.value.beginPath()
      ctx.value.arc(
        goalkeeperWithBall.position.x,
        goalkeeperWithBall.position.y,
        protectionRadius,
        0,
        Math.PI * 2
      )
      ctx.value.stroke()

      // Inner fill (very subtle)
      ctx.value.fillStyle = `rgba(255, 255, 255, ${pulseAlpha * 0.3})`
      ctx.value.beginPath()
      ctx.value.arc(
        goalkeeperWithBall.position.x,
        goalkeeperWithBall.position.y,
        protectionRadius,
        0,
        Math.PI * 2
      )
      ctx.value.fill()

      ctx.value.setLineDash([]) // Reset dash
    }
  }

  const drawHUD = (state: GameState) => {
    if (!ctx.value) return

    // Score background
    ctx.value.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.value.fillRect(config.canvasWidth / 2 - 80, 4, 160, 32)

    // Score text
    ctx.value.fillStyle = '#FCFBD9'
    ctx.value.font = 'bold 20px "Press Start 2P", monospace'
    ctx.value.textAlign = 'center'
    ctx.value.fillText(`${state.score.white} - ${state.score.blue}`, config.canvasWidth / 2, 28)

    // Team labels
    ctx.value.font = '10px "Press Start 2P", monospace'
    ctx.value.fillStyle = config.colors.whiteTeamCap
    ctx.value.textAlign = 'right'
    ctx.value.fillText('WHT', config.canvasWidth / 2 - 50, 28)

    ctx.value.fillStyle = config.colors.blueTeamCap
    ctx.value.textAlign = 'left'
    ctx.value.fillText('BLU', config.canvasWidth / 2 + 50, 28)

    // Timer
    const minutes = Math.floor(state.time / 60)
    const seconds = Math.floor(state.time % 60)
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`

    ctx.value.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.value.fillRect(config.canvasWidth - 70, 4, 66, 24)

    ctx.value.fillStyle = state.time <= 30 ? '#FE6E81' : '#FCFBD9'
    ctx.value.font = '12px "Press Start 2P", monospace'
    ctx.value.textAlign = 'center'
    ctx.value.fillText(timeStr, config.canvasWidth - 37, 22)
  }

  const drawCountdown = (value: number) => {
    if (!ctx.value) return

    ctx.value.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.value.fillRect(0, 0, config.canvasWidth, config.canvasHeight)

    ctx.value.fillStyle = '#FCFBD9'
    ctx.value.font = 'bold 72px "Press Start 2P", monospace'
    ctx.value.textAlign = 'center'
    ctx.value.textBaseline = 'middle'
    ctx.value.fillText(
      value > 0 ? value.toString() : 'GO!',
      config.canvasWidth / 2,
      config.canvasHeight / 2
    )
  }

  const drawGoalScored = (team: 'white' | 'blue') => {
    if (!ctx.value) return

    ctx.value.fillStyle = 'rgba(0, 0, 0, 0.6)'
    ctx.value.fillRect(0, 0, config.canvasWidth, config.canvasHeight)

    const teamColor = team === 'white' ? config.colors.whiteTeamCap : config.colors.blueTeamCap
    ctx.value.fillStyle = teamColor
    ctx.value.font = 'bold 48px "Press Start 2P", monospace'
    ctx.value.textAlign = 'center'
    ctx.value.textBaseline = 'middle'
    ctx.value.fillText('GOAL!', config.canvasWidth / 2, config.canvasHeight / 2)

    ctx.value.fillStyle = '#FCFBD9'
    ctx.value.font = '16px "Press Start 2P", monospace'
    ctx.value.fillText(
      `${team.toUpperCase()} TEAM SCORES!`,
      config.canvasWidth / 2,
      config.canvasHeight / 2 + 50
    )
  }

  const drawGameOver = (state: GameState) => {
    if (!ctx.value) return

    ctx.value.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.value.fillRect(0, 0, config.canvasWidth, config.canvasHeight)

    ctx.value.fillStyle = '#FCFBD9'
    ctx.value.font = 'bold 36px "Press Start 2P", monospace'
    ctx.value.textAlign = 'center'
    ctx.value.textBaseline = 'middle'
    ctx.value.fillText('GAME OVER', config.canvasWidth / 2, config.canvasHeight / 2 - 60)

    ctx.value.font = 'bold 48px "Press Start 2P", monospace'
    ctx.value.fillText(
      `${state.score.white} - ${state.score.blue}`,
      config.canvasWidth / 2,
      config.canvasHeight / 2
    )

    let winner = 'DRAW!'
    if (state.score.white > state.score.blue) {
      winner = 'WHITE WINS!'
      ctx.value.fillStyle = config.colors.whiteTeamCap
    } else if (state.score.blue > state.score.white) {
      winner = 'BLUE WINS!'
      ctx.value.fillStyle = config.colors.blueTeamCap
    }

    ctx.value.font = '20px "Press Start 2P", monospace'
    ctx.value.fillText(winner, config.canvasWidth / 2, config.canvasHeight / 2 + 60)

    ctx.value.fillStyle = '#70BECF'
    ctx.value.font = '12px "Press Start 2P", monospace'
    ctx.value.fillText('PRESS SPACE TO PLAY AGAIN', config.canvasWidth / 2, config.canvasHeight / 2 + 110)
  }

  const drawPaused = () => {
    if (!ctx.value) return

    ctx.value.fillStyle = 'rgba(0, 0, 0, 0.6)'
    ctx.value.fillRect(0, 0, config.canvasWidth, config.canvasHeight)

    ctx.value.fillStyle = '#FCFBD9'
    ctx.value.font = 'bold 36px "Press Start 2P", monospace'
    ctx.value.textAlign = 'center'
    ctx.value.textBaseline = 'middle'
    ctx.value.fillText('PAUSED', config.canvasWidth / 2, config.canvasHeight / 2)

    ctx.value.fillStyle = '#70BECF'
    ctx.value.font = '12px "Press Start 2P", monospace'
    ctx.value.fillText('PRESS ESC TO RESUME', config.canvasWidth / 2, config.canvasHeight / 2 + 50)
  }

  const render = (state: GameState) => {
    if (!ctx.value || !canvasRef.value) return

    // Update wave animation time
    waveTime += 0.016 // ~60fps

    // Update ripple effects
    updateRipples()

    // Clear canvas
    ctx.value.fillStyle = '#0E2433'
    ctx.value.fillRect(0, 0, config.canvasWidth, config.canvasHeight)

    // Draw pool with animated waves
    drawPool(waveTime)

    // Draw ripple effects (under everything else)
    drawRipples()

    // Draw goals
    for (const goal of state.goals) {
      drawGoal(goal)
    }

    // Draw goalkeeper protection zone (before players)
    drawGoalkeeperProtectionZone(state)

    // Sort players by Y position for depth (painters algorithm)
    const sortedPlayers = [...state.players].sort((a, b) => a.position.y - b.position.y)

    // Draw ball if not held
    if (!state.ball.holder) {
      drawBall(state.ball)
    }

    // Draw players
    for (const player of sortedPlayers) {
      drawPlayer(player)

      // Draw ball with player if holding
      if (player.hasBall) {
        drawBall(state.ball)
      }
    }

    // Draw HUD
    drawHUD(state)

    // Draw overlays based on game phase
    switch (state.phase) {
      case 'countdown':
        drawCountdown(state.countdownValue)
        break
      case 'goal_scored':
        if (state.lastGoalTeam) {
          drawGoalScored(state.lastGoalTeam)
        }
        break
      case 'paused':
        drawPaused()
        break
      case 'game_over':
        drawGameOver(state)
        break
    }
  }

  return {
    render,
    drawCountdown,
    drawGoalScored,
    drawGameOver,
    drawPaused,
  }
}
