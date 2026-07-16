/**
 * Procedural sound effects via Web Audio API.
 * No external files — works offline on phone browsers.
 */
(function () {
  'use strict';

  let ctx = null;
  let enabled = true;

  function getCtx() {
    if (!ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      ctx = new Ctx();
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  function unlock() {
    getCtx();
  }

  function playTone(freq, duration, options = {}) {
    if (!enabled) return;
    const audio = getCtx();
    if (!audio) return;

    const {
      type = 'square',
      volume = 0.07,
      attack = 0.008,
      decay = duration,
      detune = 0,
    } = options;

    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const now = audio.currentTime;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (detune) osc.detune.setValueAtTime(detune, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(now);
    osc.stop(now + decay + 0.02);
  }

  function playNoise(duration, volume = 0.04) {
    if (!enabled) return;
    const audio = getCtx();
    if (!audio) return;

    const bufferSize = Math.floor(audio.sampleRate * duration);
    const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const source = audio.createBufferSource();
    const gain = audio.createGain();
    const now = audio.currentTime;

    source.buffer = buffer;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.connect(gain);
    gain.connect(audio.destination);
    source.start(now);
  }

  function playSequence(notes, gap = 0.07) {
    if (!enabled) return;
    const audio = getCtx();
    if (!audio) return;

    notes.forEach((note, i) => {
      const start = audio.currentTime + i * gap;
      const osc = audio.createOscillator();
      const gain = audio.createGain();

      osc.type = note.type || 'triangle';
      osc.frequency.setValueAtTime(note.freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(note.volume || 0.08, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + (note.duration || 0.15));

      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(start);
      osc.stop(start + (note.duration || 0.15) + 0.02);
    });
  }

  const sounds = {
    move() {
      playTone(280, 0.07, { type: 'square', volume: 0.045 });
    },

    rotate() {
      playTone(420, 0.05, { type: 'triangle', volume: 0.05 });
      playTone(560, 0.07, { type: 'triangle', volume: 0.04, attack: 0.02 });
    },

    bump() {
      playTone(90, 0.1, { type: 'sawtooth', volume: 0.035 });
    },

    spawn() {
      playTone(660, 0.06, { type: 'sine', volume: 0.035 });
      playTone(880, 0.08, { type: 'sine', volume: 0.03, attack: 0.02 });
    },

    land() {
      playTone(110, 0.14, { type: 'sine', volume: 0.09 });
      playNoise(0.06, 0.05);
    },

    fuse(params = {}) {
      const count = params.count || 3;
      const base = 520;
      const notes = [];
      const steps = Math.min(6, Math.max(3, Math.floor(count / 2) + 2));
      for (let i = 0; i < steps; i++) {
        notes.push({
          freq: base * Math.pow(1.12, i),
          duration: 0.12,
          volume: 0.07,
          type: 'triangle',
        });
      }
      playSequence(notes, 0.055);
      playTone(1046, 0.2, { type: 'sine', volume: 0.06, attack: 0.02 });
    },

    stand() {
      playTone(180, 0.1, { type: 'sawtooth', volume: 0.05 });
      playTone(260, 0.12, { type: 'triangle', volume: 0.06, attack: 0.02 });
      playTone(392, 0.16, { type: 'sine', volume: 0.05, attack: 0.04 });
    },

    climb(params = {}) {
      const row = params.row ?? 8;
      const pitch = 220 + (ROWS_REF - row) * 28;
      playTone(pitch, 0.09, { type: 'square', volume: 0.05 });
      playNoise(0.04, 0.025);
      playTone(pitch * 1.25, 0.1, { type: 'triangle', volume: 0.04, attack: 0.03 });
    },

    win() {
      playSequence([
        { freq: 523, duration: 0.14, type: 'triangle' },
        { freq: 659, duration: 0.14, type: 'triangle' },
        { freq: 784, duration: 0.14, type: 'triangle' },
        { freq: 1046, duration: 0.28, type: 'sine', volume: 0.09 },
      ], 0.1);
      playSequence([
        { freq: 1318, duration: 0.2, type: 'sine', volume: 0.05 },
        { freq: 1568, duration: 0.35, type: 'sine', volume: 0.06 },
      ], 0.35);
    },

    gameOver() {
      playTone(196, 0.25, { type: 'sawtooth', volume: 0.06 });
      playTone(146, 0.35, { type: 'sawtooth', volume: 0.05, attack: 0.15 });
      playTone(98, 0.5, { type: 'sine', volume: 0.05, attack: 0.25 });
    },

    restart() {
      playTone(330, 0.08, { type: 'sine', volume: 0.04 });
      playTone(440, 0.1, { type: 'sine', volume: 0.035, attack: 0.03 });
    },
  };

  let ROWS_REF = 16;

  window.Sfx = {
    play(name, params) {
      unlock();
      const fn = sounds[name];
      if (fn) fn(params);
    },
    setEnabled(value) {
      enabled = Boolean(value);
    },
    isEnabled() {
      return enabled;
    },
    toggle() {
      enabled = !enabled;
      return enabled;
    },
    unlock,
    setRows(rows) {
      ROWS_REF = rows;
    },
  };

  document.addEventListener(
    'pointerdown',
    () => unlock(),
    { once: false, passive: true }
  );
})();
