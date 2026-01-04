
import React, { useRef, useCallback, useEffect } from 'react';
import { GameState, Player, Particle, EffectParticle } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, HOT_CHOCOLATE_DURATION, LEVEL_1_WIDTH } from '../constants';

const generateSpriteSheet = (player: Player): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const w = player.size.width;
    const h = player.size.height;
    canvas.width = w * 4; 
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const colors = {
        skin: '#fcd34d',
        shoe: '#333',
        scarf: '#db2777', 
        beanie: '#1e3a8a', 
    };

    for (let frame = 0; frame < 4; frame++) {
        const xOffset = frame * w;
        ctx.save();
        ctx.translate(xOffset, 0);

        let legLeftY = 0, legRightY = 0, legLeftX = 0, legRightX = 0, bodyY = 0;

        if (frame === 1) { legLeftX = -6; legRightX = 6; bodyY = 1; } 
        else if (frame === 2) { legLeftX = 6; legRightX = -6; bodyY = 1; } 
        else if (frame === 3) { legLeftY = -5; legRightY = -8; legLeftX = 2; legRightX = -2; }

        ctx.fillStyle = colors.shoe;
        ctx.fillRect(5 + legLeftX, h - 10 + legLeftY, 8, 10);
        ctx.fillRect(w - 13 + legRightX, h - 10 + legRightY, 8, 10);

        ctx.fillStyle = player.color;
        ctx.fillRect(0, bodyY, w, h - 10);

        if (player.id === 'cemre') {
             ctx.save();
             const flutter = (frame % 2 !== 0) ? 0.8 : 1.0;
             ctx.translate(4, bodyY + 14);
             ctx.fillStyle = 'rgba(224, 247, 255, 0.85)'; 
             ctx.strokeStyle = '#60a5fa'; 
             ctx.lineWidth = 1;
             ctx.beginPath();
             ctx.ellipse(-2, -6, 9 * flutter, 6, -Math.PI/4, 0, Math.PI*2);
             ctx.fill();
             ctx.stroke();
             ctx.beginPath();
             ctx.ellipse(-1, 4, 6 * flutter, 4, Math.PI/4, 0, Math.PI*2);
             ctx.fill();
             ctx.stroke();
             ctx.restore();
        }

        if (player.id === 'cemre') {
            ctx.fillStyle = colors.scarf;
            ctx.fillRect(-2, bodyY + 25, w + 4, 8); 
            if (frame > 0) {
                 const tailY = frame % 2 === 0 ? 0 : 2;
                 ctx.save();
                 ctx.translate(-10, bodyY + 25 + tailY);
                 ctx.rotate(-0.1);
                 ctx.fillStyle = colors.scarf;
                 ctx.fillRect(0, 0, 12, 8); 
                 ctx.restore();
            } else {
                 ctx.fillStyle = colors.scarf;
                 ctx.fillRect(-8, bodyY + 25, 8, 8);
            }
        } else {
            const beanieY = bodyY;
            ctx.fillStyle = colors.beanie;
            ctx.beginPath();
            ctx.arc(w/2, beanieY + 6, w/2 + 1, Math.PI, 0); 
            ctx.fill();
            ctx.fillStyle = '#60a5fa'; 
            ctx.fillRect(0, beanieY + 2, w, 4);
            ctx.fillStyle = colors.beanie;
            ctx.fillRect(-2, beanieY + 6, w + 4, 6); 
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(w/2, beanieY - 4, 7, 0, Math.PI*2);
            ctx.fill();
        }

        const eyeY = 15 + bodyY;
        const eyeXCenter = w * 0.7;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(eyeXCenter - 6, eyeY, 5, 0, Math.PI*2);
        ctx.arc(eyeXCenter + 6, eyeY, 5, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(eyeXCenter - 4, eyeY, 2, 0, Math.PI*2);
        ctx.arc(eyeXCenter + 8, eyeY, 2, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.arc(eyeXCenter, eyeY + 6, 3, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
    return canvas;
};

export const useGameRenderer = (
    gameState: React.MutableRefObject<GameState>,
    particles: React.MutableRefObject<Particle[]>,
    effectParticles: React.MutableRefObject<EffectParticle[]>
) => {
    const sprites = useRef<Record<string, HTMLCanvasElement>>({});
    const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const snowSpriteRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        // Init Sprites
        gameState.current.players.forEach(p => {
             sprites.current[p.id] = generateSpriteSheet(p);
        });

        // Init Snow Sprite
        const snowCanv = document.createElement('canvas');
        snowCanv.width = 8;
        snowCanv.height = 8;
        const sCtx = snowCanv.getContext('2d');
        if (sCtx) {
            const grad = sCtx.createRadialGradient(4, 4, 0, 4, 4, 4);
            grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            sCtx.fillStyle = grad;
            sCtx.fillRect(0, 0, 8, 8);
            snowSpriteRef.current = snowCanv;
        }
    }, []);

    const renderStaticBackground = useCallback((level: number) => {
        const bg = document.createElement('canvas');
        bg.width = CANVAS_WIDTH;
        bg.height = CANVAS_HEIGHT;
        const ctx = bg.getContext('2d');
        if (!ctx) return;
  
        // BASE GRADIENT
        if (level === 1) {
            const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
            bgGradient.addColorStop(0, '#0f172a'); 
            bgGradient.addColorStop(1, '#1e3a8a'); 
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            // Stars
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            for(let i=0; i<100; i++) {
                ctx.beginPath();
                ctx.arc(Math.random()*CANVAS_WIDTH, Math.random()*CANVAS_HEIGHT, Math.random()*1.5, 0, Math.PI*2);
                ctx.fill();
            }
        } else if (level === 2) {
            const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
            bgGradient.addColorStop(0, '#7dd3fc'); 
            bgGradient.addColorStop(1, '#c084fc'); 
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        } else if (level === 3) {
            // Level 3: Sunset / Paradise
            const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
            bgGradient.addColorStop(0, '#f9a8d4'); // Pink
            bgGradient.addColorStop(0.5, '#fdba74'); // Orange
            bgGradient.addColorStop(1, '#60a5fa'); // Blue
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            // Sun
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(CANVAS_WIDTH * 0.8, CANVAS_HEIGHT * 0.2, 80, 0, Math.PI*2);
            ctx.fill();
        }
        bgCanvasRef.current = bg;
    }, []);

    // NEW: Aurora Renderer
    const drawAurora = useCallback((ctx: CanvasRenderingContext2D) => {
        const time = gameState.current.globalTime * 0.02;
        const width = CANVAS_WIDTH;
        const height = CANVAS_HEIGHT;

        // Calculate opacity based on progress in Level 1
        let opacity = 0;
        if (gameState.current.level === 1) {
            const camX = gameState.current.camera.x;
            opacity = Math.max(0, Math.min(1, (camX - 6000) / 4000));
        } else {
            return; // No aurora in level 2/3
        }

        if (opacity <= 0.01) return;

        ctx.save();
        ctx.globalAlpha = opacity * 0.6; // Max 0.6 opacity
        ctx.globalCompositeOperation = 'screen';

        // Draw multiple ribbons
        for (let i = 0; i < 3; i++) {
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, 'rgba(0, 255, 128, 0)');
            gradient.addColorStop(0.5, 'rgba(0, 255, 128, 0.5)');
            gradient.addColorStop(1, 'rgba(128, 0, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            
            const offset = i * 100;
            const speed = time + i;

            ctx.moveTo(0, height); // Start bottom left
            
            // Draw Sine wave top
            for (let x = 0; x <= width; x += 50) {
                const y = height / 2 - 150 + Math.sin(x * 0.005 + speed) * 100 + Math.sin(x * 0.01 - speed * 0.5) * 50 + offset;
                ctx.lineTo(x, y);
            }

            ctx.lineTo(width, height); // Bottom right
            ctx.lineTo(0, height); // Bottom left
            ctx.fill();
        }

        ctx.restore();
    }, [gameState]);

    const drawParallax = useCallback((ctx: CanvasRenderingContext2D) => {
        const camX = gameState.current.camera.x;
        const level = gameState.current.level;
        
        // Layer 1: Sky & Stars (Static)
        if (bgCanvasRef.current) {
            ctx.drawImage(bgCanvasRef.current, 0, 0);
        }

        // Layer 1.5: Aurora (Behind Mountains, appears late game)
        drawAurora(ctx);

        // --- LAYER 2: MOUNTAINS (Moves at 10% speed) ---
        ctx.save();
        const parallaxX = -(camX * 0.1); 
        ctx.translate(parallaxX % CANVAS_WIDTH, 0);
        
        // Draw 2 screens worth to loop seamlessly
        for(let i=0; i<2; i++) {
            const offset = i * CANVAS_WIDTH;
            if (level === 1) {
                // Winter Mountains
                ctx.fillStyle = '#1e3a8a'; 
                ctx.beginPath();
                ctx.moveTo(offset, CANVAS_HEIGHT);
                ctx.lineTo(offset + 200, 200); 
                ctx.lineTo(offset + 500, 450);
                ctx.lineTo(offset + 800, 150);
                ctx.lineTo(offset + CANVAS_WIDTH, CANVAS_HEIGHT);
                ctx.fill();
            } else if (level === 2) {
                // Spring Mountains
                ctx.fillStyle = '#60a5fa'; 
                ctx.beginPath();
                ctx.moveTo(offset, CANVAS_HEIGHT);
                ctx.lineTo(offset + 300, 400);
                ctx.lineTo(offset + 700, 600);
                ctx.lineTo(offset + 1000, 350);
                ctx.lineTo(offset + CANVAS_WIDTH, CANVAS_HEIGHT);
                ctx.fill();
            } else {
                // Level 3: Candy Mountains
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(offset + 200, CANVAS_HEIGHT, 300, 0, Math.PI, true);
                ctx.arc(offset + 800, CANVAS_HEIGHT, 400, 0, Math.PI, true);
                ctx.fill();
            }
        }
        ctx.restore();

        // --- LAYER 3: TREES / HILLS (Moves at 30% speed) ---
        ctx.save();
        const parallaxX2 = -(camX * 0.3);
        ctx.translate(parallaxX2 % CANVAS_WIDTH, 0);

        for(let i=0; i<2; i++) {
            const offset = i * CANVAS_WIDTH;
            if (level === 1) {
                // Winter Hills
                ctx.fillStyle = '#334155';
                ctx.beginPath();
                ctx.moveTo(offset, CANVAS_HEIGHT);
                ctx.ellipse(offset + 200, CANVAS_HEIGHT, 300, 150, 0, 0, Math.PI*2);
                ctx.ellipse(offset + 800, CANVAS_HEIGHT, 400, 200, 0, 0, Math.PI*2);
                ctx.fill();
            } else if (level === 2) {
                // Spring Green Hills
                ctx.fillStyle = '#4ade80'; // Lighter green
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.moveTo(offset, CANVAS_HEIGHT);
                ctx.ellipse(offset + 300, CANVAS_HEIGHT, 300, 100, 0, 0, Math.PI*2);
                ctx.ellipse(offset + 900, CANVAS_HEIGHT, 400, 120, 0, 0, Math.PI*2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            } else {
                 // Level 3: Fluffy Clouds
                 ctx.fillStyle = '#ffffff';
                 ctx.globalAlpha = 0.6;
                 ctx.beginPath();
                 ctx.arc(offset + 100, CANVAS_HEIGHT - 50, 80, 0, Math.PI*2);
                 ctx.arc(offset + 250, CANVAS_HEIGHT - 30, 100, 0, Math.PI*2);
                 ctx.arc(offset + 400, CANVAS_HEIGHT - 50, 80, 0, Math.PI*2);
                 ctx.fill();
                 ctx.globalAlpha = 1.0;
            }
        }
        ctx.restore();

    }, [gameState, drawAurora]);

    const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, p: Player) => {
        if (p.invincibleTimer > 0 && Math.floor(gameState.current.globalTime / 4) % 2 === 0) {
            return; 
        }
  
        // OPTIMIZED WARMTH BUFF RENDER
        if (p.buff?.type === 'warmth') {
            ctx.save();
            ctx.globalAlpha = 0.4 + Math.sin(gameState.current.globalTime * 0.2) * 0.1;
            ctx.fillStyle = '#fdba74';
            ctx.beginPath();
            ctx.arc(p.position.x + p.size.width/2, p.position.y + p.size.height/2, Math.max(p.size.width, p.size.height) * 1.2, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        }
  
        const spriteSheet = sprites.current[p.id];
        const w = p.size.width;
        const h = p.size.height;
        let frameIndex = 0;
        if (!p.isGrounded) frameIndex = 3;
        else if (Math.abs(p.velocity.x) > 0.5) frameIndex = (Math.floor(p.animFrame) % 2) + 1;
  
        ctx.save();
        
        // SQUASH AND STRETCH TRANSFORMATION
        const cx = p.position.x + w/2;
        const cy = p.position.y + h; // Pivot at bottom center
        
        ctx.translate(cx, cy);
        
        // Apply facing direction AND squash/stretch scale
        // Default scale is (1, 1). If facing left, x becomes negative.
        const scaleX = (p.facing === 'left' ? -1 : 1) * (p.scale ? p.scale.x : 1);
        const scaleY = p.scale ? p.scale.y : 1;

        ctx.scale(scaleX, scaleY);

        // Draw sprite shifted up by height because pivot is at bottom
        if (spriteSheet) {
            ctx.drawImage(spriteSheet, frameIndex * w, 0, w, h, -w/2, -h, w, h);
        } else {
            ctx.fillStyle = p.color;
            ctx.fillRect(-w/2, -h, w, h);
        }
        ctx.restore();
  
        // Name tag (Keep separate so it doesn't squash/stretch/flip weirdly)
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Fredoka';
        ctx.textAlign = 'center';
        ctx.fillText(p.name, p.position.x + w/2, p.position.y - 10);
        
        ctx.beginPath();
        ctx.moveTo(p.position.x + w/2, p.position.y - 20);
        ctx.lineTo(p.position.x + w/2 - 5, p.position.y - 30);
        ctx.lineTo(p.position.x + w/2 + 5, p.position.y - 30);
        ctx.fillStyle = p.color;
        ctx.fill();
  
        if (p.buff?.type === 'warmth') {
             const barWidth = 40;
             const pct = p.buff.timer / HOT_CHOCOLATE_DURATION;
             ctx.fillStyle = '#444';
             ctx.fillRect(p.position.x + w/2 - barWidth/2, p.position.y - 45, barWidth, 6);
             ctx.fillStyle = '#f97316';
             ctx.fillRect(p.position.x + w/2 - barWidth/2 + 1, p.position.y - 44, (barWidth-2)*pct, 4);
             ctx.fillText('☕', p.position.x + w/2, p.position.y - 50);
        }
    }, [gameState]);

    const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
        const isLevel1 = gameState.current.level === 1;
        
        particles.current.forEach(p => {
            if (isLevel1) {
                if (snowSpriteRef.current) {
                    ctx.globalAlpha = 0.8;
                    ctx.drawImage(snowSpriteRef.current, p.x, p.y, p.size, p.size);
                    ctx.globalAlpha = 1.0;
                } else {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size/2, 0, Math.PI*2);
                    ctx.fill();
                }
            } else {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.ellipse(p.x, p.y, p.size, p.size/2, p.angle, 0, Math.PI*2);
                ctx.fill();
            }
        });
    }, [gameState, particles]);

    const drawEffects = useCallback((ctx: CanvasRenderingContext2D) => {
        effectParticles.current.forEach(p => {
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;
    }, [effectParticles]);

    const drawFloatingTexts = useCallback((ctx: CanvasRenderingContext2D) => {
        gameState.current.floatingTexts.forEach(ft => {
            ctx.globalAlpha = ft.life / 60;
            ctx.fillStyle = ft.color;
            ctx.font = 'bold 20px Fredoka';
            ctx.textAlign = 'center';
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.strokeText(ft.text, ft.x, ft.y);
        });
        ctx.globalAlpha = 1.0;
    }, [gameState]);

    const drawVignette = useCallback((ctx: CanvasRenderingContext2D) => {
        const players = gameState.current.players.filter(p => !p.isDead);
        if (players.length === 0) return;

        const lowHealth = players.some(p => p.lives <= 1);
        
        if (lowHealth) {
            const opacity = 0.3 + Math.sin(gameState.current.globalTime * 0.2) * 0.1; // Pulse
            const grad = ctx.createRadialGradient(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 300, CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH);
            grad.addColorStop(0, 'rgba(255, 0, 0, 0)');
            grad.addColorStop(1, `rgba(255, 0, 0, ${opacity})`);
            
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    }, [gameState]);

    const draw = useCallback((ctx: CanvasRenderingContext2D) => {
        // 1. Draw Parallax Background (Replaces simple drawBackground)
        drawParallax(ctx);
        
        drawParticles(ctx);
    
        ctx.save();
        
        let shakeX = 0;
        let shakeY = 0;
        if (gameState.current.screenShake > 0) {
            shakeX = (Math.random() - 0.5) * gameState.current.screenShake;
            shakeY = (Math.random() - 0.5) * gameState.current.screenShake;
        }
        ctx.translate(-gameState.current.camera.x + shakeX, shakeY);
    
        gameState.current.platforms.forEach(plat => {
          if (plat.type === 'crumbly' && plat.isFalling && (plat.fallTimer || 0) <= 0) return;
          if (plat.type === 'door' && plat.isOpen) {
              ctx.fillStyle = 'rgba(255,255,255,0.1)';
              ctx.fillRect(plat.position.x, plat.position.y, plat.size.width, plat.size.height);
              return; 
          }
    
          ctx.fillStyle = plat.color;
          
          if (plat.type === 'ground') {
              ctx.fillRect(plat.position.x, plat.position.y, plat.size.width, plat.size.height);
              // Top detail
              if (gameState.current.level === 1) ctx.fillStyle = '#f8fafc';
              else if (gameState.current.level === 2) ctx.fillStyle = '#86efac';
              else ctx.fillStyle = '#fce7f3'; // Pink grass for level 3
              
              ctx.fillRect(plat.position.x, plat.position.y, plat.size.width, 10);

          } else if (plat.type === 'leaf') {
               ctx.fillStyle = '#22c55e';
               ctx.beginPath();
               ctx.ellipse(plat.position.x + plat.size.width/2, plat.position.y + plat.size.height/2, plat.size.width/2, plat.size.height, 0, 0, Math.PI*2);
               ctx.fill();
          } else if (plat.type === 'cloud') {
               // Draw fluffy cloud platform
               ctx.fillStyle = 'white';
               const r = plat.size.height / 2;
               ctx.beginPath();
               ctx.arc(plat.position.x + r, plat.position.y + r, r, Math.PI * 0.5, Math.PI * 1.5);
               ctx.arc(plat.position.x + plat.size.width - r, plat.position.y + r, r, Math.PI * 1.5, Math.PI * 0.5);
               ctx.closePath();
               ctx.fill();

          } else if (plat.type === 'mushroom') {
               const deformation = plat.deformation || 0;
               
               if (gameState.current.level === 1) {
                    // WINTER GEYSER RENDERER
                    const cx = plat.position.x + plat.size.width/2;
                    const cy = plat.position.y + plat.size.height/2;

                    ctx.save();
                    ctx.translate(cx, cy);
                    ctx.scale(1 - deformation, 1 + deformation);
                    ctx.translate(-cx, -cy);

                    // Stone Rim
                    ctx.fillStyle = '#475569';
                    ctx.beginPath();
                    ctx.ellipse(cx, cy + 10, plat.size.width/2, 10, 0, 0, Math.PI*2);
                    ctx.fill();

                    // Water Pool
                    ctx.fillStyle = '#0ea5e9'; // Sky blue water
                    ctx.beginPath();
                    ctx.ellipse(cx, cy + 10, plat.size.width/2 - 5, 8, 0, 0, Math.PI*2);
                    ctx.fill();

                    // Steam/Blast Effect if active
                    if (deformation < 0) {
                        ctx.fillStyle = 'rgba(224, 242, 254, 0.8)'; // Steam color
                        ctx.beginPath();
                        ctx.moveTo(cx - 20, cy + 10);
                        ctx.lineTo(cx + 20, cy + 10);
                        ctx.lineTo(cx + 10, cy - 100);
                        ctx.lineTo(cx - 10, cy - 100);
                        ctx.fill();
                    } else {
                        // Resting steam bubbles - OPTIMIZED: Reduce math
                        ctx.fillStyle = 'rgba(255,255,255,0.6)';
                        // Simplified calculation
                        const bubble1X = cx + (gameState.current.globalTime % 20 - 10);
                        ctx.beginPath(); ctx.arc(bubble1X, cy, 3, 0, Math.PI*2); ctx.fill();
                    }

                    ctx.restore();
               } else {
                   // ORIGINAL MUSHROOM RENDERER (Level 2 & 3)
                   const cx = plat.position.x + 50;
                   const cy = plat.position.y + 100;
        
                   ctx.save();
                   ctx.translate(cx, cy);
                   ctx.scale(1 - deformation, 1 + deformation);
                   ctx.translate(-cx, -cy);
        
                   ctx.fillStyle = plat.color;
                   ctx.beginPath();
                   ctx.arc(plat.position.x + 50, plat.position.y + 40, 50, Math.PI, 0);
                   ctx.fill();

                   // Stalk
                   ctx.fillStyle = '#fde047';
                   ctx.fillRect(plat.position.x + 30, plat.position.y + 40, 40, 60);

                   // Cap Spots
                   ctx.fillStyle = 'rgba(255,255,255,0.6)';
                   ctx.beginPath(); ctx.arc(plat.position.x + 30, plat.position.y + 20, 8, 0, Math.PI*2); ctx.fill();
                   ctx.beginPath(); ctx.arc(plat.position.x + 70, plat.position.y + 30, 6, 0, Math.PI*2); ctx.fill();
                   ctx.beginPath(); ctx.arc(plat.position.x + 50, plat.position.y + 10, 5, 0, Math.PI*2); ctx.fill();
                   
                   ctx.restore();
               }
    
          } else if (plat.type === 'totem') {
               ctx.fillStyle = '#475569';
               ctx.fillRect(plat.position.x, plat.position.y, plat.size.width, plat.size.height);
               ctx.fillStyle = plat.isActive ? '#38bdf8' : '#64748b'; 
               ctx.beginPath();
               ctx.arc(plat.position.x + 20, plat.position.y, 30, 0, Math.PI*2);
               ctx.fill();
               ctx.fillStyle = 'white';
               ctx.beginPath(); ctx.arc(plat.position.x + 10, plat.position.y - 5, 5, 0, Math.PI*2); ctx.fill();
               ctx.beginPath(); ctx.arc(plat.position.x + 30, plat.position.y - 5, 5, 0, Math.PI*2); ctx.fill();
               ctx.beginPath();
               if (plat.isActive) {
                   ctx.arc(plat.position.x + 20, plat.position.y + 10, 8, 0, Math.PI*2);
               } else {
                   ctx.moveTo(plat.position.x + 10, plat.position.y + 10);
                   ctx.lineTo(plat.position.x + 30, plat.position.y + 10);
               }
               ctx.stroke();
    
          } else if (plat.type === 'ice') {
              if (gameState.current.level === 2) {
                 ctx.fillStyle = 'rgba(56, 189, 248, 0.6)'; 
                 ctx.fillRect(plat.position.x, plat.position.y, plat.size.width, plat.size.height);
                 ctx.fillStyle = 'rgba(255,255,255,0.8)';
                 ctx.fillRect(plat.position.x, plat.position.y, plat.size.width, 5);
                 const t = gameState.current.globalTime * 0.1;
                 ctx.beginPath();
                 for(let i=0; i<plat.size.width; i+=20) {
                     ctx.moveTo(plat.position.x + i, plat.position.y);
                     ctx.lineTo(plat.position.x + i + 10, plat.position.y + Math.sin(t + i)*3);
                 }
                 ctx.stroke();
              } else {
                 ctx.fillStyle = 'rgba(186, 230, 253, 0.8)';
                 ctx.fillRect(plat.position.x, plat.position.y, plat.size.width, plat.size.height);
                 ctx.fillStyle = 'rgba(255,255,255,0.5)';
                 ctx.beginPath();
                 ctx.moveTo(plat.position.x, plat.position.y);
                 ctx.lineTo(plat.position.x + plat.size.width, plat.position.y);
                 ctx.lineTo(plat.position.x, plat.position.y + plat.size.height);
                 ctx.fill();
              }
          } else if (plat.type === 'aurora') {
              const gradient = ctx.createLinearGradient(0, plat.position.y + 100, 0, plat.position.y - 400);
              if (gameState.current.level === 1) {
                  gradient.addColorStop(0, 'rgba(74, 222, 128, 0.6)'); 
                  gradient.addColorStop(1, 'rgba(168, 85, 247, 0)'); 
              } else {
                  gradient.addColorStop(0, 'rgba(250, 204, 21, 0.6)'); 
                  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); 
              }
    
              ctx.fillStyle = gradient;
              const beamWidth = 80;
              const centerX = plat.position.x + plat.size.width/2;
              
              ctx.beginPath();
              ctx.moveTo(centerX - beamWidth/2, plat.position.y + 50);
              ctx.lineTo(centerX + beamWidth/2, plat.position.y + 50);
              ctx.lineTo(centerX + beamWidth, plat.position.y - 600);
              ctx.lineTo(centerX - beamWidth, plat.position.y - 600);
              ctx.fill();
    
              if (gameState.current.portalHoldTimer > 0) {
                  const radius = (gameState.current.portalHoldTimer / 90) * 100; 
                  ctx.beginPath();
                  ctx.arc(centerX, plat.position.y - 50, radius, 0, Math.PI * 2);
                  ctx.strokeStyle = 'white';
                  ctx.lineWidth = 4;
                  ctx.stroke();
                  
                  if (gameState.current.portalHoldTimer % 10 < 5) {
                       ctx.fillStyle = 'white';
                       ctx.font = 'bold 20px Fredoka';
                       ctx.textAlign = 'center';
                       ctx.fillText("Bekle!", centerX, plat.position.y - 80);
                  }
              } else if (plat.requiresCoop && gameState.current.gameMode === 'multi') {
                   ctx.fillStyle = 'white';
                   ctx.font = 'bold 20px Fredoka';
                   ctx.textAlign = 'center';
                   ctx.fillText("İkiniz de Gelin!", centerX, plat.position.y - 50);
                   if (gameState.current.globalTime % 60 < 30) {
                       ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                       ctx.lineWidth = 2;
                       ctx.strokeText("İkiniz de Gelin!", centerX, plat.position.y - 50);
                   }
              }
          } else if (plat.type === 'crumbly') {
              if (plat.respawnTimer && plat.respawnTimer > 0) {
                  ctx.globalAlpha = 0.3;
                  ctx.fillStyle = plat.color;
                  ctx.fillRect(plat.position.x, plat.position.y, plat.size.width, plat.size.height);
                  ctx.globalAlpha = 1.0;
              } else {
                  if (plat.color === '#bae6fd') {
                      ctx.fillStyle = 'rgba(186, 230, 253, 0.9)';
                      ctx.fillRect(plat.position.x, plat.position.y, plat.size.width, plat.size.height);
                      ctx.strokeStyle = 'white';
                      ctx.lineWidth = 2;
                      ctx.beginPath();
                      ctx.moveTo(plat.position.x, plat.position.y); ctx.lineTo(plat.position.x + 20, plat.position.y + 20);
                      ctx.moveTo(plat.position.x + plat.size.width, plat.position.y); ctx.lineTo(plat.position.x + plat.size.width - 20, plat.position.y + 20);
                      ctx.stroke();
                  } else {
                      ctx.fillStyle = plat.color;
                      ctx.fillRect(plat.position.x, plat.position.y, plat.size.width, plat.size.height);
                  }
                  
                  if (plat.isFalling) {
                       ctx.strokeStyle = '#475569';
                       ctx.lineWidth = 2;
                       ctx.beginPath();
                       ctx.moveTo(plat.position.x + 10, plat.position.y);
                       ctx.lineTo(plat.position.x + 20, plat.position.y + 15);
                       ctx.lineTo(plat.position.x + 40, plat.position.y + 5);
                       ctx.stroke();
                  }
              }
          } else {
              ctx.fillRect(plat.position.x, plat.position.y, plat.size.width, plat.size.height);
          }
        });
    
        gameState.current.checkpoints.forEach(cp => {
            ctx.fillStyle = '#94a3b8'; 
            ctx.fillRect(cp.position.x + 5, cp.position.y, 5, cp.size.height);
            ctx.fillStyle = cp.triggered ? '#22c55e' : '#ef4444';
            ctx.beginPath();
            ctx.moveTo(cp.position.x + 10, cp.position.y + 5);
            ctx.lineTo(cp.position.x + 35, cp.position.y + 20);
            ctx.lineTo(cp.position.x + 10, cp.position.y + 35);
            ctx.fill();
        });
    
        gameState.current.coins.forEach(coin => {
            if (coin.collected && !coin.isNectarDrop) return;
            const bob = Math.sin(gameState.current.globalTime * 0.1) * 5;
            const cy = coin.baseY + bob;
    
            if (coin.type === 'kanelbulle') {
                ctx.fillStyle = '#d97706'; 
                ctx.beginPath(); ctx.arc(coin.position.x, cy, coin.size, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = '#78350f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(coin.position.x, cy, coin.size * 0.6, 0, Math.PI*1.5); ctx.stroke();
            } else if (coin.type === 'gold') {
                ctx.fillStyle = '#fbbf24'; 
                ctx.beginPath(); ctx.arc(coin.position.x, cy, coin.size, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(coin.position.x, cy, coin.size * 0.7, 0, Math.PI*2); ctx.fill();
            } else if (coin.type === 'hot-chocolate') {
                ctx.fillStyle = '#ef4444'; ctx.fillRect(coin.position.x - 8, cy - 8, 16, 16);
                ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(coin.position.x + 8, cy, 5, -Math.PI/2, Math.PI/2); ctx.stroke();
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.globalAlpha = 0.7;
                const steamOffset = Math.sin(gameState.current.globalTime * 0.1) * 2;
                ctx.beginPath(); ctx.moveTo(coin.position.x - 3, cy - 10); ctx.lineTo(coin.position.x - 3 + steamOffset, cy - 18);
                ctx.moveTo(coin.position.x + 3, cy - 10); ctx.lineTo(coin.position.x + 3 + steamOffset, cy - 18); ctx.stroke(); ctx.globalAlpha = 1.0;
            } else if (coin.type === 'apple') {
                ctx.fillStyle = '#ef4444'; 
                ctx.beginPath(); ctx.arc(coin.position.x, cy, coin.size, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#65a30d'; // Leaf
                ctx.beginPath(); ctx.ellipse(coin.position.x, cy - coin.size, 4, 2, 0, 0, Math.PI*2); ctx.fill();
            } else if (coin.type === 'cherry') {
                ctx.fillStyle = '#be123c';
                ctx.beginPath(); ctx.arc(coin.position.x - 5, cy + 2, coin.size * 0.7, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(coin.position.x + 5, cy + 4, coin.size * 0.7, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = '#65a30d'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(coin.position.x - 5, cy + 2); ctx.lineTo(coin.position.x, cy - 10); ctx.lineTo(coin.position.x + 5, cy + 4); ctx.stroke();
            } else if (coin.type === 'banana') {
                ctx.fillStyle = '#facc15';
                ctx.beginPath();
                ctx.arc(coin.position.x, cy, coin.size, 0.5, Math.PI - 0.5);
                ctx.stroke(); // Simple curve
                // Draw banana shape
                ctx.beginPath();
                ctx.moveTo(coin.position.x - 10, cy - 5);
                ctx.quadraticCurveTo(coin.position.x, cy + 10, coin.position.x + 10, cy - 10);
                ctx.quadraticCurveTo(coin.position.x, cy + 5, coin.position.x - 10, cy - 5);
                ctx.fill();
            }
    
            const shimmerPos = (gameState.current.globalTime * 5) % (coin.size * 4) - coin.size * 2;
            ctx.save();
            ctx.beginPath(); ctx.arc(coin.position.x, cy, coin.size, 0, Math.PI * 2); ctx.clip();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.moveTo(coin.position.x + shimmerPos - 5, cy - coin.size);
            ctx.lineTo(coin.position.x + shimmerPos + 5, cy - coin.size);
            ctx.lineTo(coin.position.x + shimmerPos + 15, cy + coin.size);
            ctx.lineTo(coin.position.x + shimmerPos + 5, cy + coin.size);
            ctx.fill();
            ctx.restore();
        });
    
        gameState.current.enemies.forEach(enemy => {
            const x = enemy.position.x;
            const y = enemy.position.y;
            
            if (enemy.type === 'snowman') {
                ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + 20, y + 35, 15, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(x + 20, y + 15, 12, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(x + 20, y - 2, 10, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.moveTo(x + 25, y - 2); ctx.lineTo(x + 35, y); ctx.lineTo(x + 25, y + 2); ctx.fill();
                ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(x + 16, y - 4, 1.5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(x + 24, y - 4, 1.5, 0, Math.PI*2); ctx.fill();
            } else if (enemy.type === 'slime') {
                ctx.fillStyle = enemy.color;
                ctx.beginPath();
                ctx.arc(x + 20, y + 20, 15, Math.PI, 0); 
                ctx.lineTo(x + 40, y + 30);
                ctx.lineTo(x, y + 30);
                ctx.fill();
                ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(x + 15, y + 15, 4, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(x + 25, y + 15, 4, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(x + 15, y + 15, 2, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(x + 25, y + 15, 2, 0, Math.PI*2); ctx.fill();
            } else if (enemy.type === 'yeti') {
                ctx.fillStyle = enemy.color; ctx.fillRect(x, y, enemy.size.width, enemy.size.height);
                ctx.fillStyle = '#94a3b8'; ctx.fillRect(x + 10, y + 10, enemy.size.width - 20, 20);
                ctx.fillStyle = '#ef4444'; const dirOffset = (enemy.direction || 1) === 1 ? 5 : -5;
                ctx.fillRect(x + 20 + dirOffset, y + 15, 5, 5); ctx.fillRect(x + 35 + dirOffset, y + 15, 5, 5);
            } else if (enemy.type === 'bird') {
                // Better Bird/Crow Rendering
                // Body - Lighter grey for visibility against dark sky
                ctx.fillStyle = '#334155'; // Slate 700
                ctx.beginPath(); 
                ctx.ellipse(x + 20, y + 10, 20, 10, 0, 0, Math.PI * 2);
                ctx.fill();

                // Wings
                const flap = Math.sin(gameState.current.globalTime * 0.5) * 10;
                ctx.fillStyle = '#1e293b'; // Slate 800 (darker)
                ctx.beginPath(); 
                ctx.moveTo(x + 10, y + 5); 
                ctx.lineTo(x - 5, y - 10 + flap); 
                ctx.lineTo(x + 15, y + 5); 
                ctx.fill();
                
                ctx.beginPath(); 
                ctx.moveTo(x + 25, y + 5); 
                ctx.lineTo(x + 45, y - 10 + flap); 
                ctx.lineTo(x + 30, y + 5); 
                ctx.fill();

                // Beak
                ctx.fillStyle = '#fbbf24'; // Yellow
                ctx.beginPath();
                const facingRight = (enemy.direction || 1) === 1;
                if (facingRight) {
                    ctx.moveTo(x + 35, y + 8);
                    ctx.lineTo(x + 45, y + 12);
                    ctx.lineTo(x + 35, y + 14);
                } else {
                    ctx.moveTo(x + 5, y + 8);
                    ctx.lineTo(x - 5, y + 12);
                    ctx.lineTo(x + 5, y + 14);
                }
                ctx.fill();

                // Eye
                ctx.fillStyle = 'white';
                const eyeX = facingRight ? x + 30 : x + 10;
                ctx.beginPath(); ctx.arc(eyeX, y + 8, 4, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = 'black';
                const pupilX = facingRight ? eyeX + 1.5 : eyeX - 1.5;
                ctx.beginPath(); ctx.arc(pupilX, y + 8, 2, 0, Math.PI*2); ctx.fill();
            }
        });
    
        gameState.current.players.forEach(p => {
            if (!p.isDead) drawPlayer(ctx, p);
        });
    
        drawEffects(ctx); 
        drawFloatingTexts(ctx); 
        
        // NEW: Draw Vignette on top of everything
        drawVignette(ctx);
    
        ctx.restore();
    
        if (gameState.current.cinematicMode !== 'none') {
            const barHeight = 60;
            ctx.fillStyle = 'black';
            const progress = Math.min(100, gameState.current.portalHoldTimer > 90 ? 100 : 0); 
            const h = gameState.current.status === 'won' ? barHeight : (barHeight * (progress/100)); 
            
            ctx.fillRect(0, 0, CANVAS_WIDTH, h);
            ctx.fillRect(0, CANVAS_HEIGHT - h, CANVAS_WIDTH, h);
        }
    }, [drawParallax, drawEffects, drawFloatingTexts, drawParticles, drawPlayer, drawVignette, gameState, drawAurora]);

    return { renderStaticBackground, draw };
};
