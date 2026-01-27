import type { Vector2D, GameState, GameConfig, Player, AIState, Goal, TeamType } from '~/types/game'

// Team skill levels - balanced for fair gameplay
const TEAM_SKILLS = {
  white: {
    speedMultiplier: 1.0,
    reactionSpeed: 1.0,
    decisionQuality: 0.85,
    interceptSkill: 1.0,
    positioningSkill: 0.9,
    pressureAwareness: 0.8,
  },
  blue: {
    speedMultiplier: 1.0,
    reactionSpeed: 1.0,
    decisionQuality: 0.85,
    interceptSkill: 1.0,
    positioningSkill: 0.9,
    pressureAwareness: 0.8,
  },
}

// Formation positions relative to pool center
const ATTACK_FORMATION = {
  attacker: { xOffset: 0.3, yOffset: -0.25 }, // Forward and up
  defender: { xOffset: 0.1, yOffset: 0.25 },  // Behind and down
  center: { xOffset: 0.25, yOffset: 0 },      // Central attacking position
  goalkeeper: { xOffset: -0.35, yOffset: 0 }, // Near own goal
}

const DEFENSE_FORMATION = {
  attacker: { xOffset: -0.1, yOffset: -0.2 }, // Fall back slightly
  defender: { xOffset: -0.25, yOffset: 0.2 }, // Deep defense
  center: { xOffset: -0.15, yOffset: 0 },     // Central defensive position
  goalkeeper: { xOffset: -0.4, yOffset: 0 },  // Very close to goal
}

// Decision scoring weights
const DECISION_WEIGHTS = {
  shoot: {
    distanceToGoal: -0.3,      // Negative = closer is better
    clearPath: 0.4,            // Clear line to goal
    stamina: 0.15,             // Higher stamina = better shot
    goaliePosition: 0.15,      // Goalie out of position
  },
  pass: {
    teammateOpenness: 0.35,    // How open is the teammate
    advancePosition: 0.25,     // Does pass advance toward goal
    safeDistance: 0.25,        // Safe from interception
    pressureRelief: 0.15,      // Relieves current pressure
  },
  hold: {
    noDefenders: 0.4,          // No immediate threat
    advancingToGoal: 0.3,      // Moving toward goal
    teamNotReady: 0.3,         // Teammates not in position
  },
}

