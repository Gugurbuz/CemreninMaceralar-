import React, { useCallback } from 'react';
import { GameState, InputState, Player, Platform, Particle, EffectParticle, Enemy } from '../types';
import {
    GRAVITY, TERMINAL_VELOCITY, FRICTION, ICE_FRICTION, WIND_FORCE,
    CANVAS_WIDTH, CANVAS_HEIGHT, HOT_CHOCOLATE_DURATION,
    LEVEL_1_WIDTH, LEVEL_2_WIDTH, LEVEL_4_WIDTH, COYOTE_TIME, JUMP_BUFFER, INITIAL_RESPAWN_POINT,
    getWinterEnemies, getButterflyEnemies, getFruitParadiseEnemies, getBossLevelEnemies
} from '../constants';
import { soundManager } from '../utils/SoundManager';
import { updateBossAI, handleBossHit, updateProjectiles, updateAuroraCrystals } from '../lib/bossAI';

interface PhysicsProps {
    gameState: React.MutableRefObject<GameState>;
    inputs: React.MutableRefObject<InputState>;
    particles: React.MutableRefObject<Particle[]>;
    effectParticles: React.MutableRefObject<EffectParticle[]>;
    callbacks: {
        setGameStatus: (status: any) => void;
        setShowDialog: (show: boolean) => void;
        setDialogText: (text: any[]) => void;
        loadLevel: (level: number) => void;
        setCurrentScore: (score: number) => void;
        setTutorialState: (state: any) => void;
        tutorialStateRef: React.MutableRefObject<any>;
    }
}

