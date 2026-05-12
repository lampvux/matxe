// BIKEWATCH '99 — Procedural Chiptune Audio Engine
// Uses Web Audio API for authentic 8-bit square-wave / noise SFX and BGM.
// No external files — everything is synthesized in real time.

const AudioEngine = (() => {
  /* ---------- State ---------- */
  let ctx = null
  let masterGain = null
  let bgmOscillators = []
  let bgmInterval = null
  let isMuted = true
  let hasUserInteracted = false
  let currentBgmNote = 0

  /* ---------- Note frequencies (equal temperament) ---------- */
  const note = (n) => 440 * Math.pow(2, (n - 69) / 12)
  const NOTES = {
    C3: note(48), D3: note(50), E3: note(52), F3: note(53),
    G3: note(55), A3: note(57), B3: note(59),
    C4: note(60), D4: note(62), E4: note(64), F4: note(65),
    G4: note(67), A4: note(69), B4: note(71),
    C5: note(72), D5: note(74), E5: note(76), F5: note(77),
    G5: note(79), A5: note(81), B5: note(83),
    C2: note(36), Eb2: note(39), G2: note(43),
    Eb3: note(51), Eb4: note(63),
    Bb3: note(58), Bb4: note(70),
    F3: note(53),
  }

  /* ---------- BGM Patterns ---------- */
  // Tense "watching" arpeggio (C minor 7) — feels like surveillance
  const ARP = [
    NOTES.C4, NOTES.Eb4, NOTES.G4, NOTES.Bb4,
    NOTES.C5, NOTES.Bb4, NOTES.G4, NOTES.Eb4,
  ]
  const BASS = [
    NOTES.C3, null, NOTES.G3, null,
    NOTES.Eb3, null, NOTES.G3, null,
  ]

  /* ---------- Helpers ---------- */
  function ensureCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)()
      masterGain = ctx.createGain()
      masterGain.gain.value = isMuted ? 0 : 0.35
      masterGain.connect(ctx.destination)
    }
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  }

  function now() {
    return ensureCtx().currentTime
  }

  function setMute(v) {
    isMuted = !!v
    if (masterGain) {
      masterGain.gain.cancelScheduledValues(now())
      masterGain.gain.setTargetAtTime(isMuted ? 0 : 0.35, now(), 0.05)
    }
    try { localStorage.setItem('bw99_mute', isMuted ? '1' : '0') } catch (e) {}
    return isMuted
  }

  function getMute() {
    return isMuted
  }

  function initFromStorage() {
    try {
      const stored = localStorage.getItem('bw99_mute')
      if (stored !== null) isMuted = stored === '1'
    } catch (e) {}
  }

  /* ---------- Core synthesis ---------- */
  function playTone(freq, duration, type = 'square', vol = 0.3, slideTo = null, when = null) {
    const c = ensureCtx()
    const t = when == null ? c.currentTime : when
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = type
    o.frequency.setValueAtTime(freq, t)
    if (slideTo != null) {
      o.frequency.exponentialRampToValueAtTime(Math.max(slideTo, 20), t + duration)
    }
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + duration)
    o.connect(g)
    g.connect(masterGain)
    o.start(t)
    o.stop(t + duration + 0.02)
    // Cleanup
    setTimeout(() => { o.disconnect(); g.disconnect() }, (duration + 0.1) * 1000)
  }

  function playNoise(duration, vol = 0.25, when = null) {
    const c = ensureCtx()
    const t = when == null ? c.currentTime : when
    const bufferSize = c.sampleRate * duration
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const src = c.createBufferSource()
    src.buffer = buffer
    const g = c.createGain()
    // Simple lowpass-ish feel by averaging (not a real filter, but cheap)
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + duration)
    src.connect(g)
    g.connect(masterGain)
    src.start(t)
    src.stop(t + duration + 0.02)
    setTimeout(() => { src.disconnect(); g.disconnect() }, (duration + 0.1) * 1000)
  }

  /* ---------- SFX ---------- */
  function sfxHonk() {
    if (isMuted) return
    const t = now()
    playTone(180, 0.15, 'sawtooth', 0.4, 120, t)
    playNoise(0.12, 0.2, t)
  }

  function sfxAlarm() {
    if (isMuted) return
    const t = now()
    // Fast alternating siren
    for (let i = 0; i < 8; i++) {
      playTone(880, 0.06, 'square', 0.25, null, t + i * 0.07)
      playTone(1100, 0.06, 'square', 0.25, null, t + i * 0.07 + 0.035)
    }
  }

  function sfxThiefWarn() {
    if (isMuted) return
    const t = now()
    playTone(NOTES.A4, 0.08, 'square', 0.3, null, t)
    playTone(NOTES.C5, 0.08, 'square', 0.3, null, t + 0.08)
    playTone(NOTES.E5, 0.08, 'square', 0.3, null, t + 0.16)
    playTone(NOTES.A5, 0.15, 'square', 0.3, null, t + 0.24)
  }

  function sfxGameOver() {
    if (isMuted) return
    const t = now()

    // 1. Noise "crash" — the moment of defeat
    playNoise(0.25, 0.35, t)

    // 2. Descending square-wave melody (classic game over feel)
    // Voice 1: high descending line
    playTone(NOTES.C5, 0.18, 'square', 0.22, NOTES.G4, t + 0.05)
    playTone(NOTES.G4, 0.18, 'square', 0.22, NOTES.Eb4, t + 0.25)
    playTone(NOTES.Eb4, 0.18, 'square', 0.22, NOTES.C4, t + 0.45)
    playTone(NOTES.C4, 0.18, 'square', 0.22, NOTES.G3, t + 0.65)
    playTone(NOTES.G3, 0.25, 'square', 0.22, NOTES.Eb3, t + 0.85)
    playTone(NOTES.Eb3, 0.35, 'square', 0.22, NOTES.C3, t + 1.10)

    // 3. Bass "womp" on triangle — the gut punch
    playTone(NOTES.C3, 0.40, 'triangle', 0.40, null, t + 0.05)
    playTone(NOTES.G2, 0.40, 'triangle', 0.40, null, t + 0.30)
    playTone(NOTES.Eb2, 0.50, 'triangle', 0.40, null, t + 0.60)
    playTone(NOTES.C2, 0.80, 'triangle', 0.45, null, t + 1.00)

    // 4. Dissonant "brzzt" at the very end (sawtooth slide)
    playTone(NOTES.F3, 0.30, 'sawtooth', 0.15, NOTES.C3, t + 1.35)
  }

  function sfxStart() {
    if (isMuted) return
    const t = now()
    playTone(NOTES.C4, 0.12, 'square', 0.25, null, t)
    playTone(NOTES.E4, 0.12, 'square', 0.25, null, t + 0.12)
    playTone(NOTES.G4, 0.2,  'square', 0.25, null, t + 0.24)
  }

  function sfxClick() {
    if (isMuted) return
    playTone(2000, 0.04, 'square', 0.15)
  }

  /* ---------- BGM Loop ---------- */
  const BPM = 90
  const STEP_S = 60 / BPM / 2 // eighth notes

  function bgmTick() {
    if (isMuted || !hasUserInteracted) return
    const t = now()
    const noteIdx = currentBgmNote % ARP.length
    const bassIdx = currentBgmNote % BASS.length

    // Arpeggio (square, quiet, 8-bit pulse feel)
    playTone(ARP[noteIdx], STEP_S * 0.9, 'square', 0.08, null, t)

    // Bass (triangle, every other step)
    if (BASS[bassIdx]) {
      playTone(BASS[bassIdx], STEP_S * 1.2, 'triangle', 0.12, null, t)
    }

    currentBgmNote++
  }

  function startBgm() {
    if (bgmInterval) return
    ensureCtx()
    currentBgmNote = 0
    bgmInterval = setInterval(bgmTick, STEP_S * 1000)
  }

  function stopBgm() {
    if (bgmInterval) {
      clearInterval(bgmInterval)
      bgmInterval = null
    }
  }

  /* ---------- User interaction gate ---------- */
  function markInteracted() {
    if (hasUserInteracted) return
    hasUserInteracted = true
    ensureCtx()
    if (!isMuted) startBgm()
  }

  /* ---------- Init ---------- */
  initFromStorage()

  // Global click/tap listener to unlock AudioContext
  const unlock = () => markInteracted()
  window.addEventListener('pointerdown', unlock, { once: true })
  window.addEventListener('keydown', unlock, { once: true })

  return {
    setMute,
    getMute,
    toggle: () => {
      const next = !isMuted
      setMute(next)
      if (!next && hasUserInteracted) startBgm()
      else if (next) stopBgm()
      return next
    },
    honk: sfxHonk,
    alarm: sfxAlarm,
    thiefWarn: sfxThiefWarn,
    gameOver: sfxGameOver,
    start: sfxStart,
    click: sfxClick,
    startBgm,
    stopBgm,
    markInteracted,
  }
})()

/* ---------- React Sound Toggle Component ---------- */
const SoundToggle = () => {
  const [muted, setMuted] = React.useState(AudioEngine.getMute())

  const handleToggle = () => {
    AudioEngine.markInteracted()
    AudioEngine.click()
    const next = AudioEngine.toggle()
    setMuted(next)
  }

  return (
    <button
      onClick={handleToggle}
      title={muted ? 'Unmute sound' : 'Mute sound'}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 10,
        background: muted ? 'var(--paper)' : 'var(--lime-zap)',
        color: 'var(--ink)',
        border: '2px solid var(--ink)',
        padding: '6px 10px',
        cursor: 'pointer',
        boxShadow: '3px 3px 0 0 var(--ink)',
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 14 }}>{muted ? '[X]' : '((('}</span>
      <span>{muted ? 'MUTED' : 'SOUND'}</span>
    </button>
  )
}

window.AudioEngine = AudioEngine
window.SoundToggle = SoundToggle