export function useGameAI(config: GameConfig) {
  const getTeamSkill = (team: TeamType) => TEAM_SKILLS[team]

  const distance = (a: Vector2D, b: Vector2D): number => {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  const magnitude = (v: Vector2D): number => {
    return Math.sqrt(v.x * v.x + v.y * v.y)
  }

  const normalize = (v: Vector2D): Vector2D => {
    const mag = Math.sqrt(v.x * v.x + v.y * v.y)
    if (mag === 0) return { x: 0, y: 0 }
    return { x: v.x / mag, y: v.y / mag }
  }

  const lerp = (a: Vector2D, b: Vector2D, t: number): Vector2D => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  })

  const dot = (a: Vector2D, b: Vector2D): number => a.x * b.x + a.y * b.y

  // Predict where the ball will be in the future
  const predictBallPosition = (state: GameState, timeAhead: number): Vector2D => {
    if (state.ball.isInFlight) {
      return {
        x: state.ball.position.x + state.ball.velocity.x * timeAhead,
        y: state.ball.position.y + state.ball.velocity.y * timeAhead,
      }
    }
    return state.ball.position
  }

  const getTeammates = (player: Player, state: GameState): Player[] => {
    return state.players.filter((p) => p.team === player.team && p.id !== player.id)
  }

  const getOpponents = (player: Player, state: GameState): Player[] => {
    return state.players.filter((p) => p.team !== player.team)
  }

  const getOwnGoal = (player: Player, state: GameState): Goal => {
    return state.goals.find((g) => g.team === player.team)!
  }

  const getEnemyGoal = (player: Player, state: GameState): Goal => {
    return state.goals.find((g) => g.team !== player.team)!
  }

  // Calculate pressure level on a player (0-1)
  const calculatePressure = (player: Player, state: GameState): number => {
    const opponents = getOpponents(player, state)
    let pressure = 0

    for (const opp of opponents) {
      const dist = distance(player.position, opp.position)
      if (dist < 100) {
        // Closer opponents = more pressure
        pressure += (100 - dist) / 100
        // Extra pressure if opponent is moving toward player
        const toPlayer = normalize({
          x: player.position.x - opp.position.x,
          y: player.position.y - opp.position.y,
        })
        const oppDir = normalize(opp.velocity)
        const approaching = dot(toPlayer, oppDir)
        if (approaching > 0.5) {
          pressure += 0.3
        }
      }
    }

    return Math.min(1, pressure)
  }

  // Check if path between two points is clear of opponents
  const isPathClear = (from: Vector2D, to: Vector2D, opponents: Player[], margin: number = 30): boolean => {
    const pathDir = normalize({ x: to.x - from.x, y: to.y - from.y })
    const pathLen = distance(from, to)

    for (const opp of opponents) {
      // Project opponent position onto path
      const toOpp = { x: opp.position.x - from.x, y: opp.position.y - from.y }
      const projLen = dot(toOpp, pathDir)

      // Check if opponent is along the path
      if (projLen > 0 && projLen < pathLen) {
        // Calculate perpendicular distance
        const projPoint = { x: from.x + pathDir.x * projLen, y: from.y + pathDir.y * projLen }
        const perpDist = distance(projPoint, opp.position)

        if (perpDist < margin) {
          return false
        }
      }
    }
    return true
  }

  // Get formation position based on game state
  const getFormationPosition = (player: Player, state: GameState): Vector2D => {
    const teamHasBall = state.players.some((p) => p.team === player.team && p.hasBall)
    const formation = teamHasBall ? ATTACK_FORMATION : DEFENSE_FORMATION
    const formationOffset = formation[player.role as keyof typeof formation] || { xOffset: 0, yOffset: 0 }

    // Calculate base position from pool center
    const poolCenterX = config.poolBounds.x + config.poolBounds.width / 2
    const poolCenterY = config.poolBounds.y + config.poolBounds.height / 2
    const halfWidth = config.poolBounds.width / 2 - 60
    const halfHeight = config.poolBounds.height / 2 - 40

    // Adjust based on team side
    const sideMultiplier = player.team === 'white' ? 1 : -1

    return {
      x: poolCenterX + formationOffset.xOffset * halfWidth * sideMultiplier,
      y: poolCenterY + formationOffset.yOffset * halfHeight,
    }
  }

  // Find nearest teammate to ball
  const findNearestTeammateToBall = (player: Player, state: GameState): Player | null => {
    const teammates = getTeammates(player, state)
    if (teammates.length === 0) return null

    let nearest: Player | null = null
    let nearestDist = Infinity

    for (const teammate of teammates) {
      const dist = distance(teammate.position, state.ball.position)
      if (dist < nearestDist) {
        nearestDist = dist
        nearest = teammate
      }
    }

    return nearest
  }

  // Evaluate how good a pass to this teammate would be (0-100)
  const evaluatePassOption = (player: Player, teammate: Player, state: GameState): number => {
    const opponents = getOpponents(player, state)
    const enemyGoal = getEnemyGoal(player, state)
    const goalCenter = { x: enemyGoal.position.x, y: enemyGoal.position.y + enemyGoal.height / 2 }

    let score = 50 // Base score

    // 1. Teammate openness - distance from nearest defender
    let minDefenderDist = Infinity
    for (const opp of opponents) {
      const dist = distance(teammate.position, opp.position)
      if (dist < minDefenderDist) minDefenderDist = dist
    }
    const opennessScore = Math.min(40, minDefenderDist / 3) // 0-40 points
    score += opennessScore * DECISION_WEIGHTS.pass.teammateOpenness

    // 2. Advance toward goal
    const myDistToGoal = distance(player.position, goalCenter)
    const teammateDistToGoal = distance(teammate.position, goalCenter)
    if (teammateDistToGoal < myDistToGoal) {
      score += 30 * DECISION_WEIGHTS.pass.advancePosition
    }

    // 3. Safe pass - clear path
    if (isPathClear(player.position, teammate.position, opponents, 25)) {
      score += 35 * DECISION_WEIGHTS.pass.safeDistance
    } else {
      score -= 20
    }

    // 4. Pressure relief - if I'm under pressure and teammate isn't
    const myPressure = calculatePressure(player, state)
    const teammatePressure = calculatePressure(teammate, state)
    if (myPressure > 0.5 && teammatePressure < 0.3) {
      score += 25 * DECISION_WEIGHTS.pass.pressureRelief
    }

    return Math.max(0, Math.min(100, score))
  }

  // Evaluate shot opportunity (0-100)
  const evaluateShotOpportunity = (player: Player, state: GameState): number => {
    const enemyGoal = getEnemyGoal(player, state)
    const goalCenter = { x: enemyGoal.position.x, y: enemyGoal.position.y + enemyGoal.height / 2 }
    const opponents = getOpponents(player, state)

    let score = 30 // Base score

    // 1. Distance to goal (closer = better)
    const distToGoal = distance(player.position, goalCenter)
    const maxShootDist = 300
    const distScore = Math.max(0, (maxShootDist - distToGoal) / maxShootDist) * 40
    score += distScore * (-DECISION_WEIGHTS.shoot.distanceToGoal + 1)

    // 2. Clear path to goal
    const goalkeeper = opponents.find((p) => p.role === 'goalkeeper')
    const defenders = opponents.filter((p) => p.role !== 'goalkeeper')

    if (isPathClear(player.position, goalCenter, defenders, 20)) {
      score += 30 * DECISION_WEIGHTS.shoot.clearPath
    } else {
      score -= 25
    }

    // 3. Stamina affects shot quality
    score += (player.stamina / 100) * 15 * DECISION_WEIGHTS.shoot.stamina

    // 4. Goalkeeper position - is goalie out of position?
    if (goalkeeper) {
      const goalkeeperToGoalCenter = distance(goalkeeper.position, goalCenter)
      if (goalkeeperToGoalCenter > 50) {
        score += 20 * DECISION_WEIGHTS.shoot.goaliePosition
      }
    }

    // Bonus for being close
    if (distToGoal < 150) {
      score += 15
    }

    return Math.max(0, Math.min(100, score))
  }

  // Evaluate holding the ball (0-100)
  const evaluateHoldOption = (player: Player, state: GameState): number => {
    const enemyGoal = getEnemyGoal(player, state)
    const goalCenter = { x: enemyGoal.position.x, y: enemyGoal.position.y + enemyGoal.height / 2 }

    let score = 40 // Base score

    // 1. No immediate pressure
    const pressure = calculatePressure(player, state)
    if (pressure < 0.3) {
      score += 30 * DECISION_WEIGHTS.hold.noDefenders
    } else {
      score -= pressure * 40
    }

    // 2. Moving toward goal with space
    const velocityToGoal = normalize({
      x: goalCenter.x - player.position.x,
      y: goalCenter.y - player.position.y,
    })
    const playerDir = normalize(player.velocity)
    const advancingScore = dot(velocityToGoal, playerDir)
    if (advancingScore > 0.5) {
      score += 25 * DECISION_WEIGHTS.hold.advancingToGoal
    }

    // 3. Teammates not in position yet
    const teammates = getTeammates(player, state).filter((t) => t.role !== 'goalkeeper')
    let teammatesReady = 0
    for (const t of teammates) {
      const formationPos = getFormationPosition(t, state)
      if (distance(t.position, formationPos) < 60) {
        teammatesReady++
      }
    }
    if (teammatesReady < teammates.length * 0.5) {
      score += 20 * DECISION_WEIGHTS.hold.teamNotReady
    }

    return Math.max(0, Math.min(100, score))
  }

  // Find best teammate to pass to using weighted evaluation
  const findOpenTeammate = (player: Player, state: GameState): Player | null => {
    const teammates = getTeammates(player, state).filter((t) => t.role !== 'goalkeeper')

    let bestTeammate: Player | null = null
    let bestScore = 30 // Minimum threshold to pass

    for (const teammate of teammates) {
      const score = evaluatePassOption(player, teammate, state)
      if (score > bestScore) {
        bestScore = score
        bestTeammate = teammate
      }
    }

    return bestTeammate
  }

  // Find teammate in the direction the player is facing (for player-controlled passes)
  const findTeammateInDirection = (player: Player, state: GameState): Player | null => {
    let teammates = getTeammates(player, state).filter((t) => t.role !== 'goalkeeper')
    if (teammates.length === 0) {
      teammates = getTeammates(player, state)
    }
    if (teammates.length === 0) return null

    // Get direction vector based on player's facing direction
    let dirX = 0
    let dirY = 0
    switch (player.direction) {
      case 'right': dirX = 1; break
      case 'left': dirX = -1; break
      case 'up': dirY = -1; break
      case 'down': dirY = 1; break
    }

    let bestTeammate: Player | null = null
    let bestScore = -Infinity
    let closestTeammate: Player | null = null
    let closestDist = Infinity

    for (const teammate of teammates) {
      const toTeammate = {
        x: teammate.position.x - player.position.x,
        y: teammate.position.y - player.position.y,
      }
      const dist = Math.sqrt(toTeammate.x * toTeammate.x + toTeammate.y * toTeammate.y)

      if (dist < closestDist) {
        closestDist = dist
        closestTeammate = teammate
      }

      if (dist < 1) continue

      const normToTeammate = { x: toTeammate.x / dist, y: toTeammate.y / dist }
      const dotProduct = normToTeammate.x * dirX + normToTeammate.y * dirY

      const score = dotProduct * 100 + (1000 / (dist + 50))
      if (score > bestScore) {
        bestScore = score
        bestTeammate = teammate
      }
    }

    return bestTeammate || closestTeammate
  }

  const evaluateSituation = (player: Player, state: GameState): AIState => {
    const teamHasBall = state.players.some((p) => p.team === player.team && p.hasBall)
    const enemyHasBall = state.players.some((p) => p.team !== player.team && p.hasBall)
    const iHaveBall = player.hasBall

    if (player.role === 'goalkeeper') {
      return 'goalkeeper'
    }

    if (!state.ball.holder && !state.ball.isInFlight) {
      const myDistToBall = distance(player.position, state.ball.position)
      const nearestTeammate = findNearestTeammateToBall(player, state)

      if (!nearestTeammate || myDistToBall < distance(nearestTeammate.position, state.ball.position)) {
        return 'chase_ball'
      }
      return teamHasBall ? 'support' : 'defend'
    }

    if (iHaveBall) {
      return 'attack'
    }

    if (teamHasBall) {
      return 'support'
    }

    if (enemyHasBall || state.ball.isInFlight) {
      // Defenders intercept, attackers defend
      return player.role === 'defender' ? 'intercept' : 'defend'
    }

    return 'return_position'
  }

  const moveTowards = (player: Player, target: Vector2D, deltaTime: number, speedMultiplier: number = 1) => {
    const direction = {
      x: target.x - player.position.x,
      y: target.y - player.position.y,
    }
    const dist = Math.sqrt(direction.x * direction.x + direction.y * direction.y)

    if (dist < 5) return

    const teamSkill = getTeamSkill(player.team)
    const normalizedDir = normalize(direction)
    const acceleration = config.playerAcceleration * speedMultiplier * teamSkill.speedMultiplier

    player.velocity.x += normalizedDir.x * acceleration * deltaTime
    player.velocity.y += normalizedDir.y * acceleration * deltaTime

    if (Math.abs(normalizedDir.x) > Math.abs(normalizedDir.y)) {
      player.direction = normalizedDir.x > 0 ? 'right' : 'left'
    } else {
      player.direction = normalizedDir.y > 0 ? 'down' : 'up'
    }

    player.animationState = 'swim'
  }

  const executeGoalkeeperBehavior = (player: Player, state: GameState, deltaTime: number) => {
    const ownGoal = getOwnGoal(player, state)
    const goalCenterY = ownGoal.position.y + ownGoal.height / 2
    const teamSkill = getTeamSkill(player.team)

    let targetY = goalCenterY
    let targetX = player.homePosition.x

    // Count attackers in our zone
    const opponents = getOpponents(player, state)
    const attackersInZone = opponents.filter((p) => {
      const inOurHalf = player.team === 'white'
        ? p.position.x < config.poolBounds.x + config.poolBounds.width / 2
        : p.position.x > config.poolBounds.x + config.poolBounds.width / 2
      return inOurHalf && p.role !== 'goalkeeper'
    })

    if (state.ball.holder && state.ball.holder.team !== player.team) {
      const holder = state.ball.holder
      const holderDistToGoal = distance(holder.position, { x: ownGoal.position.x, y: goalCenterY })

      // Anticipate shot based on ball holder's facing direction and position
      const facingGoal = player.team === 'white'
        ? holder.direction === 'left'
        : holder.direction === 'right'

      if (facingGoal && holderDistToGoal < 250) {
        // Predict where shot will go based on holder position
        const holderToGoal = {
          x: ownGoal.position.x - holder.position.x,
          y: goalCenterY - holder.position.y,
        }
        const predictedY = goalCenterY + holderToGoal.y * 0.4
        targetY = predictedY

        // Come out slightly to challenge if it's 1v1
        if (attackersInZone.length <= 1) {
          const challengeDistance = Math.min(30, holderDistToGoal * 0.1)
          targetX = player.team === 'white'
            ? player.homePosition.x + challengeDistance
            : player.homePosition.x - challengeDistance
        }
      } else {
        // Track ball position
        targetY = state.ball.position.y
      }
    } else if (state.ball.isInFlight) {
      // Predict where ball will cross goal line
      const timeToGoal = player.team === 'white'
        ? (ownGoal.position.x - state.ball.position.x) / (state.ball.velocity.x || 1)
        : (ownGoal.position.x - state.ball.position.x) / (state.ball.velocity.x || -1)

      if (timeToGoal > 0 && timeToGoal < 2) {
        const predictedBall = predictBallPosition(state, Math.min(0.5, timeToGoal))
        targetY = predictedBall.y
      }
    }

    // Clamp to goal area
    targetY = Math.max(
      ownGoal.position.y + 15,
      Math.min(ownGoal.position.y + ownGoal.height - 15, targetY)
    )

    // Stay closer to goal when outnumbered
    if (attackersInZone.length >= 2) {
      targetX = player.homePosition.x
    }

    const targetPosition = { x: targetX, y: targetY }
    moveTowards(player, targetPosition, deltaTime, 1.3 * teamSkill.speedMultiplier)
  }

  const executeState = (player: Player, state: GameState, deltaTime: number) => {
    const aiState = player.aiState
    const teamSkill = getTeamSkill(player.team)

    switch (aiState) {
      case 'goalkeeper':
        executeGoalkeeperBehavior(player, state, deltaTime)
        break

      case 'chase_ball': {
        // Predict ball position for smarter chasing
        const predictionTime = 0.3 * teamSkill.reactionSpeed
        const targetPos = state.ball.isInFlight
          ? predictBallPosition(state, predictionTime)
          : state.ball.position
        moveTowards(player, targetPos, deltaTime, 1.1)
        break
      }

      case 'attack': {
        const enemyGoal = getEnemyGoal(player, state)
        const goalCenter = {
          x: enemyGoal.position.x + enemyGoal.width / 2,
          y: enemyGoal.position.y + enemyGoal.height / 2,
        }

        // Check pressure and decide movement
        const pressure = calculatePressure(player, state)

        if (pressure > 0.6) {
          // Under heavy pressure - move to open space
          const opponents = getOpponents(player, state)
          let bestEscapeDir = { x: 0, y: 0 }
          let maxSpace = 0

          // Try different directions
          const directions = [
            { x: 1, y: 0 }, { x: -1, y: 0 },
            { x: 0, y: 1 }, { x: 0, y: -1 },
            { x: 0.7, y: 0.7 }, { x: 0.7, y: -0.7 },
            { x: -0.7, y: 0.7 }, { x: -0.7, y: -0.7 },
          ]

          for (const dir of directions) {
            const testPos = {
              x: player.position.x + dir.x * 50,
              y: player.position.y + dir.y * 50,
            }
            let minDist = Infinity
            for (const opp of opponents) {
              const d = distance(testPos, opp.position)
              if (d < minDist) minDist = d
            }
            if (minDist > maxSpace) {
              maxSpace = minDist
              bestEscapeDir = dir
            }
          }

          const escapeTarget = {
            x: player.position.x + bestEscapeDir.x * 80,
            y: player.position.y + bestEscapeDir.y * 80,
          }
          moveTowards(player, escapeTarget, deltaTime, 1.0)
        } else {
          // Advance toward goal
          const aggressiveness = teamSkill.decisionQuality * 0.5
          const targetPos = lerp(player.position, goalCenter, aggressiveness)
          moveTowards(player, targetPos, deltaTime, 1.0)
        }
        break
      }

      case 'defend': {
        const ownGoal = getOwnGoal(player, state)
        const goalCenter = {
          x: ownGoal.position.x + ownGoal.width / 2,
          y: ownGoal.position.y + ownGoal.height / 2,
        }

        // Position between ball and goal, but also mark nearest opponent
        const opponents = getOpponents(player, state).filter((p) => p.role !== 'goalkeeper')
        let nearestThreat: Player | null = null
        let nearestDist = Infinity

        for (const opp of opponents) {
          // Prioritize opponent with ball or closest to ball
          const distToBall = distance(opp.position, state.ball.position)
          const distToGoal = distance(opp.position, goalCenter)
          const threatScore = distToBall + distToGoal * 0.5

          if (threatScore < nearestDist) {
            nearestDist = threatScore
            nearestThreat = opp
          }
        }

        if (nearestThreat) {
          // Position between threat and goal
          const markPosition = lerp(nearestThreat.position, goalCenter, 0.3)
          moveTowards(player, markPosition, deltaTime, 1.0)
        } else {
          // Fall back to formation
          const formationPos = getFormationPosition(player, state)
          moveTowards(player, formationPos, deltaTime, 0.8)
        }
        break
      }

      case 'support': {
        const ballHolder = state.players.find((p) => p.hasBall)
        const enemyGoal = getEnemyGoal(player, state)

        if (ballHolder && ballHolder.id !== player.id) {
          // Create passing lane - position away from ball holder but toward goal
          const toGoal = normalize({
            x: enemyGoal.position.x - ballHolder.position.x,
            y: enemyGoal.position.y + enemyGoal.height / 2 - ballHolder.position.y,
          })

          // Perpendicular offset based on role
          const perpOffset = player.role === 'attacker' ? 60 : player.role === 'center' ? 0 : -60
          const supportPosition = {
            x: ballHolder.position.x + toGoal.x * 100 + (-toGoal.y) * perpOffset,
            y: ballHolder.position.y + toGoal.y * 100 + toGoal.x * perpOffset,
          }

          // Clamp to pool
          supportPosition.x = Math.max(
            config.poolBounds.x + 50,
            Math.min(config.poolBounds.x + config.poolBounds.width - 50, supportPosition.x)
          )
          supportPosition.y = Math.max(
            config.poolBounds.y + 50,
            Math.min(config.poolBounds.y + config.poolBounds.height - 50, supportPosition.y)
          )

          moveTowards(player, supportPosition, deltaTime, 0.9)
        } else {
          // Move to formation position
          const formationPos = getFormationPosition(player, state)
          moveTowards(player, formationPos, deltaTime, 0.8)
        }
        break
      }

      case 'intercept': {
        if (state.ball.isInFlight && state.ball.targetPosition) {
          // Predict interception point
          const ballSpeed = magnitude(state.ball.velocity)
          const timeToTarget = distance(state.ball.position, state.ball.targetPosition) / (ballSpeed || 1)
          const interceptTime = Math.min(0.5, timeToTarget * 0.6)
          const interceptPoint = predictBallPosition(state, interceptTime)

          // Only intercept if we can reach it
          const myTimeToIntercept = distance(player.position, interceptPoint) / (player.maxSpeed * 0.8)
          if (myTimeToIntercept < timeToTarget * 1.2) {
            moveTowards(player, interceptPoint, deltaTime, 1.3)
          } else {
            // Can't intercept, pressure the receiver
            moveTowards(player, state.ball.targetPosition, deltaTime, 1.1)
          }
        } else if (state.ball.holder) {
          // Pressure ball holder
          moveTowards(player, state.ball.holder.position, deltaTime, 1.1)
        }
        break
      }

      case 'return_position':
      default: {
        const formationPos = getFormationPosition(player, state)
        moveTowards(player, formationPos, deltaTime, 0.7)
        break
      }
    }
  }

  // Weighted decision system for AI passing
  const shouldAIPass = (player: Player, state: GameState): Player | null => {
    if (!player.hasBall || player.isControlled) return null

    const teamSkill = getTeamSkill(player.team)

    // Goalkeeper ALWAYS passes immediately
    if (player.role === 'goalkeeper') {
      const teammate = findOpenTeammate(player, state)
      if (teammate) return teammate

      const fieldPlayers = getTeammates(player, state).filter((p) => p.role !== 'goalkeeper')
      if (fieldPlayers.length > 0) {
        let bestPlayer: Player | null = fieldPlayers[0] ?? null
        let bestScore = 0
        for (const fp of fieldPlayers) {
          const score = evaluatePassOption(player, fp, state)
          if (score > bestScore) {
            bestScore = score
            bestPlayer = fp
          }
        }
        return bestPlayer
      }
      return null
    }

    // Evaluate all options
    const shootScore = evaluateShotOpportunity(player, state)
    const holdScore = evaluateHoldOption(player, state)

    // Find best pass option
    const teammates = getTeammates(player, state).filter((t) => t.role !== 'goalkeeper')
    let bestPassScore = 0
    let bestPassTarget: Player | null = null

    for (const t of teammates) {
      const score = evaluatePassOption(player, t, state)
      if (score > bestPassScore) {
        bestPassScore = score
        bestPassTarget = t
      }
    }

    // Apply decision quality (worse teams make suboptimal choices)
    const noise = (1 - teamSkill.decisionQuality) * 20
    const adjustedShootScore = shootScore + (Math.random() - 0.5) * noise
    const adjustedPassScore = bestPassScore + (Math.random() - 0.5) * noise
    const adjustedHoldScore = holdScore + (Math.random() - 0.5) * noise

    // Decision threshold - only act if score is high enough
    const actionThreshold = 55

    // Pressure forces action
    const pressure = calculatePressure(player, state)
    const pressureBonus = pressure * 25

    // Choose best action
    if (adjustedPassScore + pressureBonus > adjustedHoldScore && adjustedPassScore > actionThreshold) {
      // Check if passing is better than shooting
      if (adjustedPassScore > adjustedShootScore || shootScore < 60) {
        return bestPassTarget
      }
    }

    return null
  }

  // Weighted decision system for AI shooting
  const shouldAIShoot = (player: Player, state: GameState): Goal | null => {
    if (!player.hasBall || player.isControlled) return null
    if (player.role === 'goalkeeper') return null

    const teamSkill = getTeamSkill(player.team)
    const shootScore = evaluateShotOpportunity(player, state)
    const holdScore = evaluateHoldOption(player, state)

    // Find best pass option for comparison
    const teammates = getTeammates(player, state).filter((t) => t.role !== 'goalkeeper')
    let bestPassScore = 0
    for (const t of teammates) {
      const score = evaluatePassOption(player, t, state)
      if (score > bestPassScore) bestPassScore = score
    }

    // Apply decision noise
    const noise = (1 - teamSkill.decisionQuality) * 15
    const adjustedShootScore = shootScore + (Math.random() - 0.5) * noise

    // Shoot if it's clearly the best option
    const shootThreshold = 60
    if (adjustedShootScore > shootThreshold && adjustedShootScore > bestPassScore && adjustedShootScore > holdScore) {
      return getEnemyGoal(player, state)
    }

    // Pressure can force a shot
    const pressure = calculatePressure(player, state)
    if (pressure > 0.7 && shootScore > 40) {
      return getEnemyGoal(player, state)
    }

    return null
  }

  const updateAI = (state: GameState, deltaTime: number) => {
    for (const player of state.players) {
      if (player.isControlled) continue

      player.aiState = evaluateSituation(player, state)
      executeState(player, state, deltaTime)
    }
  }

  return {
    updateAI,
    shouldAIPass,
    shouldAIShoot,
    findOpenTeammate,
    findTeammateInDirection,
    getEnemyGoal,
    getOwnGoal,
    distance,
    calculatePressure,
    evaluatePassOption,
    evaluateShotOpportunity,
  }
}
