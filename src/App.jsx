import { useCallback, useEffect, useRef, useState } from 'react'
import Overlay from './components/Overlay.jsx'
import StartScreen from './components/StartScreen.jsx'
import ScanScreen from './components/ScanScreen.jsx'
import RevealScreen from './components/RevealScreen.jsx'
import { createSfx, vibrate } from './lib/sfx.js'
import { enterFullscreen, exitFullscreen } from './lib/fullscreen.js'

export default function App() {
  // Check if setup screen was explicitly requested via URL (?setup=1 or ?start=1)
  const isSetupMode = typeof window !== 'undefined' && (new URLSearchParams(window.location.search).has('setup') || new URLSearchParams(window.location.search).has('start'))

  const [stage, setStage] = useState(isSetupMode ? 'start' : 'scan')
  const [sound, setSound] = useState(true)
  const [vibration, setVibration] = useState(true)
  const [sfx, setSfx] = useState(null)
  const sfxRef = useRef(null)

  const closeAudio = useCallback(() => {
    sfxRef.current?.close()
    sfxRef.current = null
    setSfx(null)
  }, [])

  const startScan = useCallback(() => {
    closeAudio()
    if (sound) {
      sfxRef.current = createSfx()
      setSfx(sfxRef.current)
    }
    enterFullscreen()
    setStage('scan')
  }, [closeAudio, sound])

  // Initialize audio and unlock fullscreen + audio on first user tap/interaction
  useEffect(() => {
    // Attempt fullscreen immediately on mount (works in some webviews/PWAs)
    enterFullscreen()

    if (sound && !sfxRef.current) {
      sfxRef.current = createSfx()
      setSfx(sfxRef.current)
    }

    const unlock = () => {
      sfxRef.current?.resume?.()
      enterFullscreen()
    }

    const events = ['click', 'touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown']
    events.forEach((ev) => window.addEventListener(ev, unlock, { passive: true }))

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, unlock))
    }
  }, [sound])

  const finish = useCallback(() => {
    sfxRef.current?.success()
    if (vibration) vibrate([60, 40, 60, 40, 200])
    exitFullscreen() // release fullscreen at the reveal
    setStage('reveal')
  }, [vibration])

  useEffect(() => () => { sfxRef.current?.close(); exitFullscreen() }, [])

  return (
    <div className={`app stage-${stage}`}>
      <Overlay />
      {stage === 'start' && (
        <StartScreen sound={sound} vibration={vibration} onSound={setSound} onVibration={setVibration} onStart={startScan} />
      )}
      {stage === 'scan' && <ScanScreen sfx={sfx} vibration={vibration} onDone={finish} />}
      {stage === 'reveal' && <RevealScreen onRestart={startScan} />}
    </div>
  )
}
