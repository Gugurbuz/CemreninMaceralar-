
export class SoundManager {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private isMuted: boolean = false;
    private bgmInterval: number | null = null;
    private melodyIndex: number = 0;

    // Level 1: Northern Lights - Mystical, ethereal melody (E minor pentatonic)
    private level1Melody = [
       {f: 329.63, d: 1}, {f: 392.00, d: 0.5}, {f: 493.88, d: 0.5}, {f: 587.33, d: 1}, // E G B D
       {f: 493.88, d: 0.5}, {f: 392.00, d: 0.5}, {f: 329.63, d: 1.5}, {f: 293.66, d: 0.5}, // B G E D
       {f: 329.63, d: 0.5}, {f: 392.00, d: 0.5}, {f: 587.33, d: 1}, {f: 493.88, d: 1}, // E G D B
       {f: 392.00, d: 0.5}, {f: 329.63, d: 1.5}, {f: 293.66, d: 2}, // G E D
    ];

    // Level 2: Butterfly Valley - Light, floating melody (C Major)
    private level2Melody = [
       {f: 523.25, d: 0.25}, {f: 587.33, d: 0.25}, {f: 659.25, d: 0.5}, {f: 587.33, d: 0.5}, {f: 523.25, d: 0.5}, // C D E D C
       {f: 493.88, d: 0.5}, {f: 523.25, d: 0.5}, {f: 587.33, d: 1}, // B C D
       {f: 659.25, d: 0.25}, {f: 783.99, d: 0.25}, {f: 880.00, d: 0.5}, {f: 783.99, d: 0.5}, {f: 659.25, d: 0.5}, // E G A G E
       {f: 587.33, d: 0.5}, {f: 523.25, d: 1.5}, // D C
       {f: 392.00, d: 0.5}, {f: 440.00, d: 0.5}, {f: 493.88, d: 0.5}, {f: 523.25, d: 1.5}, // G A B C
    ];

    // Level 3: Fruit Paradise - Tropical, upbeat melody (G Major)
    private level3Melody = [
       {f: 392.00, d: 0.5}, {f: 493.88, d: 0.5}, {f: 587.33, d: 0.5}, {f: 392.00, d: 0.5}, // G B D G
       {f: 440.00, d: 0.5}, {f: 523.25, d: 0.5}, {f: 659.25, d: 1}, // A C E
       {f: 587.33, d: 0.5}, {f: 493.88, d: 0.5}, {f: 440.00, d: 0.5}, {f: 392.00, d: 0.5}, // D B A G
       {f: 329.63, d: 0.5}, {f: 392.00, d: 0.5}, {f: 493.88, d: 1}, // E G B
       {f: 523.25, d: 0.5}, {f: 587.33, d: 0.5}, {f: 659.25, d: 0.5}, {f: 783.99, d: 1.5}, // C D E G
    ];

    private melody = this.level1Melody;
    private noteTime: number = 0;
    private tempo: number = 140; // BPM
    private currentLevel: number = 1;

    constructor() {
        if (typeof window !== 'undefined') {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
                this.masterGain = this.ctx.createGain();
                this.masterGain.connect(this.ctx.destination);
                this.masterGain.gain.value = 0.15; // Master volume lowered
            }
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMute(mute: boolean) {
        this.isMuted = mute;
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.ctx?.currentTime || 0);
        }
    }

    playJump() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
        
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        
        osc.start(t);
        osc.stop(t + 0.1);
    }
    
    // New: Variable Bounce Sound
    playBounce(intensity: number) {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        // Sine wave sweep for a "Boing" sound
        osc.type = 'sine';
        
        // Base freq 200, scales up to 400 based on intensity
        const baseFreq = 200 + (intensity * 200); 
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, t + 0.1);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, t + 0.3);
        
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        
        osc.start(t);
        osc.stop(t + 0.3);
    }

    playCoin() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987, t); // B5
        osc.frequency.setValueAtTime(1318, t + 0.08); // E6
        
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        
        osc.start(t);
        osc.stop(t + 0.3);
    }

    playDamage() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(50, t + 0.3);
        
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.3);
        
        osc.start(t);
        osc.stop(t + 0.3);
    }

    playWin() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
        
        notes.forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.connect(gain);
            gain.connect(this.masterGain!);
            
            osc.type = 'triangle';
            osc.frequency.value = freq;
            
            const time = t + i * 0.1;
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
            
            osc.start(time);
            osc.stop(time + 0.1);
        });
    }

    setLevel(level: number) {
        this.currentLevel = level;
        if (level === 1) {
            this.melody = this.level1Melody;
            this.tempo = 120; // Slower, mystical
        } else if (level === 2) {
            this.melody = this.level2Melody;
            this.tempo = 150; // Light and flowing
        } else if (level === 3) {
            this.melody = this.level3Melody;
            this.tempo = 160; // Upbeat and tropical
        } else {
            this.melody = this.level1Melody;
            this.tempo = 140;
        }
    }

    startBGM(level?: number) {
        if (!this.ctx) return;
        if (level !== undefined) {
            this.setLevel(level);
        }
        this.stopBGM();
        this.noteTime = this.ctx.currentTime + 0.1;
        this.melodyIndex = 0;
        this.scheduleNote();
    }

    stopBGM() {
        if (this.bgmInterval) {
            window.clearTimeout(this.bgmInterval);
            this.bgmInterval = null;
        }
    }

    private scheduleNote = () => {
        if (!this.ctx) return;
        
        const secondsPerBeat = 60.0 / this.tempo;
        
        // Schedule slightly ahead
        while (this.noteTime < this.ctx.currentTime + 0.2) {
            const note = this.melody[this.melodyIndex];
            this.playBGMNote(note.f, this.noteTime, note.d * secondsPerBeat);
            this.noteTime += note.d * secondsPerBeat;
            
            this.melodyIndex = (this.melodyIndex + 1) % this.melody.length;
        }
        
        this.bgmInterval = window.setTimeout(this.scheduleNote, 25);
    }

    private playBGMNote(freq: number, time: number, duration: number) {
        if (this.isMuted) return;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        osc.type = 'triangle';
        osc.frequency.value = freq;
        
        // Pluck envelope
        gain.gain.setValueAtTime(0.0, time);
        gain.gain.linearRampToValueAtTime(0.05, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
        
        osc.start(time);
        osc.stop(time + duration);
    }
}

export const soundManager = new SoundManager();
