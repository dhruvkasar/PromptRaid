let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const playBeep = (freq = 440, type: OscillatorType = 'square', duration = 0.1) => {
  initAudio();
  if (!audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

export const playCountdown = () => playBeep(440, 'square', 0.15);
export const playFight = () => playBeep(880, 'sawtooth', 0.4);

export const playCrash = () => {
  initAudio();
  if (!audioCtx) return;
  
  const bufferSize = audioCtx.sampleRate * 0.5; // 0.5 seconds
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);
  
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
  
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  
  noise.start();
};

export const playFanfare = () => {
  initAudio();
  if (!audioCtx) return;
  
  const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
  let time = audioCtx.currentTime;
  notes.forEach((freq) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0.15, time);
    gain.gain.linearRampToValueAtTime(0, time + 0.2);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(time);
    osc.stop(time + 0.2);
    time += 0.15;
  });
};

let bgmInterval: number | null = null;

export const startBGM = () => {
  initAudio();
  if (!audioCtx || bgmInterval) return;
  
  // High energy 8-bit style arpeggio
  const notes = [220, 261.63, 329.63, 392.00, 440, 392.00, 329.63, 261.63]; // A minor pentatonic
  let step = 0;
  
  bgmInterval = window.setInterval(() => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = notes[step % notes.length];
    
    // Slight detune for fatter sound
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'square';
    osc2.frequency.value = notes[step % notes.length] * 1.01;
    
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc2.start();
    osc.stop(audioCtx.currentTime + 0.1);
    osc2.stop(audioCtx.currentTime + 0.1);
    
    step++;
  }, 120); // Fast tempo
};

export const stopBGM = () => {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
};
