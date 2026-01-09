import { Platform, Player, Coin, Enemy, Checkpoint, PowerUp } from "./types";

// --- GAME PHYSICS CONSTANTS ---
// Oynanabilirlik için ince ayar yapıldı: Daha tok ve kontrollü zıplama hissi.
export const GRAVITY = 0.65; // Biraz azaltıldı, havada süzülme kontrolü arttı
export const TERMINAL_VELOCITY = 15;
export const FRICTION = 0.85; // Kayma hissi azaltıldı (daha keskin duruş)
export const ICE_FRICTION = 0.98; // Buz hala kaygan
export const WIND_FORCE = -0.15; 
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;
export const HOT_CHOCOLATE_DURATION = 600; // Süre uzatıldı (10 sn)

// Game Feel
export const COYOTE_TIME = 10; // Platformdan düştükten sonra zıplama toleransı arttırıldı
export const JUMP_BUFFER = 10; // Zıplama tuşu hafızası arttırıldı

// Level Boundaries
export const LEVEL_1_WIDTH = 16000; // Bölüm uzatıldı
export const LEVEL_2_WIDTH = 18000; 
export const LEVEL_3_WIDTH = 6000;  
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
    color: '#FF69B4', // Hot Pink
    isGrounded: false,
    jumpForce: -15.0, // Fizik ayarına göre optimize edildi
    moveSpeed: 1.4,   // Biraz hızlandırıldı
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
    color: '#1E90FF', // Dodger Blue
    isGrounded: false,
    jumpForce: -14.5,
    moveSpeed: 1.35,
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

