import type { GameConfig, GameColors } from '~/types/game'

const GAME_COLORS: GameColors = {
  water: '#70BECF',
  waterLight: '#9ED2D5',
  waterDark: '#196CA0',
  poolEdge: '#73326D',
  laneLines: '#FFFFFF',
  whiteTeamCap: '#FCFBD9',
  whiteTeamBody: '#FFE4C4',
  blueTeamCap: '#196CA0',
  blueTeamBody: '#4A90A4',
  ball: '#FE6E81',
  goalFrame: '#FFFFFF',
  goalNet: '#CCCCCC',
}

const DEFAULT_CONFIG: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 480,
  poolBounds: {
    x: 40,
    y: 40,
    width: 720,
    height: 400,
  },
  spriteSize: 32,
  gameDuration: 90, // 1:30 match time
  waterDrag: 0.96, // Base drag (higher = less drag at low speeds)
  waterDragQuadratic: 0.0008, // Quadratic drag coefficient (faster = more resistance)
  playerAcceleration: 800,
  playerMaxSpeed: 200,
  passSpeed: 350,
  shotSpeed: 450,
  aiReactionTime: 150,
  goalWidth: 20,
  goalHeight: 100,
  colors: GAME_COLORS,
  // Advanced physics
  passAccuracyBase: 0.85, // 85% base accuracy
  goalkeeperStealChance: 0.80, // 80% goalkeeper steal chance (was 100%)
  staminaSprintThreshold: 50, // Speed above which stamina drains (lowered for better gameplay)
  staminaDrainRate: 12, // Stamina drain per second when sprinting
  staminaRecoveryRate: 8, // Stamina recovery per second when slow/still
  collisionStunDuration: 0.15, // 150ms stun after hard collision
  protectionZoneRadius: 80, // Goalkeeper protection zone radius
}

export function useGameConfig() {
  const config = reactive<GameConfig>({ ...DEFAULT_CONFIG })

  const getPoolCenter = () => ({
    x: config.poolBounds.x + config.poolBounds.width / 2,
    y: config.poolBounds.y + config.poolBounds.height / 2,
  })

  const getGoalPositions = () => ({
    left: {
      x: config.poolBounds.x,
      y: config.poolBounds.y + config.poolBounds.height / 2 - config.goalHeight / 2,
    },
    right: {
      x: config.poolBounds.x + config.poolBounds.width - config.goalWidth,
      y: config.poolBounds.y + config.poolBounds.height / 2 - config.goalHeight / 2,
    },
  })

  const getPlayerStartPositions = () => {
    const poolCenter = getPoolCenter()
    const quarterWidth = config.poolBounds.width / 4

    return {
      white: {
        goalkeeper: {
          x: config.poolBounds.x + 60,
          y: poolCenter.y,
        },
        attacker: {
          x: poolCenter.x - quarterWidth / 2,
          y: poolCenter.y - 80,
        },
        defender: {
          x: poolCenter.x - quarterWidth / 2,
          y: poolCenter.y + 80,
        },
      },
      blue: {
        goalkeeper: {
          x: config.poolBounds.x + config.poolBounds.width - 60,
          y: poolCenter.y,
        },
        attacker: {
          x: poolCenter.x + quarterWidth / 2,
          y: poolCenter.y - 80,
        },
        defender: {
          x: poolCenter.x + quarterWidth / 2,
          y: poolCenter.y + 80,
        },
      },
    }
  }

  return {
    config,
    getPoolCenter,
    getGoalPositions,
    getPlayerStartPositions,
  }
}
