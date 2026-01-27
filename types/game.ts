// ============ VECTOR & GEOMETRY ============
export interface Vector2D {
  x: number
  y: number
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

// ============ SPRITE SYSTEM ============
export interface SpriteFrame {
  x: number
  y: number
  width: number
  height: number
}

export interface SpriteAnimation {
  name: string
  frames: SpriteFrame[]
  frameRate: number
  loop: boolean
}

export interface Sprite {
  image: HTMLImageElement | null
  animations: Map<string, SpriteAnimation>
  currentAnimation: string
  currentFrame: number
  frameTimer: number
}

// ============ PLAYER ENTITIES ============
export type TeamType = 'white' | 'blue'
export type PlayerRole = 'attacker' | 'defender' | 'goalkeeper'
export type PlayerDirection = 'up' | 'down' | 'left' | 'right'
export type AIState =
  | 'idle'
  | 'chase_ball'
  | 'attack'
  | 'defend'
  | 'support'
  | 'return_position'
  | 'intercept'
  | 'goalkeeper'

export interface Player {
  id: string
  position: Vector2D
  velocity: Vector2D
  team: TeamType
  role: PlayerRole
  isControlled: boolean
  hasBall: boolean
  stamina: number
  maxSpeed: number
  direction: PlayerDirection
  aiState: AIState
  targetPosition: Vector2D | null
  homePosition: Vector2D
  animationState: 'idle' | 'swim'
  frameIndex: number
  frameTimer: number
}

// ============ BALL ============
export interface Ball {
  position: Vector2D
  velocity: Vector2D
  holder: Player | null
  isInFlight: boolean
  targetPosition: Vector2D | null
  frameIndex: number
  frameTimer: number
}

// ============ GOAL ============
export interface Goal {
  team: TeamType
  position: Vector2D
  width: number
  height: number
  bounds: Rect
}

// ============ GAME STATE ============
export type GamePhase = 'menu' | 'countdown' | 'playing' | 'paused' | 'goal_scored' | 'game_over'

export interface Score {
  white: number
  blue: number
}

export interface GameState {
  phase: GamePhase
  score: Score
  time: number
  players: Player[]
  ball: Ball
  goals: Goal[]
  controlledPlayerId: string
  lastGoalTeam: TeamType | null
  countdownValue: number
}

// ============ INPUT ============
export interface InputState {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  pass: boolean
  shoot: boolean
  pause: boolean
  switchPlayer: boolean
}

// ============ GAME CONFIG ============
export interface GameColors {
  water: string
  waterLight: string
  waterDark: string
  poolEdge: string
  laneLines: string
  whiteTeamCap: string
  whiteTeamBody: string
  blueTeamCap: string
  blueTeamBody: string
  ball: string
  goalFrame: string
  goalNet: string
}

export interface GameConfig {
  canvasWidth: number
  canvasHeight: number
  poolBounds: Rect
  spriteSize: number
  gameDuration: number
  waterDrag: number
  waterDragQuadratic: number // Velocity-dependent drag coefficient
  playerAcceleration: number
  playerMaxSpeed: number
  passSpeed: number
  shotSpeed: number
  aiReactionTime: number
  goalWidth: number
  goalHeight: number
  colors: GameColors
  // Advanced physics
  passAccuracyBase: number // Base pass accuracy (0-1)
  goalkeeperStealChance: number // Goalkeeper steal success rate (0-1)
  staminaSprintThreshold: number // Speed above which stamina drains
  staminaDrainRate: number // Stamina drain per second when sprinting
  staminaRecoveryRate: number // Stamina recovery per second when slow/still
  collisionStunDuration: number // Brief stun after hard collision (seconds)
  protectionZoneRadius: number // Goalkeeper protection zone radius
}

// ============ AUDIO ============
export interface GameAudio {
  whistle: HTMLAudioElement | null
  splash: HTMLAudioElement | null
  goal: HTMLAudioElement | null
}