export const useGamePhysics = ({
    gameState,
    inputs,
    particles,
    effectParticles,
    callbacks
}: PhysicsProps) => {

    const isColliding = (r1: {x:number, y:number, w:number, h:number}, r2: {x:number, y:number, w:number, h:number}) => {
        return (
            r1.x < r2.x + r2.w &&
            r1.x + r1.w > r2.x &&
            r1.y < r2.y + r2.h &&
            r1.y + r1.h > r2.y
        );
    }

    const createDust = (x: number, y: number) => {
        if (effectParticles.current.length > 40) return;
        for(let i=0; i<3; i++) {
            effectParticles.current.push({
                id: Math.random(),
                x: x + (Math.random() - 0.5) * 20,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 2 - 0.5,
                life: 20,
                maxLife: 20,
                color: 'rgba(240, 240, 240, 0.6)',
                size: Math.random() * 4 + 2,
                type: 'dust'
            });
        }
    };

    const createSplash = (x: number, y: number) => {
        if (effectParticles.current.length > 40) return;
        for(let i=0; i<5; i++) {
            effectParticles.current.push({
                id: Math.random(),
                x: x + (Math.random() - 0.5) * 10,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 4 - 2,
                life: 30,
                maxLife: 30,
                color: 'rgba(100, 200, 255, 0.8)',
                size: Math.random() * 3 + 2,
                type: 'splash'
            });
        }
    };

    const addFloatingText = (x: number, y: number, text: string, color: string) => {
        gameState.current.floatingTexts.push({
            id: Math.random(),
            x, y, text, color,
            life: 60,
            vy: -1.5
        });
    };

    const handlePlayerDamage = (p: Player) => {
        if (p.isDead || p.invincibleTimer > 0) return;

        const hasShield = p.activePowerUps.some(pu => pu.type === 'shield');
        if (hasShield) {
            const shieldIndex = p.activePowerUps.findIndex(pu => pu.type === 'shield');
            if (shieldIndex !== -1) {
                p.activePowerUps.splice(shieldIndex, 1);
                addFloatingText(p.position.x, p.position.y - 40, 'Kalkan Kırıldı!', '#fbbf24');
                soundManager.playCoin();
                p.invincibleTimer = 30;
                return;
            }
        }

        const hasStar = p.activePowerUps.some(pu => pu.type === 'star');
        if (hasStar) {
            addFloatingText(p.position.x, p.position.y - 40, 'Yıldız Koruma!', '#fbbf24');
            soundManager.playCoin();
            return;
        }

        p.lives -= 1;
        p.invincibleTimer = 60;
        gameState.current.screenShake = 15;
        gameState.current.deathCount++;
        soundManager.playDamage();
        p.buff = null;

        if (p.lives > 0) {
            p.position.x = gameState.current.activeRespawnPoint.x;
            p.position.y = gameState.current.activeRespawnPoint.y;
            p.velocity = {x: 0, y: 0};

            // Düşmanları resetle (isteğe bağlı, zorluğu korumak için kapatılabilir ama bugları önler)
            // const level = gameState.current.level;
            // if (level === 1) gameState.current.enemies = getWinterEnemies();
            // ... (diğer seviyeler)
        } else {
            p.isDead = true;
            p.velocity = {x: 0, y: 0};
            const allDead = gameState.current.players.every(pl => pl.isDead);
            if (allDead) {
                gameState.current.status = 'gameover';
                callbacks.setGameStatus('gameover');
                soundManager.stopBGM();
            }
        }
    };

    const resolveXCollisions = (player: Player, platforms: Platform[]) => {
        const hitX = player.position.x + 8; // Hitbox küçültüldü (daha affedici)
        const hitW = player.size.width - 16;
        const hitY = player.position.y + 10; 
        const hitH = player.size.height - 20;
  
        for (const plat of platforms) {
            // Açık kapıdan geç
            if (plat.type === 'door' && plat.isOpen) continue;
            if (plat.type === 'aurora') continue;
            if (plat.type === 'crumbly' && plat.isFalling && (plat.fallTimer || 0) <= 0) continue;
            if (plat.type === 'plate' || plat.type === 'totem') continue; 
            if (plat.type === 'cloud') continue;
            if (plat.type === 'leaf') continue; // Yapraklar da tek yönlü (one-way) sayılabilir ama şimdilik X collision yok

            if (isColliding(
                {x: hitX, y: hitY, w: hitW, h: hitH},
                {x: plat.position.x, y: plat.position.y, w: plat.size.width, h: plat.size.height}
            )) {
                if (player.velocity.x > 0) {
                     player.position.x = plat.position.x - player.size.width + 5; // Hafif overlap engelleme
                } else if (player.velocity.x < 0) {
                     player.position.x = plat.position.x + plat.size.width - 5;
                }
                player.velocity.x = 0;
                return; 
            }
        }
    };
  
    const resolveYCollisions = (player: Player, platforms: Platform[]) => {
        player.isGrounded = false;
        let friction = FRICTION;
        
        // Y Çarpışma kutusunu biraz daha aşağı doğru uzat ki zeminle temas kesilmesin
        const hitX = player.position.x + 10;
        const hitW = player.size.width - 20;
        const hitY = player.position.y;
        const hitH = player.size.height;
        
        let bestPlatform: Platform | null = null;
        let collisionType: 'floor' | 'ceiling' | null = null;
        
        for (const plat of platforms) {
            if (plat.type === 'door' && plat.isOpen) continue;
            if (plat.type === 'aurora') continue;
            if (plat.type === 'crumbly' && plat.isFalling && (plat.fallTimer || 0) <= 0) continue;

            // PLATE (BUTON) MANTIĞI
            if (plat.type === 'plate') {
                // Sadece üzerine basınca (Y velocity pozitif veya sıfır)
                if (isColliding({x: hitX, y: hitY + 5, w: hitW, h: hitH}, {x: plat.position.x, y: plat.position.y, w: plat.size.width, h: plat.size.height})) {
                    if (!plat.isPressed && player.velocity.y >= 0) {
                        plat.isPressed = true;
                        soundManager.playCoin();
                        addFloatingText(plat.position.x, plat.position.y - 20, "Açıldı!", "#facc15");
                        const door = gameState.current.platforms.find(p => p.id === plat.linkId);
                        if (door) {
                            door.isOpen = true;
                            // Kapı açılma efekti için toz
                            createDust(door.position.x + door.size.width/2, door.position.y + door.size.height);
                        }
                    }
                }
                // Plate fiziksel engel değil, devam et
                continue; 
            }

            if (plat.type === 'totem') {
                 if (isColliding({x: hitX, y: hitY, w: hitW, h: hitH}, {x: plat.position.x, y: plat.position.y, w: plat.size.width, h: plat.size.height})) {
                     if (!plat.deformation && !plat.isActive) { // Sadece kapalıysa aç
                         plat.isActive = true;
                         gameState.current.windActive = true;
                         plat.deformation = 1;
                         soundManager.playCoin();
                         addFloatingText(plat.position.x, plat.position.y - 30, "Rüzgar Aktif!", "#fff");
                         createDust(plat.position.x + 30, plat.position.y + 50);
                     }
                 }
                 continue;
            }

            if (isColliding(
                {x: hitX, y: hitY, w: hitW, h: hitH},
                {x: plat.position.x, y: plat.position.y, w: plat.size.width, h: plat.size.height}
            )) {
                if (player.velocity.y > 0) {
                     // Cloud ve Leaf One-Way Logic
                     if (plat.type === 'cloud' || plat.type === 'leaf') {
                         const prevY = player.position.y - player.velocity.y;
                         if (prevY + player.size.height > plat.position.y + 10) {
                             continue; 
                         }
                     }

                     if (!bestPlatform) {
                         bestPlatform = plat;
                         collisionType = 'floor';
                     } else {
                         if (plat.type === 'mushroom' && bestPlatform.type !== 'mushroom') {
                             bestPlatform = plat;
                         } else if (plat.type !== 'mushroom' && bestPlatform.type === 'mushroom') {
                             // Mushroom wins
                         } else {
                             // En yüksekteki (Y değeri en düşük) platformu seç
                             if (plat.position.y < bestPlatform.position.y) {
                                 bestPlatform = plat;
                             }
                         }
                     }
                } else if (player.velocity.y < 0) {
                    if (plat.type === 'cloud' || plat.type === 'leaf') continue; 

                    if (!bestPlatform) {
                        bestPlatform = plat;
                        collisionType = 'ceiling';
                    } else {
                        if (plat.position.y > bestPlatform.position.y) {
                            bestPlatform = plat;
                        }
                    }
                }
            }
        }

        if (bestPlatform && collisionType === 'floor') {
             player.position.y = bestPlatform.position.y - player.size.height;
             player.standingOn = bestPlatform.type;
             
             const oldVy = player.velocity.y;
             
             if (bestPlatform.type === 'mushroom') {
                 if (oldVy > 10) { // Daha kolay zıplama
                     player.isGrounded = false;
                     player.mushroomCooldown = 15;
                     
                     let bouncePower = -22; 
                     player.velocity.y = bouncePower;
                     
                     bestPlatform.deformation = -0.4; 
                     player.scale.x = 0.6; player.scale.y = 1.4;
                     soundManager.playBounce(0.8);
                 } else {
                     player.isGrounded = true;
                     player.coyoteTimer = COYOTE_TIME;
                     player.velocity.y = 0;
                 }
             } else {
                 player.isGrounded = true;
                 player.coyoteTimer = COYOTE_TIME;
                 player.velocity.y = 0;
                 
                 if (player.velocity.y > 4) { 
                     player.scale.x = 1.3;
                     player.scale.y = 0.7;
                     if (gameState.current.level === 2 && (bestPlatform.type === 'ice' || bestPlatform.type === 'slippery')) {
                           createSplash(player.position.x + player.size.width/2, player.position.y + player.size.height);
                     } else {
                           createDust(player.position.x + player.size.width/2, player.position.y + player.size.height);
                     }
                 }
                 
                 if (bestPlatform.type === 'ice' || bestPlatform.type === 'slippery') {
                     friction = ICE_FRICTION;
                 } else if (bestPlatform.type === 'crumbly') {
                     if (!bestPlatform.isFalling) bestPlatform.isFalling = true;
                 }
             }

        } else if (bestPlatform && collisionType === 'ceiling') {
            player.position.y = bestPlatform.position.y + bestPlatform.size.height;
            player.velocity.y = 0;
        }

        return friction;
    };

    const updateParticles = () => {
        const isLevel1 = gameState.current.level === 1;
        particles.current.forEach(p => {
            if (isLevel1) {
                p.y += p.speed;
                if (gameState.current.windActive) p.x += p.speed * -1.5;
            } else {
                p.x += Math.cos(p.angle) * 1;
                p.y += Math.sin(p.angle) * 1;
                p.angle += 0.1;
                p.y += (Math.random() - 0.5) * 0.5;
            }
    
            if (gameState.current.cinematicMode !== 'aurora_suction') {
               if (p.y > CANVAS_HEIGHT) p.y = -10;
               if (p.y < -10) p.y = CANVAS_HEIGHT;
               if (p.x < 0) p.x = CANVAS_WIDTH;
               if (p.x > CANVAS_WIDTH) p.x = 0;
            }
        });
    };

    const updatePhysics = useCallback(() => {
        updateParticles();
        
        if (effectParticles.current.length > 50) {
            effectParticles.current.splice(0, effectParticles.current.length - 50);
        }
    
        if (gameState.current.status === 'transition' || gameState.current.status === 'won') {
             if (gameState.current.cinematicMode === 'aurora_suction') {
                 const portal = gameState.current.platforms.find(p => p.type === 'aurora');
                 if (portal) {
                     const centerX = portal.position.x + portal.size.width / 2;
                     const centerY = portal.position.y + portal.size.height / 2;
                     gameState.current.players.forEach(p => {
                         if (!p.isDead) {
                             p.position.x += (centerX - p.position.x) * 0.05;
                             p.position.y += (centerY - p.position.y) * 0.05;
                             p.size.width *= 0.95; 
                             p.size.height *= 0.95;
                         }
                     });
                 }
             } 
             return; 
        }
    
        if (gameState.current.status !== 'playing') return;
        
        const time = gameState.current.globalTime;
        gameState.current.globalTime += 1;
        if (gameState.current.screenShake > 0) gameState.current.screenShake--;
    
        for (let i = gameState.current.floatingTexts.length - 1; i >= 0; i--) {
            const ft = gameState.current.floatingTexts[i];
            ft.y += ft.vy;
            ft.life--;
            if (ft.life <= 0) gameState.current.floatingTexts.splice(i, 1);
        }
    
        for (let i = effectParticles.current.length - 1; i >= 0; i--) {
            const p = effectParticles.current[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            if (p.type === 'splash') p.vy += 0.2; 
            if (p.life <= 0) {
                effectParticles.current.splice(i, 1);
            }
        }
    
        // Wind Logic - Totem kontrolü veya Otomatik
        if (gameState.current.level === 1 || gameState.current.level === 2) {
            const totem = gameState.current.platforms.find(p => p.type === 'totem');
            if (totem && totem.isActive) {
                gameState.current.windActive = true;
            } else {
                 // Level 1'de otomatik rüzgar yok artık, sadece totem (Level tasarımına göre)
                 // Veya Level 1 başında otomatik olabilir. Şimdilik sadece Totem.
                 if (!totem) gameState.current.windActive = false;
            }
        } else {
            gameState.current.windActive = false;
        }
    
        gameState.current.platforms.forEach(p => {
            if (p.deformation) {
                p.deformation *= 0.8;
                if (Math.abs(p.deformation) < 0.01) p.deformation = 0;
            }
    
            if (p.type === 'crumbly') {
                if (p.isFalling && p.fallTimer !== undefined) {
                    if (p.fallTimer > 0) {
                        p.fallTimer--;
                    } else {
                        p.respawnTimer = (p.respawnTimer || 0) + 1;
                        if (p.respawnTimer > 300) { 
                            p.isFalling = false;
                            p.fallTimer = p.maxFallTimer || 60;
                            p.respawnTimer = 0;
                            createDust(p.position.x + p.size.width/2, p.position.y + p.size.height/2);
                        }
                    }
                }
            }
        });
    
        gameState.current.enemies.forEach(enemy => {
            if (enemy.type === 'boss') {
                updateBossAI(enemy, gameState.current, addFloatingText);
            } else if ((enemy.type === 'yeti' || enemy.type === 'slime' || enemy.type === 'snowman') && enemy.originalX && enemy.patrolDistance) {
                enemy.position.x += (enemy.speed || 1) * (enemy.direction || 1);
                if (enemy.position.x > enemy.originalX + enemy.patrolDistance) enemy.direction = -1;
                if (enemy.position.x < enemy.originalX) enemy.direction = 1;
            }
            else if (enemy.type === 'bird' && enemy.originalX && enemy.originalY) {
                enemy.position.x += (enemy.speed || 1) * (enemy.direction || 1);
                enemy.position.y = enemy.originalY + Math.sin(time * 0.05) * 50;
                if (Math.abs(enemy.position.x - enemy.originalX) > (enemy.patrolDistance || 300)) {
                    enemy.direction = (enemy.direction || 1) === 1 ? -1 : 1;
                }
            }
        });

        updateProjectiles(gameState.current);
        updateAuroraCrystals(gameState.current);

        for (let i = gameState.current.projectiles.length - 1; i >= 0; i--) {
            const proj = gameState.current.projectiles[i];
            gameState.current.players.forEach(p => {
                if (p.isDead || p.invincibleTimer > 0) return;
                if (isColliding(
                    {x: p.position.x, y: p.position.y, w: p.size.width, h: p.size.height},
                    {x: proj.position.x, y: proj.position.y, w: proj.size, h: proj.size}
                )) {
                    handlePlayerDamage(p);
                    gameState.current.projectiles.splice(i, 1);
                }
            });
        }

        for (let i = gameState.current.auroraCrystals.length - 1; i >= 0; i--) {
            const crystal = gameState.current.auroraCrystals[i];
            if (crystal.collected) continue;

            gameState.current.players.forEach(p => {
                if (p.isDead) return;
                if (isColliding(
                    {x: p.position.x, y: p.position.y, w: p.size.width, h: p.size.height},
                    {x: crystal.position.x, y: crystal.position.y, w: crystal.size.width, h: crystal.size.height}
                )) {
                    crystal.collected = true;
                    gameState.current.crystalsCollected++;
                    gameState.current.score += 50;
                    soundManager.playCoin();
                    addFloatingText(crystal.position.x, crystal.position.y - 20, `Kristal ${gameState.current.crystalsCollected}/3`, '#a855f7');
                    gameState.current.auroraCrystals.splice(i, 1);
                }
            });
        }
    
        const players = gameState.current.players;
        if (players.length > 1) {
            const p1 = players[0];
            const p2 = players[1];
            if (!p1.isDead && !p2.isDead) {
                const dist = Math.abs(p1.position.x - p2.position.x);
                gameState.current.canTeleport = dist > 400; 
                if (gameState.current.canTeleport && (inputs.current['t'] || inputs.current['T'])) {
                    const leader = p1.position.x > p2.position.x ? p1 : p2;
                    const follower = p1.position.x > p2.position.x ? p2 : p1;
                    follower.position.x = leader.position.x - 50;
                    follower.position.y = leader.position.y - 50;
                    follower.velocity = { x: 0, y: 0 };
                    soundManager.playJump();
                }
            } else {
                gameState.current.canTeleport = false;
            }
        }
    
        const anyKey = Object.values(inputs.current).some(v => v);
        if (anyKey && !callbacks.tutorialStateRef.current.moved) {
            callbacks.setTutorialState((prev: any) => ({ ...prev, moved: true }));
            callbacks.tutorialStateRef.current.moved = true;
        }
    
        const livingPlayers = gameState.current.players.filter(p => !p.isDead);
        let playersInPortal = 0;
        const portal = gameState.current.platforms.find(p => p.type === 'aurora');
    
        gameState.current.players.forEach(p => {
            if (p.isDead) return;
            if (p.invincibleTimer > 0) p.invincibleTimer--;
            if (p.mushroomCooldown > 0) p.mushroomCooldown--;
            if (p.buff) {
                p.buff.timer--;
                if (p.buff.timer <= 0) p.buff = null;
            }
            if (p.coyoteTimer > 0) p.coyoteTimer--;
            if (p.jumpBufferTimer > 0) p.jumpBufferTimer--;
      
            const hasWarmth = p.buff?.type === 'warmth';
            const hasSpeed = p.activePowerUps.some(pu => pu.type === 'speed');
            const hasDoubleJumpPower = p.activePowerUps.some(pu => pu.type === 'double_jump');

            const currentJumpForce = hasWarmth ? p.jumpForce * 1.15 : p.jumpForce;
            const effectiveWind = hasWarmth ? WIND_FORCE * 0.2 : WIND_FORCE;
            const effectiveMoveSpeed = hasSpeed ? p.moveSpeed * 1.5 : p.moveSpeed;
      
            const isSolo = gameState.current.players.length === 1;
            
            let activeJumpForce = currentJumpForce;
            if (p.standingOn === 'mushroom') {
                activeJumpForce = -28; 
            }

            const up = inputs.current['ArrowUp'] || inputs.current['w'] || inputs.current['W'];
            
            // --- INPUT HANDLING ---
            // Solo Mode
            if (isSolo) {
                const left = inputs.current['ArrowLeft'] || inputs.current['a'] || inputs.current['A'];
                const right = inputs.current['ArrowRight'] || inputs.current['d'] || inputs.current['D'];

                if (left) { p.velocity.x -= effectiveMoveSpeed; p.facing = 'left'; }
                if (right) { p.velocity.x += effectiveMoveSpeed; p.facing = 'right'; }

                if (up) p.jumpBufferTimer = JUMP_BUFFER;
            } 
            // Multi Mode
            else {
                if (p.id === 'cemre') {
                    if (inputs.current['ArrowLeft']) { p.velocity.x -= effectiveMoveSpeed; p.facing = 'left'; }
                    if (inputs.current['ArrowRight']) { p.velocity.x += effectiveMoveSpeed; p.facing = 'right'; }
                    if (inputs.current['ArrowUp']) p.jumpBufferTimer = JUMP_BUFFER;
                }
                else if (p.id === 'baba') {
                    if (inputs.current['a'] || inputs.current['A']) { p.velocity.x -= effectiveMoveSpeed; p.facing = 'left'; }
                    if (inputs.current['d'] || inputs.current['D']) { p.velocity.x += effectiveMoveSpeed; p.facing = 'right'; }
                    if (inputs.current['w'] || inputs.current['W']) p.jumpBufferTimer = JUMP_BUFFER;
                }
            }

            // Jump Execution
            if (p.jumpBufferTimer > 0 && (p.isGrounded || p.coyoteTimer > 0)) {
                 p.velocity.y = activeJumpForce;
                 p.isGrounded = false;
                 p.coyoteTimer = 0;
                 p.jumpBufferTimer = 0;
                 p.hasDoubleJump = hasDoubleJumpPower; 
                 gameState.current.perfectJumps++;

                 if (p.standingOn === 'mushroom') soundManager.playBounce(1.0);
                 else soundManager.playJump();

                 if (!callbacks.tutorialStateRef.current.jumped) {
                     callbacks.setTutorialState((prev: any) => ({...prev, jumped: true}));
                     callbacks.tutorialStateRef.current.jumped = true;
                 }
                 p.scale.x = 0.8;
                 p.scale.y = 1.2;
            }
            else if (p.jumpBufferTimer > 0 && !p.isGrounded && p.hasDoubleJump) {
                 p.velocity.y = activeJumpForce * 0.9; 
                 p.hasDoubleJump = false;
                 p.jumpBufferTimer = 0;
                 soundManager.playBounce(0.7);
                 addFloatingText(p.position.x, p.position.y, 'Çift!', '#fbbf24');
                 p.scale.x = 0.8;
                 p.scale.y = 1.2;
            }

            // Variable Jump Height (holding key)
            // Multi-mode fix: check correct key for player
            let holdingJump = false;
            if (isSolo) holdingJump = up;
            else if (p.id === 'cemre') holdingJump = inputs.current['ArrowUp'];
            else if (p.id === 'baba') holdingJump = inputs.current['w'] || inputs.current['W'];

            if (!holdingJump && p.velocity.y < -4) {
                 p.velocity.y *= 0.5;
            }

            p.scale.x += (1 - p.scale.x) * 0.1;
            p.scale.y += (1 - p.scale.y) * 0.1;
      
            // --- PHYSICS STEPS (Sub-stepping for stability) ---
            p.velocity.y += GRAVITY;
            if (gameState.current.windActive) p.velocity.x += effectiveWind;
            
            p.position.x += p.velocity.x;
            resolveXCollisions(p, gameState.current.platforms);

            // Sub-stepping for Y collision to prevent tunneling
            if (Math.abs(p.velocity.y) > p.size.height / 2) {
                const steps = Math.min(5, Math.ceil(Math.abs(p.velocity.y) / (p.size.height / 2))); 
                const stepY = p.velocity.y / steps;
                
                let collisionFound = false;
                for (let s = 0; s < steps; s++) {
                    p.position.y += stepY;
                    const friction = resolveYCollisions(p, gameState.current.platforms);
                    if (p.isGrounded || p.velocity.y === 0) {
                        p.velocity.x *= friction;
                        collisionFound = true;
                        break;
                    }
                }
                if (!collisionFound) p.velocity.x *= FRICTION; 
            } else {
                p.position.y += p.velocity.y;
                const friction = resolveYCollisions(p, gameState.current.platforms);
                p.velocity.x *= friction;
            }
      
            const cap = p.standingOn === 'mushroom' ? 32 : TERMINAL_VELOCITY;
            if (p.velocity.y > cap) p.velocity.y = cap;
            if (Math.abs(p.velocity.x) < 0.1) p.velocity.x = 0;
            if (Math.abs(p.velocity.x) > 0.5) p.animFrame += 0.15; else p.animFrame = 0;
      
            if (p.position.x < 0) p.position.x = 0;
            if (p.position.y > 1200) handlePlayerDamage(p);
      
            // Portal Check
            if (portal) {
                if (isColliding(
                    {x: p.position.x, y: p.position.y, w: p.size.width, h: p.size.height},
                    {x: portal.position.x, y: portal.position.y, w: portal.size.width, h: portal.size.height}
                )) {
                    playersInPortal++;
                }
            }
      
            // Coin Collection
            const hasMagnet = p.activePowerUps.some(pu => pu.type === 'magnet');
            const magnetRadius = hasMagnet ? 150 : 0;

            gameState.current.coins.forEach(coin => {
                if (!coin.collected && !coin.isNectarDrop) {
                    const dx = (p.position.x + p.size.width/2) - coin.position.x;
                    const dy = (p.position.y + p.size.height/2) - coin.position.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    if (hasMagnet && dist < magnetRadius && dist > p.size.width/2 + coin.size) {
                        const pullForce = 0.15;
                        coin.position.x += (p.position.x + p.size.width/2 - coin.position.x) * pullForce;
                        coin.position.y += (p.position.y + p.size.height/2 - coin.position.y) * pullForce;
                        coin.baseY = coin.position.y;
                    }

                    // Affedici toplama alanı (hitbox biraz daha büyük)
                    if (dist < p.size.width/2 + coin.size + 10) {
                        coin.collected = true;
                        soundManager.playCoin();
                        gameState.current.coinsCollected++;
                        addFloatingText(coin.position.x, coin.position.y - 20, '+10', '#fbbf24');

                        if (coin.type === 'hot-chocolate') {
                            p.buff = { type: 'warmth', timer: HOT_CHOCOLATE_DURATION };
                            addFloatingText(coin.position.x, coin.position.y - 40, 'Isındın!', '#f97316');
                        } else {
                            callbacks.setCurrentScore(gameState.current.score + 10);
                            gameState.current.score += 10;
                        }
                    }
                }
            });

            // PowerUps
            gameState.current.powerUps.forEach(powerUp => {
                if (!powerUp.collected) {
                    const dx = (p.position.x + p.size.width/2) - powerUp.position.x;
                    const dy = (p.position.y + p.size.height/2) - powerUp.position.y;
                    if (Math.sqrt(dx*dx + dy*dy) < p.size.width/2 + 20) {
                        powerUp.collected = true;
                        soundManager.playCoin();
                        gameState.current.powerUpsUsed++;
                        p.activePowerUps.push({ type: powerUp.type, timer: powerUp.duration });
                        const names: Record<string, string> = {
                            'shield': 'Kalkan!', 'speed': 'Hız!', 'double_jump': 'Çift Zıplama!', 'magnet': 'Mıknatıs!', 'star': 'Yıldız!'
                        };
                        addFloatingText(powerUp.position.x, powerUp.position.y - 20, names[powerUp.type], '#fbbf24');
                    }
                }
            });

            for (let i = p.activePowerUps.length - 1; i >= 0; i--) {
                p.activePowerUps[i].timer--;
                if (p.activePowerUps[i].timer <= 0) p.activePowerUps.splice(i, 1);
            }
      
            // Enemy Collisions & Stomp
            const hitX = p.position.x + 10; 
            const hitW = p.size.width - 20;
            const hitY = p.position.y + 5;
            const hitH = p.size.height - 10;
            
            for (let i = gameState.current.enemies.length - 1; i >= 0; i--) {
                const enemy = gameState.current.enemies[i];
                if (isColliding(
                    {x: hitX, y: hitY, w: hitW, h: hitH},
                    {x: enemy.position.x + 5, y: enemy.position.y + 5, w: enemy.size.width - 10, h: enemy.size.height - 10}
                )) {
                     const playerBottom = p.position.y + p.size.height;
                     // Stomp için biraz daha affedici alan (Overlap artsa bile ezme say)
                     const isAbove = playerBottom < enemy.position.y + (enemy.size.height / 2) + 15;
                     const isFalling = p.velocity.y > 0;

                     if (enemy.type === 'boss') {
                         if (isFalling && isAbove) {
                             p.velocity.y = -12;
                             soundManager.playDamage();
                             addFloatingText(enemy.position.x + 50, enemy.position.y - 20, `-1 ❤️`, '#ef4444');
                             const defeated = handleBossHit(enemy, 1, gameState.current, addFloatingText);
                             if (defeated) {
                                 gameState.current.enemiesDefeated++;
                                 gameState.current.score += 200;
                                 gameState.current.enemies.splice(i, 1);
                                 soundManager.playWin();
                                 gameState.current.screenShake = 35;
                                 for (let j = 0; j < 15; j++) {
                                     gameState.current.coins.push({
                                         id: 9000 + j,
                                         position: { x: enemy.position.x + Math.random() * 150, y: enemy.position.y - 100 + Math.random() * 50 },
                                         size: 14,
                                         collected: false,
                                         baseY: enemy.position.y - 100,
                                         type: Math.random() > 0.5 ? 'gold' : 'kanelbulle',
                                         isNectarDrop: true
                                     });
                                 }
                             }
                         } else if (!enemy.isDashing) {
                             handlePlayerDamage(p);
                         }
                     } else {
                         if (isFalling && isAbove) {
                             p.velocity.y = -10; // Daha güçlü sekme
                             gameState.current.enemiesDefeated++;
                             soundManager.playCoin();
                             addFloatingText(enemy.position.x, enemy.position.y, "Bam!", "#fff");
                             createDust(enemy.position.x + enemy.size.width/2, enemy.position.y + enemy.size.height/2);
                             gameState.current.enemies.splice(i, 1);
                             p.scale.x = 1.2; p.scale.y = 0.8;
                         } else {
                             handlePlayerDamage(p);
                         }
                     }
                }
            }
      
            gameState.current.checkpoints.forEach(cp => {
                if (!cp.triggered && isColliding(
                    {x: p.position.x, y: p.position.y, w: p.size.width, h: p.size.height},
                    {x: cp.position.x, y: cp.position.y, w: cp.size.width, h: cp.size.height}
                 )) {
                     cp.triggered = true;
                     gameState.current.activeRespawnPoint = { x: cp.position.x + 10, y: cp.position.y + cp.size.height - 50 };
                     soundManager.playCoin();
                     addFloatingText(cp.position.x, cp.position.y - 20, 'Kayıt!', '#22c55e');
                 }
            });
        });

        const livingForCamera = gameState.current.players.filter(p => !p.isDead);
        if (livingForCamera.length > 0) {
            let totalX = 0;
            livingForCamera.forEach(p => totalX += p.position.x);
            const centerX = totalX / livingForCamera.length;
            const targetCamX = centerX - (CANVAS_WIDTH * 0.35);
            gameState.current.camera.x += (targetCamX - gameState.current.camera.x) * 0.1;

            let levelWidth = LEVEL_1_WIDTH;
            if (gameState.current.level === 2) levelWidth = LEVEL_2_WIDTH;
            if (gameState.current.level === 3) levelWidth = LEVEL_3_WIDTH;
            if (gameState.current.level === 4) levelWidth = LEVEL_4_WIDTH;

            const maxScroll = levelWidth - CANVAS_WIDTH;
            if (gameState.current.camera.x < 0) gameState.current.camera.x = 0;
            if (gameState.current.camera.x > maxScroll) gameState.current.camera.x = maxScroll;
        }

        if (livingPlayers.length > 0 && playersInPortal === livingPlayers.length) {
             if (gameState.current.portalHoldTimer === undefined) gameState.current.portalHoldTimer = 0;
             gameState.current.portalHoldTimer++;
             
             const requiredTime = gameState.current.gameMode === 'solo' ? 30 : 120;
             
             if (gameState.current.portalHoldTimer > requiredTime) {
                 if (gameState.current.level === 1) {
                     gameState.current.status = 'transition';
                     gameState.current.cinematicMode = 'aurora_suction';
                     callbacks.setGameStatus('transition');
                     setTimeout(() => {
                         callbacks.loadLevel(2);
                         gameState.current.status = 'playing';
                         callbacks.setGameStatus('playing');
                         callbacks.triggerDialog([
                            {name: 'Cemre', text: 'Vay canına! Burası çok güzel!'},
                            {name: 'Baba', text: 'Kelebek Vadisi... Dikkat et, burası daha sıcak.'}
                         ]);
                     }, 2000);
                 } else if (gameState.current.level === 2) {
                     gameState.current.status = 'transition';
                     gameState.current.cinematicMode = 'aurora_suction';
                     callbacks.setGameStatus('transition');
                     setTimeout(() => {
                         callbacks.loadLevel(3);
                         gameState.current.status = 'playing';
                         callbacks.setGameStatus('playing');
                         callbacks.triggerDialog([
                            {name: 'Cemre', text: 'Ooooh! Meyveler!'},
                            {name: 'Baba', text: 'Burası Meyve Cenneti! Hiç canavar yok, sadece eğlence!'}
                         ]);
                     }, 2000);
                 } else if (gameState.current.level === 3) {
                     gameState.current.status = 'transition';
                     gameState.current.cinematicMode = 'aurora_suction';
                     callbacks.setGameStatus('transition');
                     setTimeout(() => {
                         callbacks.loadLevel(4);
                         gameState.current.status = 'playing';
                         callbacks.setGameStatus('playing');
                         callbacks.triggerDialog([
                            {name: 'Baba', text: 'Dikkatli ol! Önümüzde bir şey var...'},
                            {name: 'Cemre', text: 'Ne kadar büyük! Yenmek için işbirliği yapmalıyız!'}
                         ]);
                     }, 2000);
                 } else {
                     gameState.current.status = 'won';
                     callbacks.setGameStatus('won');
                     soundManager.playWin();
                 }
             }
        } else {
            gameState.current.portalHoldTimer = 0;
        }

    }, [gameState, inputs, particles, effectParticles, callbacks]);

    return { updatePhysics };
};