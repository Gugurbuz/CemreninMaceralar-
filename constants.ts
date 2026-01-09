import { Platform, Player, Coin, Enemy, Checkpoint, PowerUp } from "./types";

// --- GAME PHYSICS CONSTANTS ---
export const GRAVITY = 0.65;
export const TERMINAL_VELOCITY = 15;
export const FRICTION = 0.85; 
export const ICE_FRICTION = 0.98;
export const WIND_FORCE = -0.15; 
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;
export const HOT_CHOCOLATE_DURATION = 600; 

// Game Feel
export const COYOTE_TIME = 10;
export const JUMP_BUFFER = 10;

// Level Boundaries (UZATILDI)
export const LEVEL_1_WIDTH = 18000; // ~14 Ekran
export const LEVEL_2_WIDTH = 20000; // ~16 Ekran
export const LEVEL_3_WIDTH = 8000;  
export const LEVEL_4_WIDTH = 10000; 

export const INITIAL_RESPAWN_POINT = { x: 100, y: 300 };

export const getInitialPlayers = (startingLives: number = 3): Player[] => [
  {
    id: 'cemre',
    name: 'Cemre',
    position: { x: 150, y: 500 },
    velocity: { x: 0, y: 0 },
    size: { width: 30, height: 45 },
    baseSize: { width: 30, height: 45 },
    scale: { x: 1, y: 1 },
    color: '#FF69B4', 
    isGrounded: false,
    jumpForce: -15.0,
    moveSpeed: 1.5,
    facing: 'right',
    animFrame: 0,
    lives: startingLives,
    isDead: false,
    buff: null,
    invincibleTimer: 0,
    activePowerUps: [],
    hasDoubleJump: false,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    mushroomCooldown: 0,
    standingOn: null
  },
  {
    id: 'baba',
    name: 'Baba',
    position: { x: 50, y: 500 },
    velocity: { x: 0, y: 0 },
    size: { width: 45, height: 65 },
    baseSize: { width: 45, height: 65 },
    scale: { x: 1, y: 1 },
    color: '#1E90FF',
    isGrounded: false,
    jumpForce: -16.0,
    moveSpeed: 1.25,
    facing: 'right',
    animFrame: 0,
    lives: startingLives,
    isDead: false,
    buff: null,
    invincibleTimer: 0,
    activePowerUps: [],
    hasDoubleJump: false,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    mushroomCooldown: 0,
    standingOn: null
  },
];

