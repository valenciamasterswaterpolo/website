import type { Vector2D, GameState, GameConfig, Player, Ball, Goal } from '~/types/game'

export function useGamePhysics(config: GameConfig) {
  const distance = (a: Vector2D, b: Vector2D): number => {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  const magnitude = (v: Vector2D): number => {
    return Math.sqrt(v.x * v.x + v.y * v.y)
  }

  const normalize = (v: Vector2D): Vector2D => {
    const mag = magnitude(v)
    if (mag === 0) return { x: 0, y: 0 }
    return { x: v.x / mag, y: v.y / mag }
  }

  const clampToPoolBounds = (position: Vector2D, padding: number = 0) => {
    const minX = config.poolBounds.x + padding
    const maxX = config.poolBounds.x + config.poolBounds.width - padding
    const minY = config.poolBounds.y + padding
    const maxY = config.poolBounds.y + config.poolBounds.height - padding

    position.x = Math.max(minX, Math.min(maxX, position.x))
    position.y = Math.max(minY, Math.min(maxY, position.y))
  }

  const applyWaterPhysics = (state: GameState, deltaTime: number) => {
    for (const player of state.players) {
      const speed = magnitude(player.velocity)

      // Quadratic water drag: faster movement = more resistance
      // drag = baseDrag * (1 - quadraticCoeff * speed^2)
      const quadraticDrag = config.waterDragQuadratic * speed * speed
      const effectiveDrag = Math.max(0.85, config.waterDrag - quadraticDrag)

      player.velocity.x *= effectiveDrag
      player.velocity.y *= effectiveDrag

      // Stamina affects max speed
      const staminaFactor = 0.7 + (player.stamina / 100) * 0.3 // 70-100% of max speed based on stamina
      const effectiveMaxSpeed = player.maxSpeed * staminaFactor

      if (speed > effectiveMaxSpeed) {
        player.velocity.x = (player.velocity.x / speed) * effectiveMaxSpeed
        player.velocity.y = (player.velocity.y / speed) * effectiveMaxSpeed
      }

      player.position.x += player.velocity.x * deltaTime
      player.position.y += player.velocity.y * deltaTime

      clampToPoolBounds(player.position, config.spriteSize / 2)

      // Stamina drain/recovery based on speed
      if (speed > config.staminaSprintThreshold) {
        // Sprinting drains stamina
        player.stamina = Math.max(0, player.stamina - config.staminaDrainRate * deltaTime)
      } else if (speed < 30) {
        // Slow movement or stationary recovers stamina faster
        const recoveryMultiplier = speed < 10 ? 1.5 : 1.0
        player.stamina = Math.min(100, player.stamina + config.staminaRecoveryRate * recoveryMultiplier * deltaTime)
      } else {
        // Moderate speed: slow recovery
        player.stamina = Math.min(100, player.stamina + config.staminaRecoveryRate * 0.3 * deltaTime)
      }
    }

    if (state.ball.isInFlight) {
      // Ball also has quadratic drag (air resistance + water surface)
      const ballSpeed = magnitude(state.ball.velocity)
      const ballDrag = 0.995 - (ballSpeed * 0.00002) // Slight speed-dependent drag
      state.ball.velocity.x *= Math.max(0.98, ballDrag)
      state.ball.velocity.y *= Math.max(0.98, ballDrag)

      state.ball.position.x += state.ball.velocity.x * deltaTime
      state.ball.position.y += state.ball.velocity.y * deltaTime

      clampToPoolBounds(state.ball.position, 8)

      const speed = magnitude(state.ball.velocity)
      if (speed < 10) {
        state.ball.isInFlight = false
        state.ball.velocity = { x: 0, y: 0 }
        state.ball.targetPosition = null
      }
    } else if (state.ball.holder) {
      const offsetX = state.ball.holder.direction === 'left' ? -12 : state.ball.holder.direction === 'right' ? 12 : 0
      const offsetY = state.ball.holder.direction === 'up' ? -12 : state.ball.holder.direction === 'down' ? 12 : 0
      state.ball.position.x = state.ball.holder.position.x + offsetX
      state.ball.position.y = state.ball.holder.position.y + offsetY
    }
  }

  const isPointInRect = (point: Vector2D, x: number, y: number, width: number, height: number): boolean => {
    return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height
  }

  const checkCollisions = (state: GameState): { goalScored: boolean; scoringTeam: 'white' | 'blue' | null } => {
    let goalScored = false
    let scoringTeam: 'white' | 'blue' | null = null

    // Ball pickup when free - find closest player within range
    if (!state.ball.holder && !state.ball.isInFlight) {
      let closestPlayer: Player | null = null
      let closestDist = config.spriteSize * 1.5 // Larger pickup radius

      for (const player of state.players) {
        const dist = distance(player.position, state.ball.position)
        if (dist < closestDist) {
          closestDist = dist
          closestPlayer = player
        }
      }

      if (closestPlayer) {
        state.players.forEach((p) => (p.hasBall = false))
        closestPlayer.hasBall = true
        state.ball.holder = closestPlayer
      }
    }

    // Ball interception when in flight
    if (state.ball.isInFlight) {
      for (const player of state.players) {
        const dist = distance(player.position, state.ball.position)
        if (dist < config.spriteSize * 0.9) {
          state.players.forEach((p) => (p.hasBall = false))
          player.hasBall = true
          state.ball.holder = player
          state.ball.isInFlight = false
          state.ball.velocity = { x: 0, y: 0 }
          state.ball.targetPosition = null
          break
        }
      }
    }

    for (const goal of state.goals) {
      if (
        isPointInRect(
          state.ball.position,
          goal.bounds.x,
          goal.bounds.y,
          goal.bounds.width,
          goal.bounds.height
        )
      ) {
        scoringTeam = goal.team === 'white' ? 'blue' : 'white'
        goalScored = true
        break
      }
    }

    // Goalkeeper protection zone - push opponents away when goalkeeper has ball
    const goalkeeperWithBall = state.players.find((p) => p.role === 'goalkeeper' && p.hasBall)
    if (goalkeeperWithBall) {
      const protectionRadius = config.protectionZoneRadius

      for (const player of state.players) {
        if (player.team === goalkeeperWithBall.team) continue // Same team, skip

        const dist = distance(player.position, goalkeeperWithBall.position)

        if (dist < protectionRadius) {
          // Push opponent away from goalkeeper with gradual force
          const pushDirection = normalize({
            x: player.position.x - goalkeeperWithBall.position.x,
            y: player.position.y - goalkeeperWithBall.position.y,
          })

          // Stronger push the closer they are
          const penetration = 1 - (dist / protectionRadius) // 0 at edge, 1 at center
          const pushStrength = penetration * 0.2

          player.position.x += pushDirection.x * pushStrength * protectionRadius * 0.1
          player.position.y += pushDirection.y * pushStrength * protectionRadius * 0.1
          player.velocity.x += pushDirection.x * pushStrength * 150
          player.velocity.y += pushDirection.y * pushStrength * 150

          // Slow down opponents in the zone
          player.velocity.x *= 0.92
          player.velocity.y *= 0.92

          clampToPoolBounds(player.position, config.spriteSize / 2)
        }
      }
    }

    // Player-player collisions and ball stealing
    for (let i = 0; i < state.players.length; i++) {
      for (let j = i + 1; j < state.players.length; j++) {
        const p1 = state.players[i]
        const p2 = state.players[j]
        if (!p1 || !p2) continue

        const dist = distance(p1.position, p2.position)
        const minDist = config.spriteSize * 0.8

        if (dist < minDist && dist > 0) {
          // Calculate relative velocity for momentum exchange
          const relVelX = p1.velocity.x - p2.velocity.x
          const relVelY = p1.velocity.y - p2.velocity.y
          const relSpeed = magnitude({ x: relVelX, y: relVelY })

          // Ball stealing - when opponents collide and one has the ball
          if (p1.team !== p2.team) {
            const ballHolder = p1.hasBall ? p1 : p2.hasBall ? p2 : null
            const stealer = p1.hasBall ? p2 : p2.hasBall ? p1 : null

            if (ballHolder && stealer) {
              // Give controlled player (human) some protection - harder to steal from them
              const controlledProtection = ballHolder.isControlled ? 0.5 : 1.0

              // Goalkeeper steal - high chance but not guaranteed
              if (stealer.role === 'goalkeeper') {
                // Goalkeeper steal chance affected by pressure (how many attackers nearby)
                const nearbyAttackers = state.players.filter(
                  (p) => p.team !== stealer.team && p.role !== 'goalkeeper' && distance(p.position, stealer.position) < 60
                ).length
                const pressurePenalty = nearbyAttackers * 0.1
                const goalkeeperChance = Math.max(0.4, config.goalkeeperStealChance - pressurePenalty) * controlledProtection

                if (Math.random() < goalkeeperChance) {
                  ballHolder.hasBall = false
                  stealer.hasBall = true
                  state.ball.holder = stealer
                  state.ball.isInFlight = false
                  state.ball.velocity = { x: 0, y: 0 }
                }
              }
              // Can't steal from goalkeeper - they're protected
              else if (ballHolder.role === 'goalkeeper') {
                // Don't allow stealing from goalkeeper, just push away
              }
              // Normal steal between field players
              else {
                // Steal chance based on:
                // 1. Approach angle (side/back better than front)
                // 2. Relative speed
                // 3. Stealer stamina
                // Equal chance for both teams
                const baseStealChance = 0.15 // Reduced from 0.25-0.35 to make keeping ball easier

                // Calculate approach angle bonus
                const approachDir = normalize({
                  x: stealer.position.x - ballHolder.position.x,
                  y: stealer.position.y - ballHolder.position.y,
                })
                const holderFacing = {
                  x: ballHolder.direction === 'right' ? 1 : ballHolder.direction === 'left' ? -1 : 0,
                  y: ballHolder.direction === 'down' ? 1 : ballHolder.direction === 'up' ? -1 : 0,
                }
                const dotProduct = approachDir.x * holderFacing.x + approachDir.y * holderFacing.y
                // -1 = from behind (best), 0 = from side, 1 = from front (worst)
                const angleBonus = (1 - dotProduct) * 0.15 // 0-30% bonus

                // Speed bonus
                const stealerSpeed = magnitude(stealer.velocity)
                const speedBonus = Math.min(0.2, stealerSpeed / 400)

                // Stamina bonus - tired players are easier to steal from
                const staminaBonus = (100 - ballHolder.stamina) / 500 // 0-20% if exhausted

                const stealChance = (baseStealChance + angleBonus + speedBonus + staminaBonus) * controlledProtection

                if (Math.random() < stealChance) {
                  // Steal successful!
                  ballHolder.hasBall = false
                  stealer.hasBall = true
                  state.ball.holder = stealer
                  state.ball.isInFlight = false
                  state.ball.velocity = { x: 0, y: 0 }
                }
              }
            }
          }

          // Push players apart with momentum exchange
          const overlap = minDist - dist
          const direction = normalize({
            x: p1.position.x - p2.position.x,
            y: p1.position.y - p2.position.y,
          })

          // Position separation
          p1.position.x += direction.x * overlap * 0.5
          p1.position.y += direction.y * overlap * 0.5
          p2.position.x -= direction.x * overlap * 0.5
          p2.position.y -= direction.y * overlap * 0.5

          // Momentum exchange - bounce off each other
          if (relSpeed > 30) {
            const bounceStrength = Math.min(0.5, relSpeed / 200)
            // Each player gets pushed in opposite direction
            p1.velocity.x += direction.x * relSpeed * bounceStrength * 0.3
            p1.velocity.y += direction.y * relSpeed * bounceStrength * 0.3
            p2.velocity.x -= direction.x * relSpeed * bounceStrength * 0.3
            p2.velocity.y -= direction.y * relSpeed * bounceStrength * 0.3
          }

          clampToPoolBounds(p1.position, config.spriteSize / 2)
          clampToPoolBounds(p2.position, config.spriteSize / 2)
        }
      }
    }

    return { goalScored, scoringTeam }
  }

  // Calculate pass accuracy based on multiple factors
  const calculatePassAccuracy = (fromPlayer: Player, toPlayer: Player, state: GameState): number => {
    let accuracy = config.passAccuracyBase

    // Distance penalty: longer passes are less accurate
    const dist = distance(fromPlayer.position, toPlayer.position)
    const distancePenalty = Math.min(0.2, dist / 1500) // Up to 20% penalty for long passes
    accuracy -= distancePenalty

    // Stamina penalty: tired players are less accurate
    const staminaPenalty = (100 - fromPlayer.stamina) / 500 // Up to 20% penalty when exhausted
    accuracy -= staminaPenalty

    // Pressure penalty: defenders nearby reduce accuracy
    const nearbyDefenders = state.players.filter(
      (p) => p.team !== fromPlayer.team && distance(p.position, fromPlayer.position) < 50
    ).length
    const pressurePenalty = nearbyDefenders * 0.08 // 8% per nearby defender
    accuracy -= pressurePenalty

    // Ensure minimum accuracy
    return Math.max(0.4, Math.min(1, accuracy))
  }

  const passBall = (state: GameState, fromPlayer: Player, toPlayer: Player) => {
    if (!fromPlayer.hasBall) return

    const dist = distance(fromPlayer.position, toPlayer.position)

    // For very close passes (< 50 pixels), transfer ball directly
    if (dist < 50) {
      fromPlayer.hasBall = false
      toPlayer.hasBall = true
      state.ball.holder = toPlayer
      state.ball.isInFlight = false
      state.ball.velocity = { x: 0, y: 0 }
      state.ball.targetPosition = null
      return
    }

    fromPlayer.hasBall = false
    state.ball.holder = null
    state.ball.isInFlight = true

    // Calculate accuracy and apply offset to target
    const accuracy = calculatePassAccuracy(fromPlayer, toPlayer, state)
    const maxOffset = (1 - accuracy) * 60 // Up to 60px deviation at low accuracy
    const offsetX = (Math.random() - 0.5) * maxOffset
    const offsetY = (Math.random() - 0.5) * maxOffset

    const targetPosition = {
      x: toPlayer.position.x + offsetX,
      y: toPlayer.position.y + offsetY,
    }
    state.ball.targetPosition = targetPosition

    const direction = normalize({
      x: targetPosition.x - fromPlayer.position.x,
      y: targetPosition.y - fromPlayer.position.y,
    })

    // Adjust pass speed based on distance - slower for shorter passes
    // Also affected by stamina
    const staminaSpeedFactor = 0.85 + (fromPlayer.stamina / 100) * 0.15
    const minSpeed = 150 * staminaSpeedFactor
    const speedFactor = Math.min(1, dist / 200) // Full speed at 200+ pixels
    const adjustedSpeed = minSpeed + (config.passSpeed * staminaSpeedFactor - minSpeed) * speedFactor

    state.ball.velocity = {
      x: direction.x * adjustedSpeed,
      y: direction.y * adjustedSpeed,
    }
  }

  // Calculate shot accuracy based on player state
  const calculateShotAccuracy = (player: Player, state: GameState): number => {
    let accuracy = 0.75 // Base shot accuracy (lower than pass)

    // Stamina penalty
    const staminaPenalty = (100 - player.stamina) / 400 // Up to 25% penalty when exhausted
    accuracy -= staminaPenalty

    // Distance to goal affects accuracy (further = less accurate)
    const goalX = player.team === 'white'
      ? config.poolBounds.x + config.poolBounds.width
      : config.poolBounds.x
    const distToGoal = Math.abs(player.position.x - goalX)
    const distancePenalty = Math.min(0.2, distToGoal / 2000)
    accuracy -= distancePenalty

    // Pressure penalty
    const nearbyDefenders = state.players.filter(
      (p) => p.team !== player.team && distance(p.position, player.position) < 60
    ).length
    const pressurePenalty = nearbyDefenders * 0.1
    accuracy -= pressurePenalty

    return Math.max(0.3, Math.min(0.9, accuracy))
  }

  const shootBall = (state: GameState, player: Player, targetGoal: Goal) => {
    if (!player.hasBall) return

    player.hasBall = false
    state.ball.holder = null
    state.ball.isInFlight = true

    const goalCenter = {
      x: targetGoal.position.x + targetGoal.width / 2,
      y: targetGoal.position.y + targetGoal.height / 2,
    }

    // Apply accuracy-based deviation
    const accuracy = calculateShotAccuracy(player, state)
    const maxYOffset = targetGoal.height * (1 - accuracy) // More deviation = less accurate
    const randomOffset = (Math.random() - 0.5) * maxYOffset
    goalCenter.y += randomOffset

    state.ball.targetPosition = goalCenter

    const direction = normalize({
      x: goalCenter.x - player.position.x,
      y: goalCenter.y - player.position.y,
    })

    // Shot power affected by stamina
    const staminaSpeedFactor = 0.8 + (player.stamina / 100) * 0.2
    const effectiveShotSpeed = config.shotSpeed * staminaSpeedFactor

    state.ball.velocity = {
      x: direction.x * effectiveShotSpeed,
      y: direction.y * effectiveShotSpeed,
    }
  }

  return {
    distance,
    magnitude,
    normalize,
    clampToPoolBounds,
    applyWaterPhysics,
    checkCollisions,
    passBall,
    shootBall,
  }
}
