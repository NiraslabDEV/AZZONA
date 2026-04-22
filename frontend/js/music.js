// ── Azzona House Engine — 124 BPM ─────────────────────────────
let audioCtx = null, masterGain = null, isPlaying = false;
let schedulerTimer = null, currentBeat = 0, nextBeatTime = 0;
const BPM = 124, BEAT = 60 / BPM;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.35;
  masterGain.connect(audioCtx.destination);
}

function noise(dur) {
  const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * dur, audioCtx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

function kick(t) {
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.frequency.setValueAtTime(200, t);
  o.frequency.exponentialRampToValueAtTime(45, t + 0.08);
  g.gain.setValueAtTime(1.5, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  o.connect(g); g.connect(masterGain);
  o.start(t); o.stop(t + 0.41);
}

function hihat(t, open = false, accent = false) {
  const src = audioCtx.createBufferSource();
  src.buffer = noise(open ? 0.35 : 0.06);
  const hpf = audioCtx.createBiquadFilter();
  hpf.type = 'highpass'; hpf.frequency.value = open ? 6000 : 9000;
  const g = audioCtx.createGain();
  const vol = accent ? (open ? 0.22 : 0.18) : (open ? 0.14 : 0.1);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + (open ? 0.28 : 0.05));
  src.connect(hpf); hpf.connect(g); g.connect(masterGain);
  src.start(t); src.stop(t + (open ? 0.3 : 0.07));
}

function clap(t) {
  for (let i = 0; i < 3; i++) {
    const src = audioCtx.createBufferSource();
    src.buffer = noise(0.12);
    const bpf = audioCtx.createBiquadFilter();
    bpf.type = 'bandpass'; bpf.frequency.value = 900 + i * 400; bpf.Q.value = 0.8;
    const g = audioCtx.createGain();
    const d = i * 0.008;
    g.gain.setValueAtTime(0, t + d);
    g.gain.linearRampToValueAtTime(0.55, t + d + 0.003);
    g.gain.exponentialRampToValueAtTime(0.001, t + d + 0.15);
    src.connect(bpf); bpf.connect(g); g.connect(masterGain);
    src.start(t + d); src.stop(t + d + 0.2);
  }
}

function midiToHz(m) { return 440 * Math.pow(2, (m - 69) / 12); }

const bassNotes = [41, 41, 46, 41, 44, 44, 48, 46];
function bass(t, beat) {
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  const lpf = audioCtx.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.setValueAtTime(600, t);
  lpf.frequency.exponentialRampToValueAtTime(200, t + BEAT * 0.3);
  o.type = 'sawtooth'; o.frequency.value = midiToHz(bassNotes[beat % bassNotes.length]);
  o.connect(lpf); lpf.connect(g); g.connect(masterGain);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.65, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.001, t + BEAT * 0.7);
  o.start(t); o.stop(t + BEAT);
}

const stabChords = [[53,57,60,65],[51,56,58,63],[48,53,55,60],[56,60,63,68]];
function stab(t, bar) {
  stabChords[bar % stabChords.length].forEach(note => {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    const lpf = audioCtx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(3000, t);
    lpf.frequency.exponentialRampToValueAtTime(800, t + 0.2);
    o.type = 'sawtooth'; o.frequency.value = midiToHz(note);
    g.gain.setValueAtTime(0.09, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    o.connect(lpf); lpf.connect(g); g.connect(masterGain);
    o.start(t); o.stop(t + 0.3);
  });
}

const padChords = [[41,48,53,56],[39,46,51,54],[36,43,48,51],[44,51,56,59]];
function pad(t, bar) {
  padChords[bar % padChords.length].forEach(note => {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine'; o.frequency.value = midiToHz(note + 12);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.03, t + 0.8);
    g.gain.linearRampToValueAtTime(0, t + BEAT * 8);
    o.connect(g); g.connect(masterGain);
    o.start(t); o.stop(t + BEAT * 8);
  });
}

function scheduleBeat() {
  while (nextBeatTime < audioCtx.currentTime + 0.3) {
    const b = currentBeat;
    const t = nextBeatTime;
    const step = b % 16;
    if (step % 4 === 0) kick(t);
    if (step === 4 || step === 12) clap(t);
    if (step % 2 === 0) hihat(t, step === 8, step % 4 === 0);
    else hihat(t, false, false);
    if (step % 2 === 0) bass(t, Math.floor(b / 2));
    if (step === 0 || step === 10) stab(t, Math.floor(b / 16));
    if (b % 16 === 0) pad(t, Math.floor(b / 16));
    currentBeat++;
    nextBeatTime += BEAT / 4;
  }
  schedulerTimer = setTimeout(scheduleBeat, 60);
}

function startMusic() {
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  currentBeat = 0;
  nextBeatTime = audioCtx.currentTime + 0.1;
  scheduleBeat();
  isPlaying = true;
  document.getElementById('musicBar').classList.add('visible');
  document.getElementById('barEq').classList.remove('paused');
  const btn = document.getElementById('musicToggle');
  if (btn) btn.textContent = '▐▐ Pause';
  const bBtn = document.getElementById('barToggleBtn');
  if (bBtn) bBtn.textContent = '▐▐ Pause';
}

function stopMusic() {
  clearTimeout(schedulerTimer);
  isPlaying = false;
  document.getElementById('barEq').classList.add('paused');
  const btn = document.getElementById('musicToggle');
  if (btn) btn.textContent = '▶ Play';
  const bBtn = document.getElementById('barToggleBtn');
  if (bBtn) bBtn.textContent = '▶ Play';
  if (audioCtx) audioCtx.suspend();
}

window.toggleMusic = function () { isPlaying ? stopMusic() : startMusic(); };
window.setVolume = function (v) {
  if (masterGain) masterGain.gain.value = parseFloat(v);
  const s = document.getElementById('volSlider');
  const sb = document.getElementById('volSliderBar');
  if (s) s.value = v;
  if (sb) sb.value = v;
};

// Autoplay on first interaction
let musicStarted = false;
function tryAutoplay() {
  if (musicStarted) return;
  musicStarted = true;
  startMusic();
  document.removeEventListener('click', tryAutoplay);
  document.removeEventListener('scroll', tryAutoplay);
  document.removeEventListener('touchstart', tryAutoplay);
}
window.addEventListener('load', () => {
  try { startMusic(); musicStarted = true; } catch (_) {
    document.addEventListener('click', tryAutoplay);
    document.addEventListener('scroll', tryAutoplay, { passive: true });
    document.addEventListener('touchstart', tryAutoplay, { passive: true });
  }
});
