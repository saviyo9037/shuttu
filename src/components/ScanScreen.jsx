import { useEffect, useRef, useState } from 'react'
import GlitchText from './GlitchText.jsx'
import TerminalLog from './TerminalLog.jsx'
import ProgressBar from './ProgressBar.jsx'
import { vibrate } from '../lib/sfx.js'

export const DURATION = 30

const PHASES = [
  [0, 'Initializing security scan...'],
  [6, 'Analyzing system status...'],
  [12, 'Scanning simulated network activity...'],
  [19, 'Checking fictional security modules...'],
  [26, 'WARNING: SIMULATED BREACH DETECTED'],
]

export default function ScanScreen({ sfx, vibration, onDone }) {
  const [elapsed, setElapsed] = useState(0)
  const lastSecond = useRef(DURATION)

  // Main clock: derived from real time so background throttling can't stretch it.
  useEffect(() => {
    const start = performance.now()
    const id = setInterval(() => {
      const e = (performance.now() - start) / 1000
      if (e >= DURATION) {
        clearInterval(id)
        setElapsed(DURATION)
        onDone()
      } else setElapsed(e)
    }, 100)
    return () => clearInterval(id)
  }, [onDone])

  const left = Math.max(0, Math.ceil(DURATION - elapsed))
  const phase = [...PHASES].reverse().find(([t]) => elapsed >= t)[1]
  const critical = elapsed >= 26
  const urgent = left <= 10

  // One tick per displayed second: sound + optional vibration.
  useEffect(() => {
    if (left === lastSecond.current || left === 0) return
    lastSecond.current = left
    if (critical) sfx?.alarm(left)
    else sfx?.tick(urgent, left)
    if (vibration && urgent) vibrate(critical ? [100, 50, 100, 50, 150] : 60)
  }, [left, critical, urgent, sfx, vibration])

  return (
    <main className={`screen scan ${critical ? 'critical' : ''}`}>
      <header className="alert-panel">
        <GlitchText as="h1" className="headline">⚠️ SECURITY BREACH DETECTED</GlitchText>
        <p>Unauthorized access detected on this device.</p>
      </header>

      <section className="countdown" aria-live="polite">
        <span className={`count ${urgent ? 'urgent' : ''}`}>{String(left).padStart(2, '0')}</span>
        <span className="count-unit">seconds</span>
      </section>

      <ProgressBar value={elapsed / DURATION} danger={critical} />
      <p className={`phase ${critical ? 'phase-critical' : ''}`}>{phase}</p>

      <TerminalLog speed={critical ? 90 : 220} />

      <footer className="sim-note">Simulation · fictional · nothing is happening to your phone</foote