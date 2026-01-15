
export interface Vector2 {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Player {
  id: 'cemre' | 'baba';
  position: Vector2;
  velocity: Vector2;
  size: Size;
  baseSize: Size;
  scale: Vector2;
  color: string;
  isGrounded: boolean;
  name: string;
  jumpForce: number;
  moveSpeed: number;
  facing: 'left' | 'right';
  animFrame: number;
  lives: number;
  isDead: boolean;
  buff: { type: 'warmth'; timer: number } | null;
  invincibleTimer: number;
  activePowerUps: Array<{ type: PowerUp['type']; timer: number }>;
  hasDoubleJump: boolean;
  deathProtection: boolean;
  iceThrowCooldown: number;

  coyoteTimer: number;
  jumpBufferTimer: number;
  mushroomCooldown: number;
  standingOn: Platform['type'] | null;

  isWallSliding: boolean;
  wallSlideDirection: 'left' | 'right' | null;
  wallJumpCooldown: number;
  canWallJump: boolean;

  isDashing: boolean;
  dashCooldown: number;
  dashTimer: number;
  dashDirection: Vector2;

  isGroundPounding: boolean;
  groundPoundCooldown: number;

  isLedgeGrabbing: boolean;
  ledgeGrabPlatform: Platform | null;

  comboCount: number;
  comboTimer: number;

  reviveTimer: number;
  canBeRevived: boolean;
}

export interface Platform {
  id?: number;
  position: Vector2;
  size: Size;
  type: 'ground' | 'block' | 'pipe' | 'finish' | 'ice' | 'slippery' | 'crumbly' | 'door' | 'plate' | 'aurora' | 'leaf' | 'mushroom' | 'totem' | 'cloud' | 'moving' | 'spike' | 'timed_button' | 'conveyor' | 'toggle_platform' | 'gravity_flip' | 'teleport_pad' | 'size_changer' | 'mirror' | 'rhythm' | 'destructible' | 'lava' | 'wind_zone' | 'bounce_pad' | 'laser' | 'gear';
  color: string;
  isPressed?: boolean;
  isOpen?: boolean;
  isFalling?: boolean;
  fallTimer?: number;
  maxFallTimer?: number;
  respawnTimer?: number;
  linkId?: number;
  requiresCoop?: boolean;
  deformation?: number;
  isActive?: boolean;
  moveSpeed?: number;
  moveDistance?: number;
  moveDirection?: 'horizontal' | 'vertical';
  originalPosition?: Vector2;
  movePhase?: number;
  spikeTimer?: number;
  spikeMaxTimer?: number;
  spikeActive?: boolean;
  buttonTimer?: number;
  buttonMaxTimer?: number;
  conveyorSpeed?: number;
  linkedPlatformIds?: number[];
  isVisible?: boolean;
  teleportTargetId?: number;
  sizeChangeType?: 'grow' | 'shrink';
  rhythmBPM?: number;
  rhythmPhase?: number;
  health?: number;
  maxHealth?: number;
  windDirection?: Vector2;
  windStrength?: number;
  laserTimer?: number;
  laserMaxTimer?: number;
  laserActive?: boolean;
  gearSpeed?: number;
  gearDirection?: 1 | -1;
}

export interface Coin {
  id: number;
  position: Vector2;
  size: number; // radius
  collected: boolean;
  baseY: number; // for bobbing animation
  type: 'gold' | 'kanelbulle' | 'hot-chocolate' | 'apple' | 'cherry' | 'banana';
  isNectarDrop?: boolean; // For win cinematic
}

export interface PowerUp {
  id: number;
  position: Vector2;
  size: Size;
  type: 'shield' | 'speed' | 'double_jump' | 'magnet' | 'star' | 'ice_throw' | 'giant' | 'ghost' | 'time_slow' | 'clone' | 'grapple' | 'bomb' | 'flight' | 'laser_beam' | 'gravity_boots';
  collected: boolean;
  baseY: number;
  duration: number;
}

export interface Enemy {
  id: number;
  position: Vector2;
  size: Size;
  type: 'slime' | 'snowman' | 'yeti' | 'bird' | 'boss' | 'shooter' | 'chaser' | 'jumper' | 'ghost' | 'turret' | 'mimic' | 'shield_enemy' | 'bat' | 'spider' | 'golem' | 'eagle' | 'wind_elemental' | 'robot' | 'mini_boss';
  color: string;
  health?: number;
  maxHealth?: number;
  phase?: number;
  attackTimer?: number;
  attackCooldown?: number;
  isAttacking?: boolean;
  attackType?: 'slam' | 'dash' | 'projectile' | 'summon' | 'charge' | 'spin' | 'laser';
  isInvincible?: boolean;
  shieldActive?: boolean;
  originalX?: number;
  patrolDistance?: number;
  speed?: number;
  direction?: 1 | -1;
  originalY?: number;
  dashTarget?: Vector2;
  isDashing?: boolean;
  hitFlash?: number;
  shootCooldown?: number;
  shootMaxCooldown?: number;
  chaseRange?: number;
  isChasing?: boolean;
  jumpTimer?: number;
  jumpMaxTimer?: number;
  isJumping?: boolean;
  velocityY?: number;
  frozenTimer?: number;
  isVisible?: boolean;
  fadeTimer?: number;
  rotationAngle?: number;
  isDisguised?: boolean;
  shieldDirection?: 'front' | 'back';
  chargeTimer?: number;
  isCharging?: boolean;
  spinTimer?: number;
  isSpinning?: boolean;
  laserCooldown?: number;
  isFiringLaser?: boolean;
  miniBossType?: 'cave_monster' | 'storm_lord' | 'giant_robot';
}

export interface Checkpoint {
  id: number;
  position: Vector2;
  size: Size;
  triggered: boolean;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number; // frames
  vy: number;
}

export interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  angle: number;
}

