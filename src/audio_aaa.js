/**
 * Learn & Leap AAA Procedural Fantasy Audio Engine (Web Audio API, zero external files).
 * Layered harp/celesta chimes, pitch-scaled combo notes, airy jump/dash whooshes,
 * crystalline arcane magic bolts, crunchy impacts, boss rumble, and triumphant fanfares.
 */

const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];

class FantasyAudioEngine {
  constructor() {
    this.ctx = null;
    this.noiseBuffer = null;
    this.enabled = false;
  }

  ensureContext() {
    if (!this.enabled || typeof window === 'undefined') return null;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  setEnabled(flag) {
    this.enabled = Boolean(flag);
    if (this.enabled) this.ensureContext();
  }

  getNoiseBuffer(ac) {
    if (this.noiseBuffer) return this.noiseBuffer;
    const len = ac.sampleRate * 0.4;
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buf;
    return buf;
  }

  tone(freq, endFreq, duration, type = 'sine', volume = 0.08, delay = 0) {
    const ac = this.ensureContext();
    if (!ac) return;
    try {
      const now = ac.currentTime + delay;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(40, freq), now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + duration);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + Math.min(0.015, duration * 0.25));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {}
  }

  whoosh(duration = 0.16, startFreq = 900, endFreq = 260, volume = 0.06) {
    const ac = this.ensureContext();
    if (!ac) return;
    try {
      const now = ac.currentTime;
      const src = ac.createBufferSource();
      src.buffer = this.getNoiseBuffer(ac);
      const filter = ac.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 2.1;
      filter.frequency.setValueAtTime(startFreq, now);
      filter.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);
      src.start(now);
      src.stop(now + duration + 0.02);
    } catch {}
  }

  playJump(isDouble = false) {
    const jitter = 0.96 + Math.random() * 0.08;
    if (isDouble) {
      this.tone(420 * jitter, 880 * jitter, 0.15, 'triangle', 0.075);
      this.tone(630 * jitter, 1260 * jitter, 0.18, 'sine', 0.05, 0.02);
      this.whoosh(0.14, 1600, 520, 0.045);
    } else {
      this.tone(260 * jitter, 540 * jitter, 0.12, 'triangle', 0.075);
      this.whoosh(0.09, 800, 320, 0.03);
    }
  }

  playDash() {
    const jitter = 0.95 + Math.random() * 0.1;
    this.whoosh(0.18, 2200 * jitter, 380, 0.085);
    this.tone(540 * jitter, 220, 0.14, 'sine', 0.055);
  }

  playCoin(combo = 1) {
    const idx = Math.min(PENTATONIC.length - 1, Math.max(0, combo - 1));
    const base = PENTATONIC[idx];
    this.tone(base, base * 1.01, 0.11, 'sine', 0.068);
    this.tone(base * 1.5, base * 1.52, 0.16, 'triangle', 0.045, 0.045);
  }

  playCast() {
    const jitter = 0.95 + Math.random() * 0.1;
    this.tone(680 * jitter, 1380 * jitter, 0.15, 'sine', 0.065);
    this.tone(420 * jitter, 840 * jitter, 0.12, 'triangle', 0.05, 0.015);
    this.whoosh(0.13, 2400, 720, 0.05);
  }

  playEnemyHit() {
    const jitter = 0.94 + Math.random() * 0.12;
    this.tone(210 * jitter, 72, 0.14, 'sawtooth', 0.07);
    this.tone(520 * jitter, 780 * jitter, 0.13, 'triangle', 0.055, 0.02);
  }

  playBossHit() {
    this.tone(160, 48, 0.28, 'sawtooth', 0.095);
    this.tone(320, 120, 0.22, 'triangle', 0.075, 0.03);
    this.whoosh(0.24, 900, 140, 0.075);
  }

  playBossDefeat() {
    const notes = [392, 493.88, 587.33, 783.99, 1046.5];
    notes.forEach((n, i) => {
      this.tone(n, n * 1.01, 0.32, 'triangle', 0.075, i * 0.075);
      this.tone(n * 0.5, n * 0.5, 0.35, 'sine', 0.05, i * 0.075);
    });
  }

  playHurt() {
    this.tone(180, 68, 0.22, 'sawtooth', 0.085);
    this.tone(130, 58, 0.25, 'triangle', 0.07, 0.03);
  }

  playRuneAwaken() {
    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, i) => {
      this.tone(freq, freq * 1.005, 0.34, 'sine', 0.068, i * 0.055);
      this.tone(freq * 2, freq * 2, 0.24, 'triangle', 0.028, i * 0.055 + 0.02);
    });
  }

  playWrong() {
    this.tone(250, 185, 0.16, 'triangle', 0.07);
    this.tone(210, 155, 0.18, 'sine', 0.055, 0.07);
  }

  playCheckpoint() {
    this.tone(587.33, 590, 0.16, 'sine', 0.06);
    this.tone(880, 885, 0.25, 'triangle', 0.06, 0.08);
  }

  playVictory() {
    const fanfare = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    fanfare.forEach((f, idx) => {
      this.tone(f, f * 1.004, 0.38, 'triangle', 0.075, idx * 0.085);
      this.tone(f * 0.5, f * 0.5, 0.42, 'sine', 0.045, idx * 0.085);
    });
  }

  playFootstep() {
    this.whoosh(0.045, 420 + Math.random() * 140, 160, 0.018);
  }
}

export const fantasyAudio = new FantasyAudioEngine();

if (typeof window !== 'undefined') {
  window.LeapAudioAAA = fantasyAudio;
}
