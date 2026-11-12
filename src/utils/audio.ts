// Procedural Web Audio Engine for 16-bit Retro Cutscene

let audioCtx: AudioContext | null = null;
let isMutedState = false;

// Background music / ambient nodes
let bgmInterval: number | null = null;
let darkDroneOsc1: OscillatorNode | null = null;
let darkDroneOsc2: OscillatorNode | null = null;
let darkDroneGain: GainNode | null = null;
let staticLoopGain: GainNode | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuted(muted: boolean) {
  isMutedState = muted;
  if (muted) {
    if (darkDroneGain) darkDroneGain.gain.value = 0;
    if (staticLoopGain) staticLoopGain.gain.value = 0;
  } else {
    if (darkDroneGain) darkDroneGain.gain.value = 0.05;
    if (staticLoopGain) staticLoopGain.gain.value = 0.02;
  }
}

export function getMuted(): boolean {
  return isMutedState;
}

// 1. Typewriter letter tick
export function playTypewriterTick() {
  if (isMutedState) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650 + Math.random() * 100, now);

    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  } catch {
    // Ignore audio error
  }
}

// 2. Character Speech Blip (retro Animal Crossing / Undertale / EarthBound style)
export function playSpeechBlip(pitch = 1.0) {
  if (isMutedState) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'square';
    const baseFreq = 220 * pitch;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.setValueAtTime(baseFreq * 1.1, now + 0.02);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  } catch {
    // Ignore
  }
}

// 3. Applause sound (Scene 1 ending)
export function playApplause() {
  if (isMutedState) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const duration = 2.5;
    const now = ctx.currentTime;

    // Create clapping bursts
    for (let i = 0; i < 28; i++) {
      const delay = Math.random() * duration;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300 + Math.random() * 400, now + delay);

      gain.gain.setValueAtTime(0.025, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.06);
    }
  } catch {
    // Ignore
  }
}

// 4. Glitch burst (Scene 2, 4, 5)
export function playGlitchBurst(intensity = 1.0) {
  if (isMutedState) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * 0.25 * intensity);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (i % 8 < 4 ? 1 : -0.5);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(4, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.04 * intensity, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25 * intensity);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  } catch {
    // Ignore
  }
}

// 5. Clock tick (Scene 3)
export function playClockTick() {
  if (isMutedState) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.015);
  } catch {
    // Ignore
  }
}

// 6. Clock 12:00 PM lunch bell chime
export function playClockChime() {
  if (isMutedState) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.18;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.8);
    });
  } catch {
    // Ignore
  }
}

// 6b. Elevator Chime & Floor Ding (Scene 4)
export function playElevatorDing() {
  if (isMutedState) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(659.25, now + 0.12);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  } catch {
    // Ignore
  }
}

// 6c. Elevator Alarm Buzzer (Scene 4 Malfunction)
export function playElevatorAlarm() {
  if (isMutedState) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(740, now);
    osc.frequency.setValueAtTime(580, now + 0.08);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  } catch {
    // Ignore
  }
}

// 6d. Elevator Brake Screech & Mechanical Plunge
export function playElevatorBrakeScreech() {
  if (isMutedState) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.55);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.55);
  } catch {
    // Ignore
  }
}

// 7. Portal Drone & Suction (Scene 4)
export function playPortalPullSound() {
  if (isMutedState) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.6);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.linearRampToValueAtTime(2500, now + 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  } catch {
    // Ignore
  }
}

// 8. Dramatic Boss Appearance Bass Boom (Scene 5)
export function playBossBoom() {
  if (isMutedState) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 1.2);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  } catch {
    // Ignore
  }
}

// 9. Retro Hero Fanfare (Scene 5 Montage ending)
export function playHeroFanfare() {
  if (isMutedState) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    // C major arpeggio hero fanfare: C4, G4, C5, E5, G5, C6
    const chord = [261.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
    const now = ctx.currentTime;

    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.12;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.035, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 1.5);
    });
  } catch {
    // Ignore
  }
}

// 10. Background Music Controllers
export function startCorporateMusic() {
  stopAmbientMusic();
  const ctx = getContext();
  if (!ctx) return;

  const notes = [
    261.63, 329.63, 392.00, 523.25, // C - E - G - C
    293.66, 349.23, 440.00, 587.33, // D - F - A - D
    329.63, 392.00, 493.88, 659.25, // E - G - B - E
    349.23, 440.00, 523.25, 698.46  // F - A - C - F
  ];
  let noteIndex = 0;

  bgmInterval = window.setInterval(() => {
    if (isMutedState) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(notes[noteIndex % notes.length], now);

      gain.gain.setValueAtTime(0.018, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
      noteIndex++;
    } catch {
      // Ignore
    }
  }, 240);
}

export function startDarkRepositoryMusic() {
  stopAmbientMusic();
  const ctx = getContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Eerie low drone 1
    darkDroneOsc1 = ctx.createOscillator();
    darkDroneOsc1.type = 'sawtooth';
    darkDroneOsc1.frequency.setValueAtTime(55, now); // A1

    // Detuned drone 2
    darkDroneOsc2 = ctx.createOscillator();
    darkDroneOsc2.type = 'triangle';
    darkDroneOsc2.frequency.setValueAtTime(58.27, now); // A#1 - tense minor second clash

    darkDroneGain = ctx.createGain();
    darkDroneGain.gain.setValueAtTime(isMutedState ? 0 : 0.04, now);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, now);

    darkDroneOsc1.connect(filter);
    darkDroneOsc2.connect(filter);
    filter.connect(darkDroneGain);
    darkDroneGain.connect(ctx.destination);

    darkDroneOsc1.start(now);
    darkDroneOsc2.start(now);

    // Random dark glitch pulses
    bgmInterval = window.setInterval(() => {
      if (Math.random() > 0.45) {
        playGlitchBurst(0.6);
      }
    }, 1800);
  } catch {
    // Ignore
  }
}

export function stopAmbientMusic() {
  if (bgmInterval !== null) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
  if (darkDroneOsc1) {
    try {
      darkDroneOsc1.stop();
      darkDroneOsc1.disconnect();
    } catch {
      // Ignore
    }
    darkDroneOsc1 = null;
  }
  if (darkDroneOsc2) {
    try {
      darkDroneOsc2.stop();
      darkDroneOsc2.disconnect();
    } catch {
      // Ignore
    }
    darkDroneOsc2 = null;
  }
  if (darkDroneGain) {
    darkDroneGain = null;
  }
}