export interface EffectParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'dust' | 'splash';
}

export interface Projectile {
  id: number;
  position: Vector2;
  velocity: Vector2;
  size: number;
  type: 'ice_ball' | 'shockwave' | 'player_ice';
  damage: number;
  life: number;
  fromPlayer?: boolean;
}

export interface AuroraCrystal {
  id: number;
  position: Vector2;
  size: Size;
  collected: boolean;
  glowPhase: number;
}

export interface GameConfig {
    mode: 'solo' | 'multi';
    character: 'cemre' | 'baba' | null;
    lives: number;
    level: number;
}

export interface GameState {
  level: number;
  gameMode: 'solo' | 'multi' | 'race' | 'coin_battle' | 'survival';
  runConfig: GameConfig;
  players: Player[];
  platforms: Platform[];
  coins: Coin[];
  powerUps: PowerUp[];
  enemies: Enemy[];
  checkpoints: Checkpoint[];
  floatingTexts: FloatingText[];
  projectiles: Projectile[];
  auroraCrystals: AuroraCrystal[];
  camera: Vector2;
  status: 'menu' | 'playing' | 'won' | 'gameover' | 'transition' | 'paused';
  score: number;
  globalTime: number;
  activeRespawnPoint: Vector2;
  windActive: boolean;
  canTeleport: boolean;
  screenShake: number;
  coinsCollected: number;
  enemiesDefeated: number;
  deathCount: number;
  perfectJumps: number;
  powerUpsUsed: number;
  portalHoldTimer: number;
  cinematicMode: 'none' | 'aurora_suction' | 'nectar_rain';
  bossPhaseTransition: boolean;
  crystalsCollected: number;
  gravityDirection: 1 | -1;
  timeScale: number;
  playerClones: Player[];
  wallJumps: number;
  dashesUsed: number;
  groundPounds: number;
  comboMultiplier: number;
  maxCombo: number;
  secretsFound: number;
  miniBossesDefeated: number;
  torchesLit: number;
  lightsActive: boolean;
}

export interface DailyChallenge {
  id: string;
  date: string;
  type: 'speed_run' | 'no_death' | 'coin_master' | 'enemy_hunter' | 'perfect_run';
  level: number;
  targetValue: number;
  reward: number;
  completed: boolean;
}

export interface ReplayFrame {
  timestamp: number;
  playerPositions: Vector2[];
  playerVelocities: Vector2[];
  inputs: { [key: string]: boolean };
}

export interface Replay {
  id: string;
  playerName: string;
  level: number;
  score: number;
  frames: ReplayFrame[];
  duration: number;
  createdAt: string;
}

export interface InputState {
  [key: string]: boolean;
}