// --- LEVEL 1: WINTER JOURNEY (YENİLENDİ: MAĞARA BULMACASI EKLENDİ) ---
export const getWinterPlatforms = (): Platform[] => [
  // Başlangıç Alanı
  { position: { x: -200, y: 600 }, size: { width: 1200, height: 200 }, type: 'ground', color: '#e2e8f0' },
  
  // İlk Parkur - Isınma
  { position: { x: 1100, y: 500 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 1400, y: 400 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 1700, y: 550 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  
  // Düşen Platformlar (Crumbly)
  { position: { x: 2000, y: 600 }, size: { width: 600, height: 200 }, type: 'ground', color: '#cbd5e1' },
  { position: { x: 2700, y: 500 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 60, maxFallTimer: 60, respawnTimer: 0 },
  { position: { x: 2900, y: 400 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 60, maxFallTimer: 60, respawnTimer: 0 },
  
  // --- PUZZLE BÖLÜMÜ: KAPALI KAPI VE MAĞARA ---
  // Üst yol (Kapalı)
  { position: { x: 3200, y: 350 }, size: { width: 400, height: 40 }, type: 'ground', color: '#475569' },
  { id: 101, position: { x: 3500, y: 150 }, size: { width: 40, height: 200 }, type: 'door', color: '#334155', isOpen: false }, // KAPI
  
  // Alt yol (Mağara Girişi) - Oyuncu buradan düşmeli
  { position: { x: 3200, y: 650 }, size: { width: 200, height: 20 }, type: 'ice', color: '#93c5fd' },
  { position: { x: 3500, y: 700 }, size: { width: 600, height: 40 }, type: 'ground', color: '#1e293b' }, // Mağara tabanı
  
  // BUTON (Plate) - Mağaranın sonunda, kapıyı açar
  { id: 102, linkId: 101, position: { x: 4000, y: 690 }, size: { width: 60, height: 10 }, type: 'plate', color: '#facc15', isPressed: false },
  
  // Mağaradan Çıkış (Mantar Merdiveni)
  { position: { x: 4200, y: 600 }, size: { width: 80, height: 60 }, type: 'mushroom', color: '#67e8f9', deformation: 0 },
  { position: { x: 4400, y: 450 }, size: { width: 80, height: 60 }, type: 'mushroom', color: '#67e8f9', deformation: 0 },
  
  // Kapıdan Sonraki Alan
  { position: { x: 3600, y: 350 }, size: { width: 800, height: 40 }, type: 'ground', color: '#475569' },
  
  // Orta Bölüm - Rüzgar Totemi Tanıtımı
  { position: { x: 4600, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#e2e8f0' },
  { position: { x: 5000, y: 500 }, size: { width: 60, height: 100 }, type: 'totem', color: '#64748b', isActive: false }, // Rüzgar kapalı başlıyor
  
  // Rüzgarla geçilecek geniş boşluk
  { position: { x: 5800, y: 400 }, size: { width: 100, height: 20 }, type: 'cloud', color: '#e0f2fe' },
  { position: { x: 6200, y: 350 }, size: { width: 100, height: 20 }, type: 'cloud', color: '#e0f2fe' },
  { position: { x: 6600, y: 300 }, size: { width: 100, height: 20 }, type: 'cloud', color: '#e0f2fe' },
  
  // İkinci Geniş Düzlük ve Düşman Ordusu
  { position: { x: 7000, y: 600 }, size: { width: 1500, height: 200 }, type: 'ground', color: '#cbd5e1' },
  
  // Zorlu Buz Parkuru
  { position: { x: 8600, y: 500 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 8900, y: 400 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 9200, y: 300 }, size: { width: 150, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 40 },
  { position: { x: 9500, y: 300 }, size: { width: 150, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 40 },
  
  // Bitiş Yolu
  { position: { x: 10000, y: 500 }, size: { width: 2000, height: 200 }, type: 'ground', color: '#e2e8f0' },
  { position: { x: 11500, y: 350 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
  
  // Duvarlar
  { position: { x: 12000, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#e2e8f0' },
];

export const getWinterCoins = (): Coin[] => [
    // Başlangıç
    { id: 1, position: { x: 1100, y: 450 }, size: 14, collected: false, baseY: 450, type: 'gold' },
    { id: 2, position: { x: 1400, y: 350 }, size: 14, collected: false, baseY: 350, type: 'kanelbulle' },
    { id: 3, position: { x: 1700, y: 500 }, size: 14, collected: false, baseY: 500, type: 'gold' },
    
    // Mağara İçi (Ödül)
    { id: 4, position: { x: 3300, y: 660 }, size: 14, collected: false, baseY: 660, type: 'hot-chocolate' },
    { id: 5, position: { x: 3800, y: 660 }, size: 14, collected: false, baseY: 660, type: 'gold' },
    { id: 6, position: { x: 3900, y: 660 }, size: 14, collected: false, baseY: 660, type: 'gold' },
    
    // Kapıdan sonraki üst yol
    { id: 7, position: { x: 3800, y: 300 }, size: 14, collected: false, baseY: 300, type: 'kanelbulle' },
    
    // Rüzgar Yolu
    { id: 8, position: { x: 5800, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    { id: 9, position: { x: 6200, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 10, position: { x: 6600, y: 250 }, size: 14, collected: false, baseY: 250, type: 'kanelbulle' },
    
    // Düzlük
    { id: 11, position: { x: 7500, y: 550 }, size: 14, collected: false, baseY: 550, type: 'hot-chocolate' },
    
    // Son Parkur
    { id: 12, position: { x: 9200, y: 250 }, size: 14, collected: false, baseY: 250, type: 'gold' },
    { id: 13, position: { x: 9500, y: 250 }, size: 14, collected: false, baseY: 250, type: 'gold' },
];

export const getWinterEnemies = (): Enemy[] => [
    // Giriş
    { id: 1, position: { x: 1300, y: 600 }, size: { width: 40, height: 50 }, type: 'snowman', color: '#fff', originalX: 1300, patrolDistance: 200, speed: 1.5 },
    
    // Mağara Muhafızları (Zorlu Kısım)
    { id: 2, position: { x: 3700, y: 640 }, size: { width: 60, height: 60 }, type: 'yeti', color: '#e2e8f0', originalX: 3700, patrolDistance: 200, speed: 2.5 },
    
    // Rüzgar Sonrası Karşılama
    { id: 3, position: { x: 7200, y: 550 }, size: { width: 40, height: 50 }, type: 'snowman', color: '#fff', originalX: 7200, patrolDistance: 300, speed: 2 },
    { id: 4, position: { x: 7800, y: 550 }, size: { width: 60, height: 60 }, type: 'yeti', color: '#e2e8f0', originalX: 7800, patrolDistance: 250, speed: 3 },
    
    // Hava Düşmanları
    { id: 5, position: { x: 6200, y: 200 }, size: { width: 40, height: 30 }, type: 'bird', color: '#1e293b', originalX: 6200, originalY: 200, patrolDistance: 150, speed: 3 },
    { id: 6, position: { x: 9000, y: 300 }, size: { width: 40, height: 30 }, type: 'bird', color: '#1e293b', originalX: 9000, originalY: 300, patrolDistance: 200, speed: 3.5 },
];

export const getWinterCheckpoints = (): Checkpoint[] => [
    { id: 1, position: { x: 2100, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, 
    { id: 2, position: { x: 4600, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, // Mağara çıkışı
    { id: 3, position: { x: 7000, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, 
    { id: 4, position: { x: 10000, y: 450 }, size: { width: 40, height: 60 }, triggered: false }, 
];

// --- LEVEL 2: BUTTERFLY VALLEY (YENİLENDİ: KOVAN TIRMANIŞI & RÜZGAR BULMACASI) ---
export const getButterflyPlatforms = (): Platform[] => [
  // Zemin
  { position: { x: -200, y: 600 }, size: { width: 1200, height: 200 }, type: 'ground', color: '#86efac' },
  
  // Yapraklar ile Yükseliş
  { position: { x: 1100, y: 500 }, size: { width: 150, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 1400, y: 400 }, size: { width: 150, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 1700, y: 300 }, size: { width: 150, height: 20 }, type: 'leaf', color: '#22c55e' },
  
  // Mantar Köprüsü
  { position: { x: 2000, y: 600 }, size: { width: 800, height: 200 }, type: 'ground', color: '#86efac' },
  { position: { x: 2300, y: 550 }, size: { width: 100, height: 80 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
  { position: { x: 2600, y: 550 }, size: { width: 100, height: 80 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
  
  // --- YENİ BÖLÜM: KOVAN ZİRVESİ ---
  { position: { x: 3200, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#86efac' },
  
  // Yüksek Tırmanış (Block tipi platformlar)
  { position: { x: 3500, y: 450 }, size: { width: 100, height: 20 }, type: 'block', color: '#eab308' }, // Bal Bloğu
  { position: { x: 3700, y: 350 }, size: { width: 100, height: 20 }, type: 'block', color: '#eab308' },
  { position: { x: 3500, y: 250 }, size: { width: 100, height: 20 }, type: 'block', color: '#eab308' },
  
  // Zirve Platformu ve Gizli Ödül
  { position: { x: 3800, y: 150 }, size: { width: 300, height: 20 }, type: 'leaf', color: '#22c55e' },
  
  // Aşağı İniş (Kaygan)
  { position: { x: 4200, y: 300 }, size: { width: 200, height: 20 }, type: 'slippery', color: '#86efac' },
  { position: { x: 4500, y: 450 }, size: { width: 200, height: 20 }, type: 'slippery', color: '#86efac' },
  
  // --- BULMACA: RÜZGAR KORİDORU ---
  { position: { x: 5000, y: 600 }, size: { width: 600, height: 200 }, type: 'ground', color: '#86efac' },
  
  // Totem (Rüzgarı açan anahtar) - Yüksekte, ulaşmak için mantar lazım
  { position: { x: 5300, y: 500 }, size: { width: 100, height: 60 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
  { position: { x: 5500, y: 250 }, size: { width: 60, height: 100 }, type: 'totem', color: '#166534', isActive: false }, // Yeşil totem
  
  // Rüzgarla geçilecek geniş yaprak serisi
  { position: { x: 5900, y: 400 }, size: { width: 100, height: 15 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 6300, y: 350 }, size: { width: 100, height: 15 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 6700, y: 400 }, size: { width: 100, height: 15 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 7100, y: 450 }, size: { width: 100, height: 15 }, type: 'leaf', color: '#22c55e' },
  
  // Güvenli Bölge
  { position: { x: 7500, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#86efac' },
  
  // Final Tırmanışı
  { position: { x: 8600, y: 500 }, size: { width: 150, height: 20 }, type: 'cloud', color: '#e0f2fe' },
  { position: { x: 8800, y: 400 }, size: { width: 150, height: 20 }, type: 'cloud', color: '#e0f2fe' },
  { position: { x: 9000, y: 300 }, size: { width: 150, height: 20 }, type: 'cloud', color: '#e0f2fe' },
  
  // Bitiş Portalı
  { position: { x: 9200, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#86efac' },
  { position: { x: 9500, y: 450 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
  
  { position: { x: 10200, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#86efac' },
];

export const getButterflyCoins = (): Coin[] => [
    { id: 201, position: { x: 1400, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    { id: 202, position: { x: 2300, y: 400 }, size: 14, collected: false, baseY: 400, type: 'kanelbulle' },
    
    // Kovan Zirvesi Ödülleri
    { id: 203, position: { x: 3500, y: 200 }, size: 14, collected: false, baseY: 200, type: 'gold' },
    { id: 204, position: { x: 3700, y: 100 }, size: 14, collected: false, baseY: 100, type: 'gold' },
    { id: 205, position: { x: 3900, y: 100 }, size: 14, collected: false, baseY: 100, type: 'hot-chocolate' },
    
    // Rüzgar Yolu
    { id: 206, position: { x: 5900, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    { id: 207, position: { x: 6300, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 208, position: { x: 6700, y: 350 }, size: 14, collected: false, baseY: 350, type: 'kanelbulle' },
    
    // Son Bölüm
    { id: 209, position: { x: 9000, y: 250 }, size: 14, collected: false, baseY: 250, type: 'gold' },
];

export const getButterflyEnemies = (): Enemy[] => [
    { id: 201, position: { x: 2000, y: 570 }, size: { width: 40, height: 30 }, type: 'slime', color: '#16a34a', originalX: 2000, patrolDistance: 300, speed: 2 },
    
    // Kovan Koruyucuları
    { id: 202, position: { x: 3800, y: 130 }, size: { width: 40, height: 30 }, type: 'bird', color: '#ef4444', originalX: 3800, originalY: 130, patrolDistance: 150, speed: 3.5 },
    
    // Totem Muhafızı
    { id: 203, position: { x: 5400, y: 570 }, size: { width: 60, height: 50 }, type: 'slime', color: '#16a34a', originalX: 5400, patrolDistance: 200, speed: 1.5 },
    
    // Rüzgar Tuzak Kuşları
    { id: 204, position: { x: 6100, y: 300 }, size: { width: 40, height: 30 }, type: 'bird', color: '#ef4444', originalX: 6100, originalY: 300, patrolDistance: 200, speed: 3 },
    { id: 205, position: { x: 6900, y: 350 }, size: { width: 40, height: 30 }, type: 'bird', color: '#ef4444', originalX: 6900, originalY: 350, patrolDistance: 200, speed: 3 },
    
    // Final Slime
    { id: 206, position: { x: 9300, y: 570 }, size: { width: 60, height: 50 }, type: 'slime', color: '#16a34a', originalX: 9300, patrolDistance: 300, speed: 2.5 },
];

export const getButterflyCheckpoints = (): Checkpoint[] => [
    { id: 201, position: { x: 2100, y: 550 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 202, position: { x: 5000, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, // Bulmaca öncesi
    { id: 203, position: { x: 7600, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, // Bulmaca sonrası
];

// --- LEVEL 3: FRUIT PARADISE (AYNI KALDI) ---
export const getFruitParadisePlatforms = (): Platform[] => [
    { position: { x: -200, y: 600 }, size: { width: 800, height: 200 }, type: 'ground', color: '#fbcfe8' },
    { position: { x: 700, y: 550 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 900, y: 500 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 1100, y: 450 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 1300, y: 500 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 1500, y: 550 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 1750, y: 600 }, size: { width: 150, height: 60 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
    { position: { x: 2000, y: 600 }, size: { width: 150, height: 60 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
    { position: { x: 2250, y: 600 }, size: { width: 150, height: 60 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
    { position: { x: 2500, y: 650 }, size: { width: 900, height: 150 }, type: 'ground', color: '#fbcfe8' },
    { position: { x: 2700, y: 550 }, size: { width: 100, height: 50 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
    { position: { x: 3100, y: 550 }, size: { width: 100, height: 50 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
    { position: { x: 3500, y: 500 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 3700, y: 400 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 3900, y: 350 }, size: { width: 100, height: 50 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
    { position: { x: 4100, y: 400 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 4300, y: 500 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 4550, y: 600 }, size: { width: 300, height: 60 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
    { position: { x: 4300, y: 350 }, size: { width: 100, height: 15 }, type: 'leaf', color: '#86efac' },
    { position: { x: 4500, y: 300 }, size: { width: 100, height: 15 }, type: 'leaf', color: '#86efac' },
    { position: { x: 4900, y: 650 }, size: { width: 800, height: 150 }, type: 'ground', color: '#fbcfe8' },
    { position: { x: 5600, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#fbcfe8' },
    { position: { x: 5300, y: 500 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
];

export const getFruitParadiseCoins = (): Coin[] => [
    { id: 301, position: { x: 100, y: 550 }, size: 16, collected: false, baseY: 550, type: 'apple' },
    { id: 302, position: { x: 200, y: 550 }, size: 16, collected: false, baseY: 550, type: 'banana' },
    { id: 303, position: { x: 300, y: 550 }, size: 14, collected: false, baseY: 550, type: 'cherry' },
    { id: 304, position: { x: 400, y: 550 }, size: 16, collected: false, baseY: 550, type: 'apple' },
    { id: 305, position: { x: 150, y: 500 }, size: 16, collected: false, baseY: 500, type: 'banana' },
    { id: 306, position: { x: 250, y: 500 }, size: 14, collected: false, baseY: 500, type: 'cherry' },
    { id: 307, position: { x: 350, y: 500 }, size: 16, collected: false, baseY: 500, type: 'apple' },
    { id: 308, position: { x: 450, y: 500 }, size: 16, collected: false, baseY: 500, type: 'banana' },
    { id: 333, position: { x: 2550, y: 600 }, size: 16, collected: false, baseY: 600, type: 'apple' },
    { id: 334, position: { x: 2650, y: 600 }, size: 16, collected: false, baseY: 600, type: 'banana' },
    { id: 335, position: { x: 2750, y: 600 }, size: 14, collected: false, baseY: 600, type: 'cherry' },
    { id: 350, position: { x: 2900, y: 500 }, size: 20, collected: false, baseY: 500, type: 'hot-chocolate' },
    { id: 383, position: { x: 5350, y: 550 }, size: 20, collected: false, baseY: 550, type: 'hot-chocolate' },
];

export const getFruitParadiseEnemies = (): Enemy[] => []; 

export const getFruitParadiseCheckpoints = (): Checkpoint[] => [
    { id: 301, position: { x: 1650, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, 
    { id: 302, position: { x: 2600, y: 600 }, size: { width: 40, height: 60 }, triggered: false }, 
];

// --- LEVEL 4: BOSS BATTLE (YENİLENMİŞ VERSİYON KORUNDU) ---
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
    { position: { x: 7000, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#64748b' },
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