// --- LEVEL 1: UZUN KIŞ YOLCULUĞU ---
export const getWinterPlatforms = (): Platform[] => [
  // FAZ 1: DONMUŞ ORMAN (0 - 3000)
  { position: { x: -200, y: 600 }, size: { width: 1500, height: 200 }, type: 'ground', color: '#e2e8f0' },
  { position: { x: 1500, y: 500 }, size: { width: 200, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 1900, y: 400 }, size: { width: 200, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 2300, y: 550 }, size: { width: 200, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 2600, y: 600 }, size: { width: 400, height: 200 }, type: 'ground', color: '#cbd5e1' },
  
  // FAZ 2: MAĞARA GİRİŞİ VE BULMACA (3000 - 5000)
  // Üst Yol (Kapı ile kapalı)
  { position: { x: 3200, y: 350 }, size: { width: 500, height: 40 }, type: 'ground', color: '#475569' },
  { id: 101, position: { x: 3800, y: 150 }, size: { width: 40, height: 240 }, type: 'door', color: '#334155', isOpen: false }, 
  { position: { x: 3900, y: 350 }, size: { width: 1000, height: 40 }, type: 'ground', color: '#475569' },

  // Aşağı Düşüş (Mağara)
  { position: { x: 3300, y: 750 }, size: { width: 1600, height: 100 }, type: 'ground', color: '#1e293b' }, // Mağara Zemini
  
  // Buton (En Sağda)
  { id: 102, linkId: 101, position: { x: 4800, y: 740 }, size: { width: 60, height: 10 }, type: 'plate', color: '#facc15', isPressed: false },
  // Sağ Duvar
  { position: { x: 4900, y: 350 }, size: { width: 100, height: 600 }, type: 'ground', color: '#334155' },

  // Geri Dönüş Yolu (Sol Taraf)
  { position: { x: 3300, y: 650 }, size: { width: 80, height: 20 }, type: 'ice', color: '#bae6fd' }, 
  { position: { x: 3150, y: 550 }, size: { width: 80, height: 20 }, type: 'ice', color: '#bae6fd' }, 
  { position: { x: 3000, y: 450 }, size: { width: 80, height: 20 }, type: 'ice', color: '#bae6fd' },

  // FAZ 3: FIRTINA VADİSİ (5000 - 12000) - Uzun Düzlük
  { position: { x: 5000, y: 600 }, size: { width: 1500, height: 200 }, type: 'ground', color: '#e2e8f0' },
  { position: { x: 5500, y: 500 }, size: { width: 60, height: 100 }, type: 'totem', color: '#64748b', isActive: false }, // Rüzgarı aç
  
  // Rüzgarla geçilecek geniş boşluklar
  { position: { x: 6700, y: 450 }, size: { width: 120, height: 20 }, type: 'cloud', color: '#e0f2fe' },
  { position: { x: 7200, y: 400 }, size: { width: 120, height: 20 }, type: 'cloud', color: '#e0f2fe' },
  { position: { x: 7700, y: 350 }, size: { width: 120, height: 20 }, type: 'cloud', color: '#e0f2fe' },
  { position: { x: 8200, y: 400 }, size: { width: 120, height: 20 }, type: 'cloud', color: '#e0f2fe' },
  
  // Ara Dinlenme
  { position: { x: 8600, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#cbd5e1' },
  
  // Düşen Platform Serisi
  { position: { x: 9700, y: 500 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 40 },
  { position: { x: 10000, y: 450 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 40 },
  { position: { x: 10300, y: 400 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 40 },
  { position: { x: 10600, y: 350 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 40 },

  // FAZ 4: BUZDAN ZİRVE (12000 - 18000) - Tırmanış
  { position: { x: 11000, y: 600 }, size: { width: 2000, height: 200 }, type: 'ground', color: '#e2e8f0' },
  
  // Yüksek Buzullar
  { position: { x: 13200, y: 500 }, size: { width: 200, height: 20 }, type: 'ice', color: '#93c5fd' },
  { position: { x: 13600, y: 400 }, size: { width: 200, height: 20 }, type: 'ice', color: '#93c5fd' },
  { position: { x: 14000, y: 300 }, size: { width: 200, height: 20 }, type: 'ice', color: '#93c5fd' },
  
  // Zirve Düzlüğü
  { position: { x: 14500, y: 400 }, size: { width: 3000, height: 400 }, type: 'ground', color: '#fff' }, // Beyaz kar
  { position: { x: 17500, y: 250 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
  
  { position: { x: 18000, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#e2e8f0' },
];

export const getWinterCoins = (): Coin[] => [
    // Giriş
    { id: 1, position: { x: 1500, y: 450 }, size: 14, collected: false, baseY: 450, type: 'gold' },
    { id: 2, position: { x: 1900, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    
    // Mağara Yolu
    { id: 10, position: { x: 3500, y: 600 }, size: 14, collected: false, baseY: 600, type: 'gold' }, // Aşağı davet
    { id: 11, position: { x: 4200, y: 700 }, size: 14, collected: false, baseY: 700, type: 'gold' },
    { id: 12, position: { x: 4750, y: 700 }, size: 14, collected: false, baseY: 700, type: 'hot-chocolate' }, // Buton ödülü
    
    // Geri Dönüş
    { id: 20, position: { x: 3150, y: 500 }, size: 14, collected: false, baseY: 500, type: 'kanelbulle' },
    { id: 21, position: { x: 3000, y: 400 }, size: 14, collected: false, baseY: 400, type: 'gold' },
    
    // Fırtına Vadisi
    { id: 30, position: { x: 5500, y: 450 }, size: 14, collected: false, baseY: 450, type: 'gold' },
    { id: 31, position: { x: 6700, y: 400 }, size: 14, collected: false, baseY: 400, type: 'gold' },
    { id: 32, position: { x: 7700, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    
    // Ara Bölge
    { id: 40, position: { x: 9000, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 41, position: { x: 10300, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    
    // Zirve
    { id: 50, position: { x: 13600, y: 350 }, size: 14, collected: false, baseY: 350, type: 'hot-chocolate' },
    { id: 51, position: { x: 15000, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    { id: 52, position: { x: 16000, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
];

export const getWinterEnemies = (): Enemy[] => [
    { id: 1, position: { x: 2000, y: 600 }, size: { width: 40, height: 50 }, type: 'snowman', color: '#fff', originalX: 2000, patrolDistance: 300, speed: 1.5 },
    
    // Mağara
    { id: 2, position: { x: 4200, y: 740 }, size: { width: 60, height: 60 }, type: 'yeti', color: '#e2e8f0', originalX: 4200, patrolDistance: 400, speed: 2 },
    
    // Fırtına Vadisi
    { id: 3, position: { x: 6000, y: 600 }, size: { width: 40, height: 50 }, type: 'snowman', color: '#fff', originalX: 6000, patrolDistance: 500, speed: 2 },
    { id: 4, position: { x: 8800, y: 600 }, size: { width: 60, height: 60 }, type: 'yeti', color: '#e2e8f0', originalX: 8800, patrolDistance: 400, speed: 3 },
    
    // Hava Düşmanları (Bulutlarda)
    { id: 5, position: { x: 7200, y: 300 }, size: { width: 40, height: 30 }, type: 'bird', color: '#1e293b', originalX: 7200, originalY: 300, patrolDistance: 200, speed: 3 },
    
    // Zirve
    { id: 6, position: { x: 13000, y: 200 }, size: { width: 40, height: 30 }, type: 'bird', color: '#1e293b', originalX: 13000, originalY: 200, patrolDistance: 300, speed: 4 },
    { id: 7, position: { x: 15500, y: 400 }, size: { width: 60, height: 60 }, type: 'yeti', color: '#e2e8f0', originalX: 15500, patrolDistance: 500, speed: 2.5 },
];

export const getWinterCheckpoints = (): Checkpoint[] => [
    { id: 1, position: { x: 2500, y: 550 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 2, position: { x: 5200, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, // Mağara Çıkışı
    { id: 3, position: { x: 9000, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, // Fırtına Sonu
    { id: 4, position: { x: 14000, y: 350 }, size: { width: 40, height: 60 }, triggered: false }, // Zirve Başı
];

// --- LEVEL 2: KELEBEK VADİSİ (GENİŞLETİLMİŞ) ---
export const getButterflyPlatforms = (): Platform[] => [
  // FAZ 1: ÇİÇEK BAHÇELERİ (0 - 5000)
  { position: { x: -200, y: 600 }, size: { width: 1500, height: 200 }, type: 'ground', color: '#86efac' },
  { position: { x: 1500, y: 500 }, size: { width: 150, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 1800, y: 400 }, size: { width: 150, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 2100, y: 550 }, size: { width: 150, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 2500, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#86efac' },
  { position: { x: 3000, y: 550 }, size: { width: 100, height: 80 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
  
  // FAZ 2: BÜYÜK KOVAN TIRMANIŞI (5000 - 10000)
  { position: { x: 4000, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#86efac' },
  
  // Tırmanış Başlıyor
  { position: { x: 5200, y: 500 }, size: { width: 120, height: 20 }, type: 'block', color: '#eab308' },
  { position: { x: 5500, y: 400 }, size: { width: 120, height: 20 }, type: 'block', color: '#eab308' },
  { position: { x: 5200, y: 300 }, size: { width: 120, height: 20 }, type: 'block', color: '#eab308' },
  { position: { x: 5500, y: 200 }, size: { width: 120, height: 20 }, type: 'block', color: '#eab308' },
  
  // Ara Kat
  { position: { x: 5800, y: 200 }, size: { width: 500, height: 20 }, type: 'leaf', color: '#22c55e' },
  
  // Tırmanış Devam
  { position: { x: 6500, y: 250 }, size: { width: 120, height: 20 }, type: 'block', color: '#eab308' },
  { position: { x: 6800, y: 350 }, size: { width: 120, height: 20 }, type: 'block', color: '#eab308' },
  { position: { x: 7100, y: 450 }, size: { width: 120, height: 20 }, type: 'block', color: '#eab308' },
  
  // Kovanın Zirvesi
  { position: { x: 7500, y: 500 }, size: { width: 800, height: 100 }, type: 'ground', color: '#fcd34d' }, // Bal rengi zemin

  // FAZ 3: RÜZGAR KORİDORU (8000 - 15000)
  { position: { x: 8500, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#86efac' },
  { position: { x: 9000, y: 250 }, size: { width: 60, height: 100 }, type: 'totem', color: '#166534', isActive: false }, 
  { position: { x: 8800, y: 500 }, size: { width: 100, height: 60 }, type: 'mushroom', color: '#fca5a5', deformation: 0 }, // Toteme çıkış

  // Rüzgarlı Yapraklar
  { position: { x: 9600, y: 400 }, size: { width: 100, height: 15 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 10100, y: 350 }, size: { width: 100, height: 15 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 10600, y: 400 }, size: { width: 100, height: 15 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 11100, y: 450 }, size: { width: 100, height: 15 }, type: 'leaf', color: '#22c55e' },
  
  // Güvenli Ada
  { position: { x: 11500, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#86efac' },
  
  // Kaygan İniş
  { position: { x: 12800, y: 500 }, size: { width: 300, height: 20 }, type: 'slippery', color: '#86efac' },
  { position: { x: 13300, y: 600 }, size: { width: 300, height: 20 }, type: 'slippery', color: '#86efac' },

  // FAZ 4: BULUT KRALLIĞI (15000 - 20000)
  { position: { x: 14000, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#86efac' },
  
  // Yüksek Bulutlar
  { position: { x: 15500, y: 500 }, size: { width: 150, height: 20 }, type: 'cloud', color: '#e0f2fe' },
  { position: { x: 15800, y: 400 }, size: { width: 150, height: 20 }, type: 'cloud', color: '#e0f2fe' },
  { position: { x: 16100, y: 300 }, size: { width: 150, height: 20 }, type: 'cloud', color: '#e0f2fe' },
  { position: { x: 16400, y: 400 }, size: { width: 150, height: 20 }, type: 'cloud', color: '#e0f2fe' },
  { position: { x: 16700, y: 500 }, size: { width: 150, height: 20 }, type: 'cloud', color: '#e0f2fe' },
  
  // Final
  { position: { x: 17200, y: 600 }, size: { width: 2800, height: 200 }, type: 'ground', color: '#86efac' },
  { position: { x: 19500, y: 450 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
  
  { position: { x: 20000, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#86efac' },
];

export const getButterflyCoins = (): Coin[] => [
    { id: 201, position: { x: 1500, y: 450 }, size: 14, collected: false, baseY: 450, type: 'gold' },
    { id: 202, position: { x: 2100, y: 500 }, size: 14, collected: false, baseY: 500, type: 'gold' },
    { id: 203, position: { x: 3000, y: 500 }, size: 14, collected: false, baseY: 500, type: 'kanelbulle' },
    
    // Kovan Tırmanışı
    { id: 210, position: { x: 5500, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    { id: 211, position: { x: 5800, y: 150 }, size: 14, collected: false, baseY: 150, type: 'hot-chocolate' },
    { id: 212, position: { x: 7100, y: 400 }, size: 14, collected: false, baseY: 400, type: 'gold' },
    
    // Rüzgar Yolu
    { id: 220, position: { x: 9600, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    { id: 221, position: { x: 10600, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    
    // Bulutlar
    { id: 230, position: { x: 16100, y: 250 }, size: 14, collected: false, baseY: 250, type: 'gold' },
    { id: 231, position: { x: 19500, y: 250 }, size: 14, collected: false, baseY: 250, type: 'kanelbulle' },
];

export const getButterflyEnemies = (): Enemy[] => [
    { id: 201, position: { x: 2500, y: 570 }, size: { width: 40, height: 30 }, type: 'slime', color: '#16a34a', originalX: 2500, patrolDistance: 300, speed: 2 },
    
    // Kovan Koruyucuları
    { id: 202, position: { x: 5800, y: 150 }, size: { width: 40, height: 30 }, type: 'bird', color: '#ef4444', originalX: 5800, originalY: 150, patrolDistance: 200, speed: 3 },
    { id: 203, position: { x: 7500, y: 470 }, size: { width: 60, height: 50 }, type: 'slime', color: '#16a34a', originalX: 7500, patrolDistance: 400, speed: 2 },
    
    // Rüzgar Yolu
    { id: 204, position: { x: 9000, y: 570 }, size: { width: 60, height: 50 }, type: 'slime', color: '#16a34a', originalX: 9000, patrolDistance: 200, speed: 1.5 },
    { id: 205, position: { x: 10100, y: 300 }, size: { width: 40, height: 30 }, type: 'bird', color: '#ef4444', originalX: 10100, originalY: 300, patrolDistance: 200, speed: 3.5 },
    
    // Bulutlar
    { id: 206, position: { x: 16100, y: 250 }, size: { width: 40, height: 30 }, type: 'bird', color: '#ef4444', originalX: 16100, originalY: 250, patrolDistance: 300, speed: 4 },
];

export const getButterflyCheckpoints = (): Checkpoint[] => [
    { id: 201, position: { x: 2500, y: 550 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 202, position: { x: 7500, y: 450 }, size: { width: 40, height: 60 }, triggered: false }, // Kovan Tepesi
    { id: 203, position: { x: 11500, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, // Bulut Öncesi
    { id: 204, position: { x: 17200, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, // Final Düzlüğü
];

// --- LEVEL 3: FRUIT PARADISE (BİRAZ UZATILDI) ---
export const getFruitParadisePlatforms = (): Platform[] => [
    { position: { x: -200, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#fbcfe8' },
    
    // Bulut Yolu
    { position: { x: 1000, y: 550 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 1300, y: 500 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 1600, y: 450 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    
    // Mantar Bahçesi
    { position: { x: 2000, y: 600 }, size: { width: 1500, height: 200 }, type: 'ground', color: '#fbcfe8' },
    { position: { x: 2300, y: 550 }, size: { width: 150, height: 60 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
    { position: { x: 2700, y: 550 }, size: { width: 150, height: 60 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
    { position: { x: 3100, y: 550 }, size: { width: 150, height: 60 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
    
    // Yüksek Atlama
    { position: { x: 4000, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#fbcfe8' },
    { position: { x: 4500, y: 500 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 4800, y: 400 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 5100, y: 300 }, size: { width: 150, height: 60 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
    { position: { x: 5400, y: 400 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    
    // Final
    { position: { x: 6000, y: 600 }, size: { width: 2000, height: 200 }, type: 'ground', color: '#fbcfe8' },
    { position: { x: 7500, y: 450 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
    { position: { x: 8000, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#fbcfe8' },
];

export const getFruitParadiseCoins = (): Coin[] => [
    { id: 301, position: { x: 1000, y: 500 }, size: 16, collected: false, baseY: 500, type: 'apple' },
    { id: 302, position: { x: 2300, y: 500 }, size: 16, collected: false, baseY: 500, type: 'banana' },
    { id: 303, position: { x: 2700, y: 450 }, size: 14, collected: false, baseY: 450, type: 'cherry' },
    { id: 304, position: { x: 5100, y: 250 }, size: 20, collected: false, baseY: 250, type: 'hot-chocolate' },
    { id: 305, position: { x: 7500, y: 500 }, size: 20, collected: false, baseY: 500, type: 'kanelbulle' },
];

export const getFruitParadiseEnemies = (): Enemy[] => []; 

export const getFruitParadiseCheckpoints = (): Checkpoint[] => [
    { id: 301, position: { x: 2000, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, 
    { id: 302, position: { x: 4000, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, 
];

// --- LEVEL 4: BOSS BATTLE (KORUNDU) ---
export const getBossLevelPlatforms = (): Platform[] => [
    { position: { x: -200, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#475569' },
    { position: { x: 900, y: 550 }, size: { width: 150, height: 20 }, type: 'block', color: '#94a3b8' },
    { position: { x: 1200, y: 650 }, size: { width: 3500, height: 150 }, type: 'ground', color: '#64748b' },
    { position: { x: 1400, y: 500 }, size: { width: 180, height: 20 }, type: 'block', color: '#94a3b8' },
    { position: { x: 1650, y: 380 }, size: { width: 180, height: 20 }, type: 'block', color: '#94a3b8' },
    { position: { x: 1400, y: 260 }, size: { width: 180, height: 20 }, type: 'crumbly', color: '#94a3b8', isFalling: false, fallTimer: 60, maxFallTimer: 60, respawnTimer: 0 },
    { position: { x: 2300, y: 570 }, size: { width: 120, height: 80 }, type: 'mushroom', color: '#60a5fa', deformation: 0 },
    { position: { x: 2650, y: 570 }, size: { width: 120, height: 80 }, type: 'mushroom', color: '#60a5fa', deformation: 0 },
    { position: { x: 2475, y: 400 }, size: { width: 150, height: 20 }, type: 'block', color: '#94a3b8' },
    { position: { x: 2475, y: 250 }, size: { width: 150, height: 20 }, type: 'cloud', color: '#e0f2fe' },
    { position: { x: 3100, y: 500 }, size: { width: 180, height: 20 }, type: 'block', color: '#94a3b8' },
    { position: { x: 3350, y: 350 }, size: { width: 180, height: 20 }, type: 'block', color: '#94a3b8' },
    { position: { x: 3650, y: 480 }, size: { width: 180, height: 20 }, type: 'leaf', color: '#86efac' },
    { position: { x: 4000, y: 350 }, size: { width: 180, height: 20 }, type: 'crumbly', color: '#94a3b8', isFalling: false, fallTimer: 60, maxFallTimer: 60, respawnTimer: 0 },
    { position: { x: 1900, y: 600 }, size: { width: 200, height: 50 }, type: 'ice', color: '#93c5fd' },
    { position: { x: 3400, y: 600 }, size: { width: 200, height: 50 }, type: 'ice', color: '#93c5fd' },
    { position: { x: 1200, y: 500 }, size: { width: 80, height: 150 }, type: 'block', color: '#64748b' },
    { position: { x: 4620, y: 500 }, size: { width: 80, height: 150 }, type: 'block', color: '#64748b' },
    { position: { x: 5000, y: 600 }, size: { width: 2000, height: 200 }, type: 'ground', color: '#475569' },
    { position: { x: 5700, y: 450 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
    { position: { x: 10000, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#64748b' },
];

export const getBossLevelCoins = (): Coin[] => [
    { id: 401, position: { x: 1450, y: 450 }, size: 14, collected: false, baseY: 450, type: 'hot-chocolate' },
    { id: 406, position: { x: 2525, y: 350 }, size: 14, collected: false, baseY: 350, type: 'hot-chocolate' },
    { id: 415, position: { x: 6100, y: 500 }, size: 14, collected: false, baseY: 500, type: 'hot-chocolate' },
];

export const getBossLevelEnemies = (): Enemy[] => [
    {
        id: 999,
        position: { x: 2800, y: 400 },
        size: { width: 150, height: 200 },
        type: 'boss',
        color: '#94a3b8',
        health: 12,
        maxHealth: 12,
        phase: 1,
        attackTimer: 0,
        attackCooldown: 0,
        isAttacking: false,
        attackType: 'slam',
        isInvincible: false,
        shieldActive: false,
        originalX: 2800,
        patrolDistance: 500,
        speed: 1.5,
        direction: 1,
        isDashing: false,
        hitFlash: 0
    }
];

export const getBossLevelCheckpoints = (): Checkpoint[] => [
    { id: 401, position: { x: 950, y: 500 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 402, position: { x: 4600, y: 550 }, size: { width: 40, height: 60 }, triggered: false },
];

export const getBossLevelPowerUps = (): PowerUp[] => [
    { id: 1, position: { x: 1240, y: 470 }, size: { width: 30, height: 30 }, type: 'shield', collected: false, baseY: 470, duration: 360 },
    { id: 2, position: { x: 4660, y: 470 }, size: { width: 30, height: 30 }, type: 'shield', collected: false, baseY: 470, duration: 360 },
    { id: 3, position: { x: 2475, y: 370 }, size: { width: 30, height: 30 }, type: 'double_jump', collected: false, baseY: 370, duration: 420 },
    { id: 4, position: { x: 2525, y: 220 }, size: { width: 30, height: 30 }, type: 'star', collected: false, baseY: 220, duration: 240 },
    { id: 5, position: { x: 3400, y: 320 }, size: { width: 30, height: 30 }, type: 'speed', collected: false, baseY: 320, duration: 300 },
];