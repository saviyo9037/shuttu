// Advanced WebAudio sound kit with full-volume limiter and dynamic cyber SFX
export function createSfx() {
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null
  const ctx = new Ctx()

  // Master Dynamics Compressor: acts as a brickwall limiter allowing maximum loud volume without clipping distortion
  const compressor = ctx.createDynamicsCompressor()
  compressor.threshold.setValueAtTime(-6, ctx.currentTime)
  compressor.knee.setValueAtTime(20, ctx.currentTime)
  compressor.ratio.setValueAtTime(16, ctx.currentTime)
  compressor.attack.setValueAtTime(0.003, ctx.currentTime)
  compressor.release.setValueAtTime(0.2, ctx.currentTime)

  // Master Gain set to full maximum output
  const masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(1.0, ctx.currentTime)

  masterGain.connect(compressor)
  compressor.connect(ctx.destination)

  const resume = () => {
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
  }

  // Play a layered tone through the master compressor
  const playTone = ({ freq, endFreq, dur = 0.1, type = 'sawtooth', vol = 0.8, delay = 0 }) => {
    if (ctx.state === 'closed') return
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})

    const t = ctx.currentTime + delay
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    if (endFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t + dur)
    }

    gain.gain.setValueAtTime(vol, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)

    osc.connect(gain).connect(masterGain)
    osc.start(t)
    osc.stop(t + dur + 0.05)
  }

  // Calculate escalating volume factor (starts loud at 0.7, ramps automatically to 1.0 full blast)
  const getEscalatedVol = (left = 30) => {
    const progress = Math.max(0, Math.min(1, (30 - left) / 30))
    return 0.7 + progress * 0.3 // Automatically scales from 70% to 100% full sound
  }

  return {
    resume,

    // High-tech Cyber Sonar Ping & Alert (used in initial and urgent stages)
    tick: (urgent, left = 20) => {
      const vol = getEscalatedVol(left)

      if (urgent) {
        // URGENT: Dual-frequency cyber warning siren (harsh alternating klaxon pulse)
        playTone({ freq: 880, endFreq: 1100, dur: 0.18, type: 'sawtooth', vol: vol * 0.95 })
        playTone({ freq: 440, endFreq: 550, dur: 0.22, type: 'triangle', vol: vol * 0.9, delay: 0.02 })
        playTone({ freq: 1760, endFreq: 1200, dur: 0.12, type: 'square', vol: vol * 0.6, delay: 0.06 })
      } else {
        // STANDARD: Sci-fi cyber radar ping with sub-bass resonance
        playTone({ freq: 1050, endFreq: 620, dur: 0.14, type: 'sine', vol: vol * 0.85 })
        playTone({ freq: 2100, endFreq: 1300, dur: 0.08, type: 'triangle', vol: vol * 0.5 })
        playTone({ freq: 120, endFreq: 80, dur: 0.16, type: 'triangle', vol: vol * 0.7 })
      }
    },

    // CRITICAL BREACH: Full blast emergency alarm siren with siren warble + bass impact
    alarm: (left = 4) => {
      const vol = getEscalatedVol(left)

      // Dual detuned screeching siren oscillators (Loud red alert alarm)
      playTone({ freq: 950, endFreq: 650, dur: 0.28, type: 'sawtooth', vol: 1.0 })
      playTone({ freq: 970, endFreq: 670, dur: 0.28, type: 'sawtooth', vol: 0.9 })
      playTone({ freq: 480, endFreq: 320, dur: 0.32, type: 'square', vol: 0.85, delay: 0.04 })

      // Heavy bass breach impact pulse
      playTone({ freq: 85, endFreq: 35, dur: 0.35, type: 'triangle', vol: 1.0 })

      // Second siren echo warble
      playTone({ freq: 1250, endFreq: 850, dur: 0.22, type: 'sawtooth', vol: 0.95, delay: 0.26 })
    },

    // REVEAL: Loud cheerful celebration fanfare
    success: () => {
      const chords = [
        { f: 523.25, d: 0.0 }, // C5
        { f: 659.25, d: 0.1 }, // E5
        { f: 783.99, d: 0.2 }, // G5
        { f: 1046.50, d: 0.3 }, // C6
        { f: 1318.51, d: 0.45 }, // E6
      ]
      chords.forEach(({ f, d }) => {
        playTone({ freq: f, dur: 0.45, type: 'triangle', vol: 0.9, delay: d })
        playTone({ freq: f * 0.5, dur: 0.5, type: 'sine', vol: 0.8, delay: d })
      })
      // Final triumphant chord
      setTimeout(() => {
        [523.25, 659.25, 783.99, 1046.50].forEach((f) => {
          playTone({ freq: f, dur: 0.9, type: 'triangle', vol: 0.85 })
        })
      }, 550)
    },

    close: () => {
      if (ctx.state !== 'closed') ctx.close().catch(() => {})
    },
  }
}

export const vibrate = (pattern) => {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern)
  } catch {
    /* unsupported */
  }
}

