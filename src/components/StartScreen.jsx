import GlitchText from './GlitchText.jsx'

export default function StartScreen({ sound, vibration, onSound, onVibration, onStart }) {
  return (
    <main className="screen center">
      <p className="tag">Visual simulation · nothing is installed or accessed</p>
      <GlitchText>PHANTOM HACK</GlitchText>
      <p className="lead">A harmless 30-second hacker movie scene, built for pranks. Hand the phone to a friend, or tap to try it yourself.</p>

      <div className="toggles">
        <label><input type="checkbox" checked={sound} onChange={(e) => onSound(e.target.checked)} /> Sound effects</label>
        <label><input type="checkbox" checked={vibration} onChange={(e) => onVibration(e.target.checked)} /> Vibration</label>
      </div>

      <button className="btn primary" onClick={onStart}>Start simulation</button>
      <p className="fine">Goes fullscreen if your browser allows it. You can leave any time with the Exit button.</p>
    </main>
  )
}
