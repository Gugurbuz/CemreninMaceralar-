
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Player, GameState, Particle, EffectParticle } from '../types';
import {
  getInitialPlayers,
  getWinterPlatforms, getWinterCoins, getWinterEnemies, getWinterCheckpoints,
  getButterflyPlatforms, getButterflyCoins, getButterflyEnemies, getButterflyCheckpoints,
  getFruitParadisePlatforms, getFruitParadiseCoins, getFruitParadiseEnemies, getFruitParadiseCheckpoints,
  getBossLevelPlatforms, getBossLevelCoins, getBossLevelEnemies, getBossLevelCheckpoints, getBossLevelPowerUps,
  INITIAL_RESPAWN_POINT,
  CANVAS_WIDTH, CANVAS_HEIGHT
} from '../constants';
import { soundManager } from '../utils/SoundManager';
import { useGameInput } from '../hooks/useGameInput';
import { useGameRenderer } from '../hooks/useGameRenderer';
import { useGamePhysics } from '../hooks/useGamePhysics';
import { MobileControls } from './MobileControls';

// Separate interface for React UI State (Decoupled from Engine)
interface HUDState {
    score: number;
    time: number;
    level: number;
    windActive: boolean;
    canTeleport: boolean;
    players: { id: string; name: string; color: string; lives: number; isDead: boolean }[];
}

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const debugRef = useRef<HTMLDivElement>(null);

  // Time Step Refs
  const lastTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);
  const FIXED_TIMESTEP = 1000 / 60; 

  const [gameStatus, setGameStatus] = useState<'menu' | 'playing' | 'paused' | 'won' | 'gameover' | 'transition'>('menu');
  const [menuStep, setMenuStep] = useState<'mode_select' | 'char_select' | 'lives_select' | 'level_select'>('mode_select');
  
  // Selection State
  const [selectedMode, setSelectedMode] = useState<'solo' | 'multi' | null>(null);
  const [selectedChar, setSelectedChar] = useState<'cemre' | 'baba' | null>(null);
  const [selectedLives, setSelectedLives] = useState<number>(3);
  
  // UI State (Synced from engine)
  const [hudState, setHudState] = useState<HUDState>({
      score: 0,
      time: 0,
      level: 1,
      windActive: false,
      canTeleport: false,
      players: []
  });

  const [isMuted, setIsMuted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogText, setDialogText] = useState<{name:string, text:string}[]>([]);
  const dialogTimeoutRef = useRef<number | null>(null);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const [tutorialState, setTutorialState] = useState({
      moved: false,
      jumped: false,
      completed: false
  });
  
  const tutorialStateRef = useRef({ moved: false, jumped: false });
  const lastPauseToggle = useRef<number>(0);

  // Game State Refs
  const gameState = useRef<GameState>({
    level: 1,
    gameMode: 'multi',
    runConfig: { mode: 'multi', character: null, lives: 3, level: 1 }, // Default config
    players: getInitialPlayers(3),
    platforms: getWinterPlatforms(),
    coins: getWinterCoins(),
    powerUps: [],
    enemies: getWinterEnemies(),
    checkpoints: getWinterCheckpoints(),
    floatingTexts: [],
    camera: { x: 0, y: 0 },
    status: 'menu',
    score: 0,
    globalTime: 0,
    activeRespawnPoint: INITIAL_RESPAWN_POINT,
    windActive: false,
    canTeleport: false,
    screenShake: 0,
    portalHoldTimer: 0,
    cinematicMode: 'none',
    coinsCollected: 0,
    enemiesDefeated: 0,
    deathCount: 0,
    perfectJumps: 0,
    powerUpsUsed: 0
  });

  const particles = useRef<Particle[]>([]);
  const effectParticles = useRef<EffectParticle[]>([]);
  const requestRef = useRef<number>(0);

  // --- HOOKS ---
  // Pass playing state to only block keys when playing
  const { inputs, setInput } = useGameInput(gameStatus === 'playing');
  
  const { renderStaticBackground, draw } = useGameRenderer(gameState, particles, effectParticles);
  
  // Sync UI with Engine (The "Snapshot" Pattern)
  useEffect(() => {
      if (gameStatus !== 'playing') return;

      const uiSyncInterval = setInterval(() => {
          const gs = gameState.current;
          setHudState({
              score: gs.score,
              time: Math.floor(gs.globalTime / 60), // approx seconds
              level: gs.level,
              windActive: gs.windActive,
              canTeleport: gs.canTeleport,
              players: gs.players.map(p => ({
                  id: p.id,
                  name: p.name,
                  color: p.color,
                  lives: p.lives,
                  isDead: p.isDead
              }))
          });
      }, 100); // Update UI every 100ms (10fps is enough for HUD)

      return () => clearInterval(uiSyncInterval);
  }, [gameStatus]);

  useEffect(() => {
      // Check for touch device once
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Cleanup dialogs on unmount
  useEffect(() => {
      return () => {
          if (dialogTimeoutRef.current) clearTimeout(dialogTimeoutRef.current);
      };
  }, []);

  const triggerDialog = (lines: {name:string, text:string}[]) => {
      if (dialogTimeoutRef.current) clearTimeout(dialogTimeoutRef.current);
      setDialogText(lines);
      setShowDialog(true);
      dialogTimeoutRef.current = window.setTimeout(() => setShowDialog(false), 3000);
  };
  
  // Setup logic for Physics Hook
  const loadLevel = useCallback((level: number) => {
      gameState.current.level = level;
      gameState.current.globalTime = 0;
      gameState.current.screenShake = 0;
      gameState.current.floatingTexts = [];
      gameState.current.activeRespawnPoint = { ...INITIAL_RESPAWN_POINT };
      gameState.current.portalHoldTimer = 0;
      gameState.current.cinematicMode = 'none';
      effectParticles.current = []; 
      
      renderStaticBackground(level);
      
      // Reset players based on stored runConfig
      const { lives } = gameState.current.runConfig;

      gameState.current.players.forEach((p, idx) => {
          // Reset position AND size
          p.position = { x: 100 + (idx * 50), y: 500 };
          p.velocity = { x: 0, y: 0 };
          p.size = { ...p.baseSize };
          p.isDead = false;
          p.buff = null;
          p.lives = lives; 
          p.invincibleTimer = 0;
          p.coyoteTimer = 0;
          p.jumpBufferTimer = 0;
      });

      if (level === 1) {
          gameState.current.platforms = getWinterPlatforms();
          gameState.current.coins = getWinterCoins();
          gameState.current.powerUps = [];
          gameState.current.enemies = getWinterEnemies();
          gameState.current.checkpoints = getWinterCheckpoints();
      } else if (level === 2) {
          gameState.current.platforms = getButterflyPlatforms();
          gameState.current.coins = getButterflyCoins();
          gameState.current.powerUps = [];
          gameState.current.enemies = getButterflyEnemies();
          gameState.current.checkpoints = getButterflyCheckpoints();
      } else if (level === 3) {
          gameState.current.platforms = getFruitParadisePlatforms();
          gameState.current.coins = getFruitParadiseCoins();
          gameState.current.powerUps = [];
          gameState.current.enemies = getFruitParadiseEnemies();
          gameState.current.checkpoints = getFruitParadiseCheckpoints();
      } else {
          // Level 4 (Boss)
          gameState.current.platforms = getBossLevelPlatforms();
          gameState.current.coins = getBossLevelCoins();
          gameState.current.powerUps = getBossLevelPowerUps();
          gameState.current.enemies = getBossLevelEnemies();
          gameState.current.checkpoints = getBossLevelCheckpoints();
      }
      
      gameState.current.camera = { x: 0, y: 0 };
      
      // Init Particles
      particles.current = [];
      const count = level === 1 ? 150 : 80;
      for(let i=0; i<count; i++) {
        particles.current.push({
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
            size: Math.random() * 3 + 2, 
            speed: Math.random() * 2 + 1,
            color: level === 1 ? '#fff' : `hsl(${Math.random()*360}, 80%, 70%)`,
            angle: Math.random() * Math.PI * 2
        });
      }
  }, [renderStaticBackground]);

  const { updatePhysics } = useGamePhysics({
      gameState,
      inputs,
      particles,
      effectParticles,
      callbacks: {
          setGameStatus,
          setShowDialog,
          setDialogText,
          loadLevel,
          setCurrentScore: () => {}, // Score handled by ref now
          setTutorialState,
          tutorialStateRef
      }
  });

  useEffect(() => {
    // Initial Load
    renderStaticBackground(1);
    
    // Init Particles for menu
    particles.current = [];
    for(let i=0; i<150; i++) {
        particles.current.push({
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
            size: Math.random() * 3 + 2, 
            speed: Math.random() * 2 + 1,
            color: '#fff',
            angle: Math.random() * Math.PI * 2
        });
    }
  }, [renderStaticBackground]);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    soundManager.setMute(newState);
  };

  const togglePause = useCallback(() => {
      const now = Date.now();
      if (now - lastPauseToggle.current < 300) return; 
      lastPauseToggle.current = now;

      setGameStatus(prev => {
        if (prev === 'playing') {
            gameState.current.status = 'paused';
            soundManager.stopBGM();
            return 'paused';
        } else if (prev === 'paused') {
            gameState.current.status = 'playing';
            soundManager.resume();
            soundManager.startBGM();
            return 'playing';
        }
        return prev;
      });
  }, []);

  const handleModeSelect = (mode: 'solo' | 'multi') => {
      setSelectedMode(mode);
      if (mode === 'solo') {
          setMenuStep('char_select');
      } else {
          setMenuStep('lives_select');
      }
  };

  const handleCharSelect = (char: 'cemre' | 'baba') => {
      setSelectedChar(char);
      setMenuStep('lives_select');
  };

  const handleLivesSelect = (lives: number) => {
      setSelectedLives(lives);
      setMenuStep('level_select');
  }

  // Called when starting a NEW game from menu
  const startNewGame = (level: number) => {
      // 1. Save Config for Restarts
      gameState.current.runConfig = {
          mode: selectedMode || 'multi',
          character: selectedChar,
          lives: selectedLives,
          level: level
      };

      initializeGame(level);
  }

  // Called internally or by restart button
  const initializeGame = (level: number) => {
    soundManager.resume();
    soundManager.startBGM();

    gameState.current.score = 0;
    
    setTutorialState({ moved: false, jumped: false, completed: false });
    tutorialStateRef.current = { moved: false, jumped: false };
    
    // Use stored config
    const config = gameState.current.runConfig;
    
    let players = getInitialPlayers(config.lives);
    
    if (config.mode === 'solo' && config.character) {
        players = players.filter((p: Player) => p.id === config.character);
        gameState.current.gameMode = 'solo';
    } else {
        gameState.current.gameMode = 'multi';
    }
    gameState.current.players = players;

    loadLevel(level);
    
    gameState.current.status = 'playing';
    setGameStatus('playing');

    if (level === 1) {
        triggerDialog([
            {name: 'Cemre', text: 'Baba, kuzey ışıklarını görebilecek miyiz?'},
            {name: 'Baba', text: 'Elbette kızım! Sadece dikkatli olmamız gerek.'},
            {name: 'Cemre', text: 'Yaşasın! Hadi gidelim!'}
        ]);
    } else if (level === 2) {
        triggerDialog([
            {name: 'Baba', text: 'Burası Kelebek Vadisi. Çok uzun bir yolumuz var.'}
        ]);
    } else if (level === 3) {
        triggerDialog([
            {name: 'Cemre', text: 'Meyve Cenneti!'},
            {name: 'Baba', text: 'Tadını çıkaralım!'}
        ]);
    }
  };

  // Main Loop
  const loop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    const safeDelta = Math.min(deltaTime, 100); 
    accumulatorRef.current += safeDelta;

    let updates = 0;
    while (accumulatorRef.current >= FIXED_TIMESTEP) {
        updatePhysics();
        accumulatorRef.current -= FIXED_TIMESTEP;
        updates++;
        if (updates > 10) {
             accumulatorRef.current = 0;
             break;
        }
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) draw(ctx);
    }

    // Update Debug Info directly to DOM for performance
    if (debugRef.current && gameState.current.status === 'playing') {
        const p1 = gameState.current.players[0];
        const cam = gameState.current.camera;
        debugRef.current.innerText = `X: ${Math.round(p1.position.x)} Y: ${Math.round(p1.position.y)} | CamX: ${Math.round(cam.x)}`;
    }

    requestRef.current = requestAnimationFrame(loop);
  }, [updatePhysics, draw]); 

  useEffect(() => {
    // Add Pause Handler to Window
    const handleKeyDown = (e: KeyboardEvent) => { 
        if (e.key === 'Escape') togglePause();
    };
    window.addEventListener('keydown', handleKeyDown);

    requestRef.current = requestAnimationFrame(loop);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      soundManager.stopBGM();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [loop, togglePause]); 

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
  };

  const getLevelName = (lvl: number) => {
      if (lvl === 1) return 'Bölüm 1: Kış Masalı';
      if (lvl === 2) return 'Bölüm 2: Kelebek Vadisi';
      if (lvl === 3) return 'Bölüm 3: Meyve Cenneti';
      if (lvl === 4) return 'Bölüm 4: Aurora Koruyucusu';
      return 'Bölüm ?';
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-sky-900">
      <div className="relative shadow-2xl border-8 border-white rounded-lg overflow-hidden bg-black" style={{ width: 'min(1280px, 98vw)', height: 'auto', aspectRatio: '16/9' }}>
        <canvas 
          ref={canvasRef} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT}
          className="w-full h-full"
        />

        {/* Debug Overlay */}
        {gameStatus === 'playing' && (
            <div 
                ref={debugRef} 
                className="absolute top-2 right-2 bg-black/50 text-white text-xs font-mono p-1 rounded pointer-events-none z-50 hidden"
            >
                Loading Coords...
            </div>
        )}
        
        {/* Mobile Controls Overlay - Only on Touch Devices */}
        {(gameStatus === 'playing' && isTouchDevice) && (
            <MobileControls onInput={setInput} />
        )}

        {(gameStatus === 'playing' || gameStatus === 'paused') && (
            <div className="absolute inset-x-0 top-0 pointer-events-none p-4 flex flex-col justify-between z-20">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2 pointer-events-auto">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20 shadow-lg">
                             <div className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1 px-1">
                                {getLevelName(hudState.level)}
                             </div>
                             <div className="flex items-center text-white px-2">
                                <span className="text-3xl mr-2">🥐</span>
                                <span className="font-bold text-3xl font-mono">{hudState.score}</span>
                             </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-2">
                        {hudState.windActive && (
                            <div className="bg-sky-500 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse shadow-md flex items-center gap-2">
                                💨 <span className="uppercase">Rüzgar</span>
                            </div>
                        )}
                        {hudState.canTeleport && (
                            <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse shadow-md flex items-center gap-2 border-2 border-purple-300">
                                ⚡ <span className="uppercase">T: Birleş</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 pointer-events-auto items-end">
                         <div className="flex gap-2">
                             <div className="bg-black/40 text-white px-3 py-1 rounded-lg font-mono text-lg font-bold border border-white/10">
                                 ⏱️ {formatTime(hudState.time)}
                             </div>
                             <button 
                                onClick={toggleMute}
                                className="bg-black/40 hover:bg-black/60 text-white rounded-lg p-2 transition-colors border border-white/10"
                                aria-label="Sesi Aç/Kapat"
                                title="Sesi Aç/Kapat"
                             >
                                {isMuted ? '🔇' : '🔊'}
                             </button>
                             <button 
                                onClick={togglePause}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg w-10 h-10 font-bold shadow-md"
                                aria-label="Duraklat"
                                title="Duraklat"
                             >
                                ||
                             </button>
                         </div>
                         <div className="flex gap-2 mt-1">
                             {hudState.players.map(p => (
                                 <div key={p.id} className={`flex items-center bg-black/40 rounded-full px-3 py-1 ${p.isDead ? 'opacity-50 grayscale' : ''} border border-white/10`}>
                                     <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: p.color }}></div>
                                     <span className="text-white font-bold text-xs mr-1">{p.name}</span>
                                     <span className="text-red-500 text-xs">❤️</span>
                                     <span className="text-white font-bold text-sm ml-1">
                                         {p.lives === Infinity ? '∞' : p.lives}
                                     </span>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {gameStatus === 'playing' && !tutorialState.moved && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse z-10">
                <div className="bg-black/60 text-white px-6 py-4 rounded-xl text-center backdrop-blur-sm border-2 border-white/30">
                    <p className="text-lg font-bold mb-2">Hareket Etmek İçin</p>
                    <div className="flex gap-4 justify-center text-3xl">
                        <span>⬅️</span><span>➡️</span>
                    </div>
                </div>
            </div>
        )}

        {gameStatus === 'playing' && tutorialState.moved && !tutorialState.jumped && (
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-bounce z-10">
                <div className="bg-black/60 text-white px-6 py-4 rounded-xl text-center backdrop-blur-sm border-2 border-white/30">
                    <p className="text-lg font-bold mb-2">Zıplamak İçin</p>
                    <div className="text-3xl">⬆️</div>
                </div>
            </div>
        )}

        {gameStatus === 'paused' && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-3xl flex flex-col gap-4 min-w-[300px] text-center shadow-2xl transform scale-110">
                    <h2 className="text-4xl font-black text-gray-800 mb-4 tracking-tight">DURAKLATILDI</h2>
                    <button 
                        onClick={togglePause}
                        className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg transition-transform hover:scale-105"
                    >
                        ▶️ Devam Et
                    </button>
                    <button 
                        onClick={() => initializeGame(gameState.current.runConfig.level)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg transition-transform hover:scale-105"
                    >
                        🔄 Yeniden Başlat
                    </button>
                    <button 
                        onClick={() => { setGameStatus('menu'); setMenuStep('mode_select'); }}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg transition-transform hover:scale-105"
                    >
                        🏠 Menüye Dön
                    </button>
                </div>
            </div>
        )}

        {showDialog && (
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-white/95 text-black px-8 py-4 rounded-xl border-4 border-sky-500 flex flex-col items-center shadow-lg z-30 animate-bounce max-w-2xl w-full pointer-events-none">
                {dialogText.map((line, i) => (
                    <p key={i} className={`text-xl ${line.name === 'Cemre' ? 'text-pink-600 font-bold' : line.name === 'Baba' ? 'text-blue-600 font-bold' : 'text-purple-600 font-bold'}`}>
                        {line.name}: <span className="text-gray-800 font-normal">{line.text}</span>
                    </p>
                ))}
            </div>
        )}
        
        {gameStatus === 'menu' && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-8 backdrop-blur-sm z-50">
            <h1 className="flex text-6xl font-black text-sky-300 drop-shadow-[0_5px_5px_rgba(255,255,255,0.2)] mb-4 text-center">
              {"Kuzey Işıkları".split('').map((char, index) => (
                <span key={index} className="animate-bounce" style={{ animationDelay: `${index * 0.1}s` }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
            <h2 className="text-3xl font-bold mb-8 text-white">Yolculuğu</h2>
            
            {menuStep === 'mode_select' && (
                <div className="flex gap-8 items-center justify-center animate-fade-in flex-wrap">
                    <button 
                      onClick={() => handleModeSelect('solo')}
                      className="px-8 py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-2xl font-bold shadow-lg transform transition hover:scale-105 active:scale-95 flex flex-col items-center w-64 border-b-8 border-indigo-800"
                    >
                      <span className="text-4xl mb-2">👤</span>
                      <span>Tek Kişilik</span>
                      <span className="text-sm font-normal mt-2 opacity-80">Tek başına macera</span>
                    </button>

                    <button 
                      onClick={() => handleModeSelect('multi')}
                      className="px-8 py-6 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-2xl font-bold shadow-lg transform transition hover:scale-105 active:scale-95 flex flex-col items-center w-64 border-b-8 border-purple-800"
                    >
                      <span className="text-4xl mb-2">👥</span>
                      <span>İki Kişilik</span>
                      <span className="text-sm font-normal mt-2 opacity-80">Birlikte oyna</span>
                    </button>
                </div>
            )}

            {menuStep === 'char_select' && (
                <div className="flex flex-col items-center animate-fade-in">
                    <h3 className="text-2xl font-bold mb-6">Karakterini Seç</h3>
                    <div className="flex gap-8 items-center justify-center flex-wrap">
                        <button 
                          onClick={() => handleCharSelect('cemre')}
                          className="px-8 py-6 bg-pink-500 hover:bg-pink-400 text-white rounded-xl text-2xl font-bold shadow-lg transform transition hover:scale-105 active:scale-95 flex flex-col items-center w-48 border-b-8 border-pink-700"
                        >
                          <span className="text-4xl mb-2">🧚‍♀️</span>
                          <span>Cemre</span>
                        </button>

                        <button 
                          onClick={() => handleCharSelect('baba')}
                          className="px-8 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-2xl font-bold shadow-lg transform transition hover:scale-105 active:scale-95 flex flex-col items-center w-48 border-b-8 border-blue-800"
                        >
                          <span className="text-4xl mb-2">👨</span>
                          <span>Baba</span>
                        </button>
                    </div>
                    <button 
                        onClick={() => setMenuStep('mode_select')}
                        className="mt-8 text-gray-300 hover:text-white underline text-lg"
                    >
                        &lt; Geri Dön
                    </button>
                </div>
            )}

            {menuStep === 'lives_select' && (
                <div className="flex flex-col items-center animate-fade-in">
                    <h3 className="text-2xl font-bold mb-6">Can Sayısı Seç</h3>
                    <div className="flex gap-4 items-center justify-center flex-wrap">
                        {[3, 5, 10].map(lives => (
                            <button 
                              key={lives}
                              onClick={() => handleLivesSelect(lives)}
                              className="w-24 h-24 bg-red-500 hover:bg-red-400 text-white rounded-full text-3xl font-bold shadow-lg transform transition hover:scale-105 active:scale-95 border-b-8 border-red-700 flex items-center justify-center"
                            >
                              <span>{lives}</span>
                              <span className="text-lg ml-1">❤️</span>
                            </button>
                        ))}
                        <button 
                          onClick={() => handleLivesSelect(Infinity)}
                          className="w-24 h-24 bg-yellow-500 hover:bg-yellow-400 text-white rounded-full text-4xl font-bold shadow-lg transform transition hover:scale-105 active:scale-95 border-b-8 border-yellow-700 flex items-center justify-center"
                        >
                          <span>∞</span>
                        </button>
                    </div>
                    <div className="mt-4 text-white/70 text-sm">
                        Sonsuz seçilirse oyun asla bitmez!
                    </div>
                    <button 
                        onClick={() => setMenuStep(selectedMode === 'solo' ? 'char_select' : 'mode_select')}
                        className="mt-8 text-gray-300 hover:text-white underline text-lg"
                    >
                        &lt; Geri Dön
                    </button>
                </div>
            )}

            {menuStep === 'level_select' && (
                <div className="flex flex-col items-center animate-fade-in">
                    <h3 className="text-2xl font-bold mb-6">Bölüm Seç</h3>
                    <div className="flex gap-8 items-center justify-center flex-wrap">
                        <button 
                          onClick={() => startNewGame(1)}
                          className="px-8 py-6 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-2xl font-bold shadow-lg transform transition hover:scale-105 active:scale-95 flex flex-col items-center w-64 border-b-8 border-sky-800"
                        >
                          <span className="text-4xl mb-2">❄️</span>
                          <span>Bölüm 1</span>
                          <span className="text-sm font-normal mt-1 opacity-90">Kış Masalı</span>
                        </button>

                        <button 
                          onClick={() => startNewGame(2)}
                          className="px-8 py-6 bg-green-600 hover:bg-green-500 text-white rounded-xl text-2xl font-bold shadow-lg transform transition hover:scale-105 active:scale-95 flex flex-col items-center w-64 border-b-8 border-green-800"
                        >
                          <span className="text-4xl mb-2">🦋</span>
                          <span>Bölüm 2</span>
                          <span className="text-sm font-normal mt-1 opacity-90">Kelebek Vadisi</span>
                        </button>
                        
                        <button
                          onClick={() => startNewGame(3)}
                          className="px-8 py-6 bg-pink-500 hover:bg-pink-400 text-white rounded-xl text-2xl font-bold shadow-lg transform transition hover:scale-105 active:scale-95 flex flex-col items-center w-64 border-b-8 border-pink-800"
                        >
                          <span className="text-4xl mb-2">🍎</span>
                          <span>Bölüm 3</span>
                          <span className="text-sm font-normal mt-1 opacity-90">Meyve Cenneti</span>
                        </button>

                        <button
                          onClick={() => startNewGame(4)}
                          className="px-8 py-6 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-2xl font-bold shadow-lg transform transition hover:scale-105 active:scale-95 flex flex-col items-center w-64 border-b-8 border-slate-900"
                        >
                          <span className="text-4xl mb-2">👹</span>
                          <span>Bölüm 4</span>
                          <span className="text-sm font-normal mt-1 opacity-90">Aurora Koruyucusu</span>
                        </button>
                    </div>
                    <button 
                        onClick={() => setMenuStep('lives_select')}
                        className="mt-8 text-gray-300 hover:text-white underline text-lg"
                    >
                        &lt; Geri Dön
                    </button>
                </div>
            )}
            
            <div className="absolute bottom-4 right-4 text-white/50 text-sm">
                ESC: Duraklat
            </div>
          </div>
        )}

        {gameStatus === 'won' && (
          <div className="absolute inset-0 bg-indigo-900/90 flex flex-col items-center justify-center text-white animate-fade-in z-50">
            <h1 className="text-6xl font-black text-green-300 drop-shadow-lg mb-4">✨ TEBRİKLER! ✨</h1>
            <p className="text-2xl font-bold mb-8 text-sky-200">Bütün bölümleri bitirdiniz!</p>
            <div className="text-4xl font-mono mb-8 bg-black/20 px-8 py-2 rounded-lg border border-white/20">Puan: {hudState.score}</div>
            <button 
              onClick={() => {
                  setGameStatus('menu');
                  setMenuStep('mode_select');
              }}
              className="px-8 py-4 bg-white text-indigo-900 hover:bg-gray-100 rounded-full text-2xl font-bold shadow-lg"
            >
              Menüye Dön 🏠
            </button>
          </div>
        )}

        {gameStatus === 'gameover' && (
          <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center text-white animate-fade-in z-50">
            <h1 className="text-7xl font-black text-red-500 drop-shadow-lg mb-4 bg-white px-4 rounded">OYUN BİTTİ</h1>
            <p className="text-2xl font-bold mb-8">Çok soğuktu...</p>
            <div className="flex gap-4">
                <button 
                  onClick={() => initializeGame(gameState.current.runConfig.level)}
                  className="px-8 py-4 bg-white text-red-600 hover:bg-gray-100 rounded-full text-2xl font-bold shadow-lg"
                >
                  Tekrar Dene ↺
                </button>
                <button 
                  onClick={() => {
                      setGameStatus('menu');
                      setMenuStep('mode_select');
                  }}
                  className="px-8 py-4 bg-gray-800 text-white hover:bg-gray-700 rounded-full text-2xl font-bold shadow-lg"
                >
                  Menü 🏠
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
