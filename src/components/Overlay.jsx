// Scan lines + noise + vignette. Purely decorative, never intercepts touches.
export default function Overlay() {
  return (
    <div className="overlay" aria-hidden="true">
      <div className="scanlines" />
      <div className="noise" />
      <div className="vignette" />
    </div>
  )
}